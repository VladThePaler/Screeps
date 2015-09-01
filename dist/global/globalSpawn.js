module.exports = function () {

    Spawn.prototype.needsRepair = function () {
        return (this.hits / this.hitsMax) < .095;
    };


    Spawn.prototype.initQueue = function() {
        if (this.memory.creepQueue == undefined) this.memory.creepQueue = [];

    };

    Spawn.prototype.getNumExtensions = function() {
        return this.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION} }).length;
    };

    /**
     * Return a number from 0-6, according to how developed the room is
     * @returns {Number}
     */
    Spawn.prototype.getPartsLevel = function() {
        var extensionsToLevel = [0,5,11,15,30,40,50];
        var numExtensions = this.getNumExtensions();
        for (var i = extensionsToLevel.length-1; i >=0; i--) {
            if (numExtensions >= extensionsToLevel[i]) return i;
        }
        return 0;
    };

    Spawn.prototype.addToQueue = function(roleName, memory, overrideParts, startOfQueue) {
        this.initQueue();

        var parts = overrideParts;
        if (parts == undefined || parts.length == 0) {
            var creepManager = require('creepManager');
            var role = creepManager.getRole(roleName);
            parts = role.bodyParts[this.getPartsLevel()];
        }
        if (memory == undefined) memory = {};

        if (startOfQueue == true)
            this.memory.creepQueue.unshift({parts:parts, role:roleName, memory:memory});
        else
            this.memory.creepQueue.push({parts:parts, role:roleName, memory:memory});
    };

    Spawn.prototype.getNumQueuedCreepsForRole = function(role) {
        this.initQueue();
        var numQueued = this.memory.creepQueue.filter(function(d) { return d.role == role;}).length;
        return (numQueued == undefined) ? 0 : numQueued;
    };

    Spawn.prototype.getPartsForQueuedCreep = function(role) {
        this.initQueue();
        var queuedForRole = this.memory.creepQueue.filter(function(d) { return d.role == role;});
        return (queuedForRole == undefined) ? undefined : queuedForRole.parts;
    };

    Spawn.prototype.spawnNext = function() {
        this.initQueue();
        if (!this.memory.creepQueue.length) return;

        var creepData = this.memory.creepQueue[0];

        if (this.canCreateCreep(creepData.parts) != OK) return;

        var creepMemory = (creepData.memory != undefined) ? creepData.memory : {};
        creepMemory.role = creepData.role;

        var nameCount = 0;
        var name = null;
        while (name == null)
        {
            nameCount++;
            var tryName = creepMemory.role + nameCount;
            if (Game.creeps[tryName] == undefined)
                name = tryName;
        }

        creepMemory.roleId = nameCount; // use this for jitter
        creepMemory.spawnedAt = this;
        creepMemory.homeRoom = this.room.name;
        creepMemory.lastRoomName = this.room.name;

        console.log(this.name + " Spawning role "+ creepMemory.role + ", "+name);
        var newCreep = this.createCreep(creepData.parts, name, creepMemory);
        this.memory.creepQueue.shift();

        return newCreep;
    };

};