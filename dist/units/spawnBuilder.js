// Go to another room to build the spawn.
// Self-sufficient as it will mine what it needs and then build.

// Game.spawns.Spawn2.addToQueue('spawnBuilder', {targetRoom:'E7N7'}, [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]);

module.exports = {

    bodyParts: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, CARRY, MOVE],
        [WORK, WORK, CARRY, CARRY, MOVE],
        [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    ],

    run: function (creep) {

        // Prevent distractions when moving to a target room
        if (creep.memory.targetRoom != undefined && creep.memory.targetRoom != creep.room.name) {
            creep.memory.buildSite = undefined;
            return;
        }

        // If there's energy underfoot, grab it
        var energyUnderfoot = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (creep.carry.energy < creep.carryCapacity && energyUnderfoot.length > 0) {
            creep.pickup(energyUnderfoot[0]);
        }

        // If the creep is out of energy, go get more
        if (creep.carry.energy == 0) creep.memory.state = 'collecting';


        // If there are more miners than sources, find another room
        if (creep.memory.state == 'collecting') {
            var source = creep.pos.findClosest(FIND_SOURCES);
            creep.moveMeTo(source);
            creep.harvest(source);
            if (creep.carry.energy >= creep.carryCapacity) creep.memory.state = 'building';
        }

        if (creep.memory.state == 'building') {
            // Find the site that is the furthest built and focus on that
            var site = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
            if (site != undefined) {
                creep.moveMeTo(site);
                creep.build(site);

            }
        }

    }
};
