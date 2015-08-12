module.exports = function () {

    Structure.prototype.needsRepair = function () {
        return (this.hits / this.hitsMax) < .075;
    };

};