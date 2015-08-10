// Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester1', {'role':'harvester'} );

module.exports = function (creep) {

    if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        creep.moveTo(sources[0]);
        creep.harvest(sources[0]);
    }
    else {
        creep.moveTo(Game.spawns.Spawn1);
        creep.transferEnergy(Game.spawns.Spawn1)
    }
};