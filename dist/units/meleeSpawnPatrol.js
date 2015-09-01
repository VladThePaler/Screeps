
var maxApproachRange = 7;

module.exports = {

    bodyParts: [
        [ATTACK, TOUGH, MOVE],
        [ATTACK, TOUGH, TOUGH, MOVE],
        [ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, MOVE],
        [ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, MOVE],
        [ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, MOVE],
        [ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, MOVE],
        [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE]
    ],

    run: function (creep) {

        var hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, maxApproachRange);
        if (hostileCreeps.length > 0) {
            creep.moveTo(hostileCreeps[0]);
            creep.attack(hostileCreeps[0]);
        }
        else {
            // @TODO : Genericize this behaviour?
            var rallyPoint = (creep.room.find(FIND_FLAGS).length > 0) ? creep.pos.findClosest(FIND_FLAGS) : creep.getSpawn();
            creep.moveTo(rallyPoint);
        }
    }
}