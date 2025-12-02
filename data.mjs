
/** 
 * @typedef {Object} TierData
 * @property {number} difficulty
 * @property {number} majorThreshold
 * @property {number} severeThreshold
 * @property {number} hp
 * @property {number} stress
 * @property {number} attack
 * @property {number[]} damage
 */

/** @typedef {Record<2 | 3 | 4, TierData> & Record<1, { damage: number[] }} AdversaryScalingData */

/** @type {Record<string, AdversaryScalingData>} */
export const ADVERSARY_DATA = {
    bruiser: {
        1: {
            damage: [8, 11]
        },
        2: {
            difficulty: 2,
            majorThreshold: 5,
            severeThreshold: 10,
            hp: 1,
            stress: 2,
            attack: 2,
            damage: [12, 16]
        },
        3: {
            difficulty: 2,
            majorThreshold: 7,
            severeThreshold: 15,
            hp: 1,
            stress: 0,
            attack: 2,
            damage: [18, 22]
        },
        4: {
            difficulty: 2,
            majorThreshold: 12,
            severeThreshold: 25,
            hp: 1,
            stress: 0,
            attack: 2,
            damage: [30, 45]
        },
    },
    horde: {
        1: {
            damage: [5, 8]
        },
        2: {
            difficulty: 2,
            majorThreshold: 5,
            severeThreshold: 8,
            hp: 2,
            stress: 0,
            attack: 0,
            damage: [9, 13],
        },
        3: {
            difficulty: 2,
            majorThreshold: 5,
            severeThreshold: 12,
            hp: 0,
            stress: 1,
            attack: 1,
            damage: [14, 19]
        },
        4: {
            difficulty: 2,
            majorThreshold: 10,
            severeThreshold: 15,
            hp: 2,
            stress: 0,
            attack: 0,
            damage: [20, 30],
        },
    },
    leader: {
        1: {
            damage: [6, 9]
        },
        2: {
            difficulty: 2,
            majorThreshold: 6,
            severeThreshold: 10,
            hp: 0,
            stress: 0,
            attack: 1,
            damage: [12, 15]
        },
        3: {
            difficulty: 2,
            majorThreshold: 6,
            severeThreshold: 15,
            hp: 1,
            stress: 0,
            attack: 2,
            damage: [15, 18]
        },
        4: {
            difficulty: 2,
            majorThreshold: 12,
            severeThreshold: 25,
            hp: 1,
            stress: 1,
            attack: 3,
            damage: [25, 35]
        },
    },
    minion: {
        1: {
            damage: [1, 3]
        },
        2: {
            difficulty: 2,
            majorThreshold: 0,
            severeThreshold: 0,
            hp: 0,
            stress: 0,
            attack: 1,
            damage: [2, 4]
        },
        3: {
            difficulty: 2,
            majorThreshold: 0,
            severeThreshold: 0,
            hp: 0,
            stress: 1,
            attack: 1,
            damage: [5, 8],
        },
        4: {
            difficulty: 2,
            majorThreshold: 0,
            severeThreshold: 0,
            hp: 0,
            stress: 0,
            attack: 1,
            damage: [10, 12],
        }
    },
    ranged: {
        1: {
            damage: [6, 9]
        },
        2: {
            difficulty: 2,
            majorThreshold: 3,
            severeThreshold: 6,
            hp: 1,
            stress: 0,
            attack: 1,
            damage: [12, 16]
        },
        3: {
            difficulty: 2,
            majorThreshold: 7,
            severeThreshold: 14,
            hp: 1,
            stress: 1,
            attack: 2,
            damage: [15, 18]
        },
        4: {
            difficulty: 2,
            majorThreshold: 5,
            severeThreshold: 10,
            hp: 1,
            stress: 1,
            attack: 1,
            damage: [25, 35]
        },
    },
    skulk: {
        1: {
            damage: [5, 8]
        },
        2: {
            difficulty: 2,
            majorThreshold: 3,
            severeThreshold: 8,
            hp: 1,
            stress: 1,
            attack: 1,
            damage: [9, 13]
        },
        3: {
            difficulty: 2,
            majorThreshold: 8,
            severeThreshold: 12,
            hp: 1,
            stress: 1,
            attack: 1,
            damage: [14, 18]
        },
        4: {
            difficulty: 2,
            majorThreshold: 8,
            severeThreshold: 10,
            hp: 1,
            stress: 1,
            attack: 1,
            damage: [20, 35],
        },
    },
    solo: {
        1: {
            damage: [8, 11]
        },
        2: {
            difficulty: 2,
            majorThreshold: 5,
            severeThreshold: 10,
            hp: 0,
            stress: 1,
            attack: 2,
            damage: [15, 20]
        },
        3: {
            difficulty: 2,
            majorThreshold: 7,
            severeThreshold: 15,
            hp: 2,
            stress: 1,
            attack: 2,
            damage: [20, 30],
        },
        4: {
            difficulty: 2,
            majorThreshold: 12,
            severeThreshold: 25,
            hp: 0,
            stress: 1,
            attack: 3,
            damage: [30, 45],
        },
    },
    standard: {
        1: {
            damage: [4, 6]
        },
        2: {
            difficulty: 2,
            majorThreshold: 3,
            severeThreshold: 8,
            hp: 0,
            stress: 0,
            attack: 1,
            damage: [8, 12]
        },
        3: {
            difficulty: 2,
            majorThreshold: 7,
            severeThreshold: 15,
            hp: 1,
            stress: 1,
            attack: 1,
            damage: [12, 17],
        },
        4: {
            difficulty: 2,
            majorThreshold: 10,
            severeThreshold: 15,
            hp: 0,
            stress: 1,
            attack: 1,
            damage: [17, 20],
        },
    },
    support: {
        1: {
            damage: [3, 5]
        },
        2: {
            difficulty: 2,
            majorThreshold: 3,
            severeThreshold: 8,
            hp: 1,
            stress: 1,
            attack: 1,
            damage: [5, 12],
        },
        3: {
            difficulty: 2,
            majorThreshold: 7,
            severeThreshold: 12,
            hp: 0,
            stress: 0,
            attack: 1,
            damage: [13, 16],
        },
        4: {
            difficulty: 2,
            majorThreshold: 8,
            severeThreshold: 10,
            hp: 1,
            stress: 1,
            attack: 1,
            damage: [18, 25],
        },
    }
};