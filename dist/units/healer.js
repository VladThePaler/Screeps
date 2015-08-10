// Game.spawns.Spawn1.createCreep( [HEAL, MOVE], 'Healer1', {'role':'healer'} );

module.exports = function (creep) {
    var friendlyCreeps = creep.room.find(FIND_MY_CREEPS);

    // If we're too close to an enemy, run home
    if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)) {
        creep.moveTo(Game.spawns.Spawn1);
    } else {
        // Otherwise find a friendly wounded creep and move toward it
        for (var i in friendlyCreeps) {
            var friendlyCreep = friendlyCreeps[i];
            if (friendlyCreep.hits < friendlyCreep.hitsMax) {
                creep.moveTo(friendlyCreep);
            }
        }
    }

    // Always look for someone to heal
    var bestRangedTarget = undefined;
    var bestMeleeTarget = undefined;

    for (var i in friendlyCreeps) {
        var friendlyCreep = friendlyCreeps[i];
        var lifePercent = friendlyCreep.hits / friendlyCreep.hitsMax; // @TODO who needs it more?

        if (friendlyCreep.hits < friendlyCreep.hitsMax) {
            if (creep.pos.getRangeTo(friendlyCreep) > 1)
                bestRangedTarget = friendlyCreep;
            else
                bestMeleeTarget = friendlyCreep;
        }
    }

    // Prefer a melee heal over a ranged heal
    if (bestMeleeTarget) creep.heal(bestMeleeTarget);
    else creep.rangedHeal(bestRangedTarget);

    // If noone is hurt, just move to the nearest melee unit
    if (!bestMeleeTarget && !bestRangedTarget) {
        creep.moveTo(creep.pos.findClosest(FIND_MY_CREEPS, {'role':'meleeSpawnPatrol'}));
    }
};