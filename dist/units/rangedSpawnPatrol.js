var maxApproachRange = 10;
var optimalRange = 3;
var retreatThreshold = .25;

var oppositeDirections = [
    undefined,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT,
    TOP_LEFT,
    TOP,
    TOP_RIGHT,
    RIGHT,
    BOTTOM_RIGHT
];

module.exports = {

    bodyParts: [
        [RANGED_ATTACK, TOUGH, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, TOUGH, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, TOUGH, MOVE, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, TOUGH, MOVE, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, TOUGH, MOVE, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, TOUGH, MOVE, MOVE, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE]
    ],

    run: function (creep) {

        var hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, maxApproachRange);

        // If no hostile creeps or hp less than threshold, retreat
        if (hostileCreeps.length > 0 || (creep.hits / creep.hitsMax) < retreatThreshold) {
            var hostileCreep = hostileCreeps[0];
            var hostileRange = creep.pos.getRangeTo(hostileCreep);

            // Try to stay at range
            if (hostileRange > optimalRange) {
                console.log("Moving to. Ranged distance to creep: " + hostileRange);
                creep.moveTo(hostileCreep);
            } else if (hostileRange < optimalRange) {
                console.log("Moving away. Ranged distance to creep: " + hostileRange);

                creep.keepAwayFromEnemies(optimalRange);
            }

            // Always attack
            creep.rangedAttack(hostileCreep);
        }
        else {
            var rallyPoint = (creep.room.find(FIND_FLAGS).length > 0) ? creep.pos.findClosest(FIND_FLAGS) : creep.getSpawn();
            creep.moveTo(rallyPoint);
        }
    }
}