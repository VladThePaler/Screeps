// Mine a source, drop all energy on the ground for haulers to pick up
var homeRoom = 'E6N8';

var directions = [FIND_EXIT_LEFT, FIND_EXIT_BOTTOM, FIND_EXIT_RIGHT];

module.exports = function (creep) {

    var sources = creep.room.find(FIND_SOURCES);

    // If there are more miners than sources, find another room
    if (creep.memory.roleId > sources.length && creep.room.name == homeRoom) {
        // Pick a direction
        var direction = directions[(creep.memory.roleId-sources.length-1)];
        var exit = creep.pos.findClosest(direction);
        if (!creep.spawning && exit == undefined) console.log(creep.name + " can't find exit " + direction);
        else creep.moveMeTo(exit);
    } else {

        var source = sources[(creep.memory.roleId % sources.length)];
        creep.moveMeTo(source);
        creep.harvest(source);
        if (creep.carry.energy >= creep.carryCapacity)
            creep.dropEnergy(creep.carryCapacity);
    }
};
