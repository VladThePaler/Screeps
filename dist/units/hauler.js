// Haul from a mine back to base

module.exports = function (creep) {

    if (creep.memory.state == undefined) creep.memory.state = 'headingToMine';

    var energyInRange = creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);
    if(creep.memory.state == 'headingToMine') {
        var source = getSource(creep);
        // If there's nearby energy, gather it
        if (creep.hasCarryCapacity() && energyInRange.length > 0 && creep.pos.getRangeTo(Game.spawns.Spawn1) > 3) creep.memory.state = 'gathering';
        else creep.moveTo(source);
    }

    if (creep.memory.state == 'gathering') {
        creep.moveTo(energyInRange[0]);
        var pickup = creep.pickup(energyInRange[0]);
        if (pickup != OK) creep.memory.state = 'headingToMine';
        if (!creep.hasCarryCapacity()) creep.memory.state = 'returning';
    }


    if (creep.memory.state == 'returning') {

        // If there are nearby workers on the path, give energy away
        var closestWorkers = creep.pos.findInRange(FIND_MY_CREEPS, 2, {
            filter: function (c) {
                return (c.carry.energy < c.carryCapacity) && (c.memory.role=='builder' || c.memory.role=='roadMaintainer');
            }
        });
        for (var i in closestWorkers) {
            creep.transferEnergy(closestWorkers[i], (closestWorkers[i].carryCapacity-closestWorkers[i].carry.energy));
            //console.log(creep.name + " donated to " + closestWorkers[i].name);
        }

        if (creep.pos.findInRange())
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
            creep.moveTo(Game.spawns.Spawn1);

            // If there is no more space, drop the energy
            if (creep.pos.getRangeTo(Game.spawns.Spawn1) == 1 && creep.transferEnergy(Game.spawns.Spawn1) == ERR_FULL) {
                creep.dropEnergy();
            }
        }

        if (creep.carry.energy <= 0) creep.memory.state = 'headingToMine';
    }

};

function getSource(creep)
{
    var sources = creep.room.find(FIND_SOURCES);

    return sources[(creep.memory.roleId % sources.length)];
}