var global = require('global');

module.exports = function () {

    // Like moveTo, but will move a builder out of the way
    Creep.prototype.moveMeTo = function(object) {

        var ret = this.moveTo(object);
        if (ret == ERR_NO_PATH) {
            var builders = this.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: function (c) { return ( c.memory.role=='builder' || c.memory.role=='rampartDefender'); }
            });
            if (builders.length > 0) {
                var builder = Math.floor(Math.random()*builders.length)
                //console.log(this.name + " moving builder " + builders[0]);
                var builderPos = builders[builder].pos;
                builders[builder].moveTo(this.pos.x, this.pos.y);
                this.moveTo(builderPos.x, builderPos.y);
            }
        }
    }

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


    Creep.prototype.assignStructure = function (structureClass, structure) {
        global.initStructureAssignments(structureClass);
        Memory.assignedStructures[structureClass][structure.id] = this.memory.roleId;
        //console.log("assigned "+this.memory.roleId + " to " +structure.id);
    };

    Creep.prototype.getStructureAssignedToCreep = function (structureClass) {
        global.initStructureAssignments(structureClass);
        for (var i in Memory.assignedStructures[structureClass]) {
            if (Memory.assignedStructures[structureClass][i] == this.memory.roleId) return Game.getObjectById(i);
        }
        return undefined;
    };




};