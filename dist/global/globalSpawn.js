module.exports = function () {

    Spawn.prototype.needsRepair = function () {
        return (this.hits / this.hitsMax) < .095;
    };


    Spawn.prototype.initQueue = function() {
        if (this.memory.creepQueue == undefined) this.memory.creepQueue = [];

    };

    Spawn.prototype.addToQueue = function(parts, role, memory, startOfQueue) {
        this.initQueue();

        if (startOfQueue == true)
            this.memory.creepQueue.unshift([parts, role, memory]);
        else
            this.memory.creepQueue.push([parts, role, memory]);
    };

    Spawn.prototype.getNumQueuedCreepsForRole = function(role) {
        this.initQueue();
        var numQueued = this.memory.creepQueue.filter(function(d) { return d[1] == role;}).length;
        return (numQueued == undefined) ? 0 : numQueued;
    };

    Spawn.prototype.spawnNext = function() {
        this.initQueue();
        if (!this.memory.creepQueue.length) return;

        var creepData = this.memory.creepQueue[0];

        if (this.canCreateCreep(creepData[0]) != OK) return;

        var creepMemory = (creepData[2] != undefined) ? creepData[2] : {};
        creepMemory['role'] = creepData[1];

        var nameCount = 0;
        var name = null;
        while (name == null)
        {
            nameCount++;
            var tryName = creepMemory['role'] + nameCount;
            if (Game.creeps[tryName] == undefined)
                name = tryName;
        }

        creepMemory['roleId'] = nameCount; // use this for jitter
        creepMemory['spawnedAt'] = this;
        console.log("Spawning role "+ creepMemory['role'] + ", "+name);
        var newCreep = this.createCreep(creepData[0], name, creepMemory);
        this.memory.creepQueue.shift();
        return newCreep;
    };

};