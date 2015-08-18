var global = require('global');

module.exports = function () {

    Structure.prototype.needsRepair = function () {
        return (this.hits / this.hitsMax) < .075;
    };

    Structure.prototype.structureIsAssigned = function (structureClass) {
        global.initStructureAssignments(structureClass);
        return Memory.assignedStructures[structureClass][this.id] != undefined;
    };

    Structure.prototype.unassignStructure = function (structureClass) {
        global.initStructureAssignments(structureClass);
        return Memory.assignedStructures[structureClass][this.id] = undefined;
    };

    Structure.prototype.getCreepAssignedToStructure = function (structureClass) {
        global.initStructureAssignments(structureClass);
        return Memory.assignedStructures[structureClass][this.id];
    };
};