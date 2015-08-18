module.exports = {
    initStructureAssignments: function (structureClass) {
        if (Memory.assignedStructures == undefined) Memory.assignedStructures = {};
        if (Memory.assignedStructures[structureClass] == undefined) Memory.assignedStructures[structureClass] = {};
    }
};