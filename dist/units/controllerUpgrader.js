var rooms = ['E6N8', 'E6N7', 'E6N7', 'E6N7'];

module.exports = {

    bodyParts: [
        [WORK, CARRY, MOVE],
        [WORK, WORK, CARRY, MOVE],
        [WORK, WORK, WORK, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
    ],

    run: function (creep) {
        // If there's energy underfoot, grab it
        var energyUnderfoot = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (creep.carry.energy < creep.carryCapacity && energyUnderfoot.length > 0) {
            creep.pickup(energyUnderfoot[0]);
        }

        if (creep.room.name != rooms[creep.memory.roleId-1])
        {
            var exitDir = creep.room.findExitTo(rooms[creep.memory.roleId-1]);
            var exit = creep.pos.findClosest(exitDir);
            creep.moveTo(exit);
        } else {


            var controller = creep.getNearestController();

            creep.moveMeTo(controller);
            if (!controller.my)
                creep.claimController(controller);
            creep.upgradeController(controller);
        }
    }
};

