// Mine a source, drop all energy aon the ground for haulers to pick up

module.exports = function (creep) {

    var source = getSource(creep);
    creep.moveTo(source);
    creep.harvest(source);
    if (creep.carry.energy >= creep.carryCapacity)
        creep.dropEnergy(creep.carryCapacity);
};

function getSource(creep)
{
    var sources = creep.room.find(FIND_SOURCES);

    return sources[(creep.memory.roleId % sources.length)];
}