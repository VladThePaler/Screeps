// Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester1', {'role':'harvester', 'tags':['worker']} );

module.exports = function (creep) {

    if(creep.carry.energy < creep.carryCapacity) {
        // If there is dropped energy and empty space, grab it
        var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 5);
        var cap = Game.spawns.Spawn1.energyCapacity - Game.spawns.Spawn1.energy;
        if (droppedEnergy.length && cap > 0) {
            console.log("Grab the dropped energy");
            creep.moveTo(droppedEnergy[0]);
            creep.pickup(droppedEnergy[0]);
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            creep.moveTo(sources[0]);
            creep.harvest(sources[0]);
        }
    }
    else {
        creep.moveTo(Game.spawns.Spawn1);

        // If there is no more space, drop the energy
        if (creep.pos.getRangeTo(Game.spawns.Spawn1) == 1 && creep.transferEnergy(Game.spawns.Spawn1) == ERR_FULL) {
            console.log("No more space, drop the energy");
            creep.dropEnergy();
        }
    }
};