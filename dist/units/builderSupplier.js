// Haul from storage to a builder

module.exports = {

    bodyParts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    ],

    run: function (creep) {

        if (creep.carry.energy == 0) {
            var storage = creep.getNearestStorage();
            if (storage != undefined) {
                creep.moveMeTo(storage);
                storage.transferEnergy(creep);
            }
        } else {
            // Look for builders less than half full
            var builder = creep.pos.findClosest(FIND_MY_CREEPS, {
                filter: function (c) {
                    return c.memory.role == 'builder' && (c.carry.energy < c.carryCapacity );
                }
            });

            if (builder != undefined) {
                creep.moveMeTo(builder);
                creep.transferEnergy(builder);
            }

        }
    }
};

