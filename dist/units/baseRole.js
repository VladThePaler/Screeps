

module.exports = {

    runAll: function(creep) {

        if(creep.memory.onSpawnEnd == undefined && !creep.spawning) {
            this.onSpawn(creep);
            creep.memory.onSpawnEnd = true;
        }

        this.run(creep);
        this.moveToTargetRoomIfSet(creep);
        if (creep.ticksToLive == 1) this.onAgeOut(creep);
    },


    handleRoomTransition: function(creep) {
        //if (creep.memory.transitionRemaining > 0) {
        //    var pos = new RoomPosition(25, 25, creep.room.name);
        //    var ret = creep.moveTo(pos);
        //
        //    console.log(creep.name + " transitions remaining: " + creep.memory.transitionRemaining + " - "+ret);
        //    creep.memory.transitionRemaining--;
        //    return true;
        //}

        if (creep.memory.lastRoomName != creep.room.name) {
            //creep.memory.transitionRemaining = 2;
            var pos = new RoomPosition(25, 25, creep.room.name);
            var ret = creep.moveTo(pos);

            //console.log(creep.name + " transitioning from room " + creep.memory.lastRoomName + " to "+creep.room.name + " - "+ret);
            creep.memory.lastRoomName = creep.room.name;
            return true;
        }
        creep.memory.lastRoomName = creep.room.name;
        return false;
    },

    moveToTargetRoomIfSet: function(creep) {
        if (creep.memory.targetRoom != undefined && creep.memory.targetRoom != creep.room.name && !creep.spawning) {
            var exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            var exit = creep.room.find(exitDir);
            if (exit.length > 0) {
                creep.moveMeTo(exit[0]);
                console.log(creep.name + " moving to exit" + exit[0]);
            }
        }
    },

    getBodyParts: function(controllerLevel) {

    },

    onSpawn: function(creep) {

    },

    onAgeOut: function(creep) {

    }
};

