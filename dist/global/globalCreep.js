module.exports = function () {

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
};