A unpublished Foundry VTT module that can be used to create copies of adversaries in different tiers. It updates core stats, attack and damage, and damage in features. Most of the math is based on RightKnighttoFight's guide here https://docs.google.com/document/d/12g-obIkdGJ_iLL19bS0oKPDDvPbPI9pWUiFqGw8ED88/edit?tab=t.0.

### TODO

* Add support for changing `@Damage` inline.
* Consider replacing inline damage text replacement with a more general one, though we may accidentally catch non-stress damage
* Consider fine tuning damage averages. Damage adjustments use standard deviations, so weighing can be altered by adding more samples
