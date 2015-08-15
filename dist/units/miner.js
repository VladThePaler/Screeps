
module.exports = function (creep) {

    var source = getSource(creep);
    creep.moveTo(source);
    var harvestResult = creep.harvest(source);
    if (creep.carry.energy >= creep.carryCapacity)
        creep.dropEnergy(creep.carryCapacity);

    // If there is a hauler nearby, move away so it can pick up the energy
    var closestCreep = creep.pos.findInRange(FIND_MY_CREEPS, 2, {filter: function (c) { return c.memory.role=='hauler'}});
    if  (closestCreep.length > 0 && harvestResult == OK &&
        ( closestCreep[0].memory.state == 'gathering' || closestCreep[0].memory.state == 'headingToMine')
        ) {
        // Only move if we have gathered enough energy
        var closestEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 0);
        if (closestEnergy.energy > closestCreep.carryCapacity)
            creep.moveTo(Game.spawns.Spawn1);
    }
};

function getSource(creep)
{
    var sources = creep.room.find(FIND_SOURCES);

    return sources[(creep.memory.roleId % sources.length)];
}