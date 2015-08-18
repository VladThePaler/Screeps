
module.exports = {

    run: function (creep) {

        if (creep.memory.assignedRampartId == undefined) {
            // find unassigned rampart
            var defenders = creep.room.find(FIND_MY_CREEPS, {
                filter: function (c) {
                    return c.memory.role == 'rampartDefender' && c.memory.assignedRampart != undefined;
                }
            });
            var assignedRampartIds = [];
            for (var i in defenders) {
                assignedRampartIds.push(defenders[i].memory.assignedRampart);
            }

            var unassignedRamparts = creep.room.find(FIND_STRUCTURES, {
                filter: function (r) {
                    return r.structureType == STRUCTURE_RAMPART && assignedRampartIds[r.id] == undefined;
                }
            });

            creep.memory.assignedRampartId = unassignedRamparts[creep.memory.roleId % unassignedRamparts.length].id;
            console.log(creep.name + " assigned to " + creep.memory.assignedRampartId);
        }

        // @TODO : Add support for force-rally flag
        creep.moveTo(Game.getObjectById(creep.memory.assignedRampartId));

        var hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

        if (hostileCreeps.length > 1) creep.rangedMassAttack();
        else if (hostileCreeps.length == 1) creep.rangedAttack(hostileCreeps[0]);

    }
}