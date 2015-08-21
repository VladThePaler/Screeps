
module.exports = {

    bodyParts: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, CARRY, MOVE],
        [WORK, WORK, CARRY, CARRY, MOVE],
        [WORK, WORK, CARRY, CARRY, CARRY, MOVE],
        [WORK, WORK, CARRY, CARRY, CARRY, MOVE],
        [WORK, WORK, CARRY, CARRY, CARRY, MOVE]
    ],

    run: function (creep) {

        if (creep.memory.state == undefined) creep.memory.state = 'mining';

        var energyUnderfoot = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (creep.carry.energy < creep.carryCapacity && energyUnderfoot.length > 0) {
            creep.pickup(energyUnderfoot[0]);
        }

        if (creep.memory.state == 'mining') {
            var source = getSource(creep);
            //console.log(creep.name + " harvesting " + source);
            creep.moveTo(source);
            creep.harvest(source);
            if (creep.carry.energy >= creep.carryCapacity) creep.memory.state = 'returning';
        }

        if (creep.memory.state == 'returning') {
            // Look for extensions that need filling
            var nonEmptyExtensions = creep.room.find(FIND_MY_STRUCTURES, {
                filter: function (i) {
                    return i.structureType == STRUCTURE_EXTENSION && (i.energy < i.energyCapacity);
                }
            });

            if (nonEmptyExtensions.length > 0) {
                creep.moveTo(nonEmptyExtensions[0]);
                creep.transferEnergy(nonEmptyExtensions[0]);
            } else {
                creep.moveTo(creep.getNearestSpawn());

                // If there is no more space, drop the energy
                if (creep.pos.getRangeTo(creep.getNearestSpawn()) == 1 && creep.transferEnergy(creep.getNearestSpawn()) == ERR_FULL) {
                    //console.log("No more space, drop the energy");
                    creep.dropEnergy();
                }
            }
            if (creep.carry.energy <= 0) creep.memory.state = 'mining';
        }

    }
};

function getSource(creep)
{
    var sources = creep.room.find(FIND_SOURCES);

    return sources[(creep.memory.roleId % sources.length)];
}