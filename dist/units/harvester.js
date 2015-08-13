// Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester1', {'role':'harvester', 'tags':['worker']} );

module.exports = function (creep) {

    if(creep.carry.energy < creep.carryCapacity) {
        var source = getSource(creep);
        //console.log(creep.name + " harvesting " + source);
        creep.moveTo(source);
        creep.harvest(source);
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

function getSource(creep)
{
    var sources = creep.room.find(FIND_SOURCES);

    return sources[(creep.memory.roleId % sources.length)];
}