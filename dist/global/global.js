module.exports = {
    initStructureAssignments: function (structureClass) {
        if (Memory.assignedStructures == undefined) Memory.assignedStructures = {};
        if (Memory.assignedStructures[structureClass] == undefined) Memory.assignedStructures[structureClass] = {};
    },

    initMineAssignments: function (room) {
        if (Memory.assignedMines == undefined) Memory.assignedMines = {};
        if (Memory.assignedMines[room] == undefined) Memory.assignedMines[room] = {};
    }
};