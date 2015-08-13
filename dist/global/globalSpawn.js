module.exports = function () {

    Spawn.prototype.needsRepair = function () {
        return (this.hits / this.hitsMax) < .095;
    };

    // @TODO : Make my own createcreep function, assign some randomness to all creeps for jitter
    Spawn.prototype.createHarvesterCreep = function(name) {
        return this.createCreep( [WORK, CARRY, MOVE], name, {role:'harvester'} );
    };

    // @TODO : Figure out how to organize these. Delegate creation to unit modules?

};