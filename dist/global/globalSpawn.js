module.exports = function () {

    Spawn.prototype.createHarvesterCreep = function(name) {
        return this.createCreep( [WORK, CARRY, MOVE], name, {role:'harvester'} );
    };

    // @TODO : Figure out how to organize these. Delegate creation to unit modules?

};