var global = require('global');

module.exports = function () {

    // Like moveTo, but will move a builder out of the way
    Creep.prototype.moveMeTo = function(object, opts) {
        var ret = this.moveTo(object, opts);
        //if (this.name == 'hauler8') console.log (this.name + " move to "+object + " - "+ret);

        if (ret == ERR_NO_PATH) {
            var builders = this.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: function (c) { return ( c.memory.role=='builder' || c.memory.role=='rampartDefender' || c.memory.role=='hauler'); }
            });
            if (builders.length > 0) {
                var builder = Math.floor(Math.random()*builders.length)
                //console.log(this.name + " moving builder " + builders[0]);
                var builderPos = builders[builder].pos;
                builders[builder].moveTo(this.pos.x, this.pos.y);
                return this.moveTo(builderPos.x, builderPos.y);
            }
        }
        return ret;
    };

    Creep.prototype.setTargetRoom = function(room) {
        this.memory.targetRoom = room;
    };

    Creep.prototype.keepAwayFromEnemies = function(minRange)
    {
        var target = this.pos.findClosest(Game.HOSTILE_CREEPS);
        if(target !== null && target.pos.inRangeTo(this.pos, minRange))
            this.moveTo(this.pos.x + this.pos.x - this.pos.x, this.pos.y + this.pos.y - this.pos.y );
    };

    Creep.prototype.hasCarryCapacity = function() {
        return this.carryCapacity > this.carry.energy;
    };

    Creep.prototype.getNearestSpawn = function() {
      return this.pos.findClosest(FIND_MY_SPAWNS);
    };

    Creep.prototype.getSpawn = function() {
        return Game.getObjectById(this.memory.spawnedAt.id);
    };

    Creep.prototype.getNearestController = function() {
        return this.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTROLLER }
        })[0];
    };

    Creep.prototype.getNearestStorage = function() {
        return this.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
        })[0];
    };


    Creep.prototype.assignMine = function (roomName) {
        global.initMineAssignments(roomName);

        // See if this creep is already assigned
        for (var i in Memory.assignedMines[roomName]){
            if (Memory.assignedMines[roomName][i] == this.memory.roleId) {
                console.log(this.name + " Already assigned to mine");
                this.memory.assignedMine = i;
                return true;
            }
        }

        var initialRoom = Game.rooms[roomName];
        var roomsToCheck = [roomName];
        // Look for mining flags in the room to find other rooms to check
        if (this.memory.assignedMine == undefined) {
            var flags = initialRoom.find(FIND_FLAGS, {filter: {color:COLOR_YELLOW}});
            for (var i in flags) {
                var adjacentRoomName = flags[i].name;
                roomsToCheck.push(adjacentRoomName);
            }
        }

        // @TODO - Big problem here.. Can't get room data unless we have a creep in the room...
        // Out of all rooms to check, find an open source
        var assignedInRoom = undefined;
        for (var roomIndex in roomsToCheck) {
            var checkRoom = Game.rooms[roomsToCheck[roomIndex]];
            //console.log(checkRoom + " - " + roomsToCheck[roomIndex] + " -  " + roomIndex);
            if (checkRoom == undefined) {
                console.log("Could not look up room data from "+roomsToCheck[roomIndex] + ", unable to assign miner "+this.name);
                return false;
            }

            var sources = checkRoom.find(FIND_SOURCES);
            for (var i in sources) {
                if (Memory.assignedMines[roomName][sources[i].id] == undefined) {
                    Memory.assignedMines[roomName][sources[i].id] = this.memory.roleId;
                    this.memory.assignedMine = sources[i].id;
                    console.log("Assigned " + this.name + " to mine " +this.memory.assignedMine + " in room " + checkRoom.name);
                    return true;
                }

            }
        }
        console.log("Unable to assign " + this.name +", not enough mines");
        return false;
    };

    Creep.prototype.unassignMine = function () {
        global.initMineAssignments(this.memory.homeRoom);
        console.log("Unassigned " + this.name +" from mine " + this.memory.assignedMine);
        Memory.assignedMines[this.memory.homeRoom][this.memory.assignedMine] = undefined;
        this.memory.assignedMine = undefined;

    };

    Creep.prototype.getAssignedMine = function () {
        return Game.getObjectById(this.memory.assignedMine);
    };

    /**
     *
     * @param structureClass string
     * @param structure string|object
     */
    Creep.prototype.assignStructure = function (structureClass, structure) {
        var structureId = (typeof structure == 'object') ? structure.id : structure;
        global.initStructureAssignments(structureClass);
        this.unassignCreep(structureClass);
        Memory.assignedStructures[structureClass][structureId] = this.memory.roleId;
        //console.log("assigned "+this.memory.roleId + " to " +structure.id);
        return structureId;
    };

    Creep.prototype.getStructureAssignedToCreep = function (structureClass) {
        global.initStructureAssignments(structureClass);
        for (var i in Memory.assignedStructures[structureClass]) {
            if (Memory.assignedStructures[structureClass][i] == this.memory.roleId) return Game.getObjectById(i);
        }
        return undefined;
    };

    Creep.prototype.unassignCreep = function (structureClass) {
        global.initStructureAssignments(structureClass);
        for (var i in Memory.assignedStructures[structureClass]) {
            if (Memory.assignedStructures[structureClass][i] == this.memory.roleId) Memory.assignedStructures[structureClass][i] = undefined;
        }
        return undefined;
    };



};