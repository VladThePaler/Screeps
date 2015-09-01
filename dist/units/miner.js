// Mine a source, drop all energy on the ground for haulers to pick up
// Alternatively, drop energy into a link

var directions = [FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];


module.exports = {

    bodyParts: [
      [WORK, CARRY, MOVE],
      [WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
      [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]
    ],

    // Assign to a source on spawn
    onSpawn: function (creep) {
        creep.assignMine(creep.room.name);
    },

    // Unassign at end of life
    onAgeOut: function(creep) {
        creep.unassignMine();
    },

    run: function (creep) {
        var source = creep.getAssignedMine();
        creep.moveMeTo(source);
        creep.harvest(source);

        var link = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: {structureType: STRUCTURE_LINK}});
        if (link.length > 0) {
            var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
            if (energy.length > 0) creep.pickup(energy[0]);

            if (creep.carry.energy >= (creep.carryCapacity/1.5)) {
                creep.transferEnergy(link[0]);
                return;
            }
        }

        if (creep.carry.energy >= creep.carryCapacity)
            creep.dropEnergy(creep.carryCapacity);

    },


};
