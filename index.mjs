import { ADVERSARY_DATA } from "./data.mjs";

const fapi = foundry.applications.api;

Hooks.on("getActorContextOptions", (directory, options) => {
    const deleteIdx = options.findIndex((o) => o.name === "SIDEBAR.Delete");
    console.log(options);
    options.splice(deleteIdx !== -1 ? deleteIdx : options.length - 1, 0, {
        name: "Duplicate To New Tier",
        icon: `<i class="fa-solid fa-arrow-trend-up" inert></i>`,
        condition: (li) => {
            const actor = game.actors.get(li.dataset.entryId);
            return actor?.type === "adversary" && actor.system.type !== "social";
        },
        callback: async (li) => {
            const actor = game.actors.get(li.dataset.entryId);
            if (!actor) throw new Error("Unexpected missing actor");

            const result = await fapi.Dialog.input({
                window: { title: "Pick a new tier for this adversary" },
                content: '<input name="tier" type="number" min="1" max="4" step="1" autofocus>',
                ok: {
                    label: "Create Adversary",
                    callback: (event, button, dialog) => Math.clamp(button.form.elements.tier.valueAsNumber, 1, 4)
                }
            });

            if (result === actor.system.tier) {
                ui.notifications.warn("This actor is already at this tier");
            } else if (result) {
                retierAdversary(actor, result);
            }
        }
    })
});

async function retierAdversary(actor, tier) {
    const source = actor.toObject(true);
    console.log("Actors and source", actor, source);

    /** @type {(2 | 3 | 4)[]} */
    const tiers = new Array(Math.abs(tier - actor.system.tier)).fill(0).map((_, idx) => idx + Math.min(tier, actor.system.tier) + 1);
    if (tier < actor.system.tier) tiers.reverse();

    const typeData = ADVERSARY_DATA[source.system.type] ?? ADVERSARY_DATA[source.system.standard];
    const tierData = tiers.map((t) => ({ tier: t, ...typeData[t] }));

    // Apply simple tier changes
    const scale = tier > actor.system.tier ? 1 : -1;
    for (const entry of tierData) {
        source.system.difficulty += scale * entry.difficulty;
        source.system.damageThresholds.major += scale * entry.majorThreshold;
        source.system.damageThresholds.severe += scale * entry.severeThreshold;
        source.system.resources.hitPoints.max += scale * entry.hp;
        source.system.resources.stress.max += scale * entry.stress;
        source.system.attack.roll.bonus += scale * entry.attack;
    }

    // Calculate mean and standard deviation of expected damage ranges in each tier. Also create a function to remap damage
    const currentDamageRange = analyzeDamageRange(typeData[source.system.tier].damage);
    const newDamageRange = analyzeDamageRange(typeData[tier].damage);
    const convertDamage = (damage, newMean) => {
        const hitPointParts = damage.parts.filter((d) => d.applyTo === "hitPoints");
        if (hitPointParts.length === 1 && !hitPointParts[0].value.custom.enabled) {
            const value = hitPointParts[0].value;
            value.flatMultiplier = Math.max(0, value.flatMultiplier + tier - source.system.tier)
            const baseAverage = value.flatMultiplier * (Number(value.dice.replace("d", "")) + 1) / 2;
            value.bonus = Math.round(newMean - baseAverage);
        } else {
            ui.notifications.error(`Failed to convert item ${item.name}: Other kinds of damage is currently unsupported`);
        }
    }

    // Update damage of base attack
    const atkAverage = parseDamage(source.system.attack.damage).mean;
    const deviation = (atkAverage - currentDamageRange.mean) / currentDamageRange.standardDeviation;
    const newAtkAverage = newDamageRange.mean + newDamageRange.standardDeviation * deviation;
    const damage = source.system.attack.damage;
    convertDamage(damage, newAtkAverage);

    // Update damage of each item action, making sure to also update the description if possible
    for (const item of source.items) {
        // todo: damage inlines (must be done before other changes so that it doesn't get incorrectly applied)

        for (const action of Object.values(item.system.actions)) {
            const damage = action.damage;
            if (!damage) continue;
            const { formula, mean } = parseDamage(damage);
            if (mean === 0) continue;

            const deviation = (mean - currentDamageRange.mean) / currentDamageRange.standardDeviation;
            const newMean = newDamageRange.mean + newDamageRange.standardDeviation * deviation;
            convertDamage(damage, newMean);

            const oldFormulaRegexp = new RegExp(formula.replace("+", "(?:\\s)?\\+(?:\\s)?"));
            const newFormula = parseDamage(action.damage).formula;
            item.system.description = item.system.description.replace(oldFormulaRegexp, newFormula);
            action.description = action.description.replace(oldFormulaRegexp, newFormula);
        }
    }

    // Finally set the tier of the source data, now that everything is complete
    source.system.tier = tier;

    await Actor.create(source);
    ui.notifications.info(`Tier ${tier} ${actor.name} created`);
}

/** Parses damage data from an attack or an action */
function parseDamage(damage) {
    const formula = damage.parts
        .filter((p) => p.applyTo === "hitPoints")
        .map((p) =>
            p.value.custom.enabled
                ? p.value.custom.formula
                : [p.value.flatMultiplier ? `${p.value.flatMultiplier}${p.value.dice}` : 0, p.value.bonus ?? 0]
                        .filter(p => !!p)
                        .join('+')
        )
        .join("+");
    const terms = parseTermsFromSimpleFormula(formula);
    const mean = terms.reduce((r, t) => r + (t.modifier ?? 0) + (t.dice ? t.dice * (t.faces + 1) / 2 : 0), 0);
    return { formula, terms, mean };
}

/** Returns the mean and standard deviation of a series of average damages */
function analyzeDamageRange(range) {
    if (range.length <= 1) throw Error("Unexpected damage range, must have at least two entries")
    const mean = range.reduce((a, b) => a + b, 0) / range.length;
    const deviations = range.map((r) => r - mean);
    const standardDeviation = Math.sqrt(deviations.reduce((r, d) => r + d * d, 0) / (range.length - 1));
    return { mean, standardDeviation }
}

/**
 * Given a simple flavor-less formula with only +/- operators, returns a list of damage partial terms.
 * All subtracted terms become negative terms.
 */
function parseTermsFromSimpleFormula(formula) {
    const roll = formula instanceof Roll ? formula : new Roll(formula);

    // Parse from right to left so that when we hit an operator, we already have the term.
    return roll.terms.reduceRight(
        (result, term) => {
            // Ignore + terms, we assume + by default
            if (term.expression === " + ") return result;

            // - terms modify the last term we parsed
            if (term.expression === " - ") {
                const termToModify = result[0];
                if (termToModify) {
                    if (termToModify.modifier) termToModify.modifier *= -1;
                    if (termToModify.dice) termToModify.dice *= -1;
                }
                return result;
            }

            result.unshift({
                modifier: term instanceof foundry.dice.terms.NumericTerm ? term.number : 0,
                dice: term instanceof foundry.dice.terms.Die ? term.number : 0,
                faces: term.faces ?? null,
            });

            return result;
        },
        [],
    );
}
