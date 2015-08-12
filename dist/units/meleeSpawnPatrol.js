// Game.spawns.Spawn1.createCreep( [ATTACK, TOUGH, MOVE], 'MeleeSpawnPatrol1', {'role':'meleeSpawnPatrol', 'tags':['combat']} );

var maxApproachRange = 7;

module.exports = function (creep) {
    // @TODO : Genericize this behaviour?
    var rallyPoint = (creep.room.find(FIND_FLAGS).length > 0) ? creep.pos.findClosest(FIND_FLAGS) : Game.spawns.Spawn1;

    var hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, maxApproachRange);
    if(hostileCreeps.length > 0) {
        creep.moveTo(hostileCreeps[0]);
        creep.attack(hostileCreeps[0]);
    }
    else {
        creep.moveTo(rallyPoint);
    }
};