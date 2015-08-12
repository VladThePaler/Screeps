// Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester1', {'role':'harvester', 'tags':['worker']} );

module.exports = function (creep) {

    if(creep.carry.energy < creep.carryCapacity) {
        // If there is dropped energy and empty space, grab it
        var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 5);
        if (droppedEnergy.length && Game.spawns.Spawn1.energy < Game.spawns.Spawn1.energyCapacity) {
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
        // Look for extensions that need filling
        var nonEmptyExtensions = creep.room.find(FIND_MY_STRUCTURES, {
            filter: function(i) {
                return i.structureType == STRUCTURE_EXTENSION && (i.energy < i.energyCapacity);
            }
        });

        if (nonEmptyExtensions.length > 0) {
            creep.moveTo(nonEmptyExtensions[0]);
            creep.transferEnergy(nonEmptyExtensions[0]);
        } else {
            creep.moveTo(Game.spawns.Spawn1);

            // If there is no more space, drop the energy
            if (creep.pos.getRangeTo(Game.spawns.Spawn1) == 1 && creep.transferEnergy(Game.spawns.Spawn1) == ERR_FULL) {
                console.log("No more space, drop the energy");
                creep.dropEnergy();
            }
        }
    }
};