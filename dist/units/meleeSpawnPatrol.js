// Game.spawns.Spawn1.createCreep( [ATTACK, TOUGH, MOVE], 'MeleeSpawnPatrol1', {'role':'meleeSpawnPatrol', 'tags':['combat']} );

module.exports = function (creep) {
    var hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
    if(hostileCreeps.length > 0) {
        creep.moveTo(hostileCreeps[0]);
        creep.attack(hostileCreeps[0]);
    }
    else {
        creep.moveTo(Game.spawns.Spawn1);
    }
};