

module.exports = {

    runAll: function(creep) {
        this.run(creep);
        this.moveToTargetRoomIfSet(creep);
    },

    moveToTargetRoomIfSet: function(creep) {
        if (creep.memory.targetRoom != undefined && creep.memory.targetRoom != creep.room.name) {
            var exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            var exit = creep.pos.findClosest(exitDir);
            creep.moveTo(exit);
            console.log(creep.name + " moving to exit" +exit);
        }
    },

    getBodyParts: function(controllerLevel) {

    }

};

