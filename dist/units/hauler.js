// Haul from a mine back to base

module.exports = function (creep) {

    if (creep.memory.state == undefined) creep.memory.state = 'headingToMine';

    var energyInRange = creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);

    // head to the mine, keep an eye out for nearby energy
    if(creep.memory.state == 'headingToMine') {
        var source = getSource(creep);
        // If there's nearby energy, gather it
        if (creep.hasCarryCapacity() && energyInRange.length > 0 && creep.pos.getRangeTo(creep.getSpawn()) > 3) creep.memory.state = 'gathering';
        else if (creep.pos.getRangeTo(source) <= 2) creep.memory.state = 'gathering';
        else creep.moveTo(source);
    }

    // Stand next to the miner and pick up dropped energy
    if (creep.memory.state == 'gathering') {
        // Stand next to the energy, not on it, to not block a miner
        if (creep.pos.getRangeTo(energyInRange[0]) > 1)
            creep.moveTo(energyInRange[0]);
        var pickup = creep.pickup(energyInRange[0]);
        if (pickup != OK) creep.memory.state = 'headingToMine';
        if (!creep.hasCarryCapacity()) creep.memory.state = 'returning';
    }

    // Return from the mine when full, drop off at extensions, spawns, or drop on the ground
    if (creep.memory.state == 'returning') {

        // If there are nearby workers on the path, give energy away
        var closestWorkers = creep.pos.findInRange(FIND_MY_CREEPS, 2, {
            filter: function (c) {
                return (c.carry.energy < c.carryCapacity) && (c.memory.role=='builder' || c.memory.role=='roadMaintainer' || c.memory.role=='controllerHauler');
            }
        });
        for (var i in closestWorkers) {
            creep.transferEnergy(closestWorkers[i], (closestWorkers[i].carryCapacity-closestWorkers[i].carry.energy));
            //console.log(creep.name + " donated to " + closestWorkers[i].name);
        }

        var storage = creep.getNearestStorage();

        // If there is a storage unit, use that, and assume there will be other creeps to distribute to extensions (Post controller level 4)
        if (storage != undefined) {
            distributeToStorage(creep, storage);
        } else {
            // If there is not a storage unit, distribute to extensions first, then spawn (Pre controller level 4)
            distributeToExtensionsAndSpawn(creep);
        }


        if (creep.carry.energy <= 0) creep.memory.state = 'headingToMine';
    }

};


function distributeToStorage(creep, storage)
{
    creep.moveTo(storage);

    // If there is no more space, drop the energy
    if (creep.transferEnergy(storage) == ERR_FULL) {
        creep.dropEnergy();
    }
}

function distributeToExtensionsAndSpawn(creep)
{
    // Look for extensions that need filling
    var nonEmptyExtension = creep.pos.findClosest(FIND_MY_STRUCTURES, {
        filter: function(i) {
            return i.structureType == STRUCTURE_EXTENSION && (i.energy < i.energyCapacity);
        }
    });

    if (nonEmptyExtension != undefined) {
        creep.moveTo(nonEmptyExtension);
        creep.transferEnergy(nonEmptyExtension);
    } else {
        creep.moveTo(creep.getSpawn());

        // If there is no more space, drop the energy
        if (creep.pos.getRangeTo(creep.getSpawn()) == 1 && creep.transferEnergy(creep.getSpawn()) == ERR_FULL) {
            creep.dropEnergy();
        }
    }

}


function getSource(creep)
{
    var sources = creep.room.find(FIND_SOURCES);

    return sources[(creep.memory.roleId % sources.length)];
}