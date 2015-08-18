module.exports = {

    handleActions: function (creep) {
        var role = creep.memory['role'];
        if (!role) {
            console.log("Creep role not defined for '" + creep.name + "' so it doesn't have a behaviour.");
        } else {

            try {
                var role = require(role);
                role.run(creep);
            } catch (err) {
                console.log("Could not require creep role '" + role + "': " + err.message + "("+err.filename+":"+err.lineNumber+")");
            }
        }
    },
// @TODO : Spawn queue, combat mode in ensureCreeps

    ensureCreeps: function() {
        var spawn = Game.spawns.Spawn1;

        // @TODO : lower energy roles for early game
        // @TODO : Add priority
        var requiredCreeps = {
            miner: {
                parts: [WORK, WORK, WORK, WORK, WORK, MOVE],
                num: 4,
                controllerLevelMoreThan: 2
            },
            hauler: {
                parts: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                num: 8,
                controllerLevelMoreThan: 2
            },
            extensionFiller: {
                parts: [CARRY, CARRY, MOVE, MOVE],
                num: 2,
                controllerLevelMoreThan: 3
            },
            harvester: {
                parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                num: 1,
                controllerLevelLessThan: 3
            },
            builder: {
                parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                num: 6
            },
            roadMaintainer: {
                parts: [WORK, CARRY, CARRY, MOVE],
                num: 1,
                controllerLevelMoreThan: 2
            },
            controllerUpgrader: {
                parts: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
                num: 1
            },
            controllerHauler: {
                parts: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                num: 2
            },
            rampartDefender: {
                parts: [RANGED_ATTACK, MOVE],
                num: 3,
                hostilesPresent: true
            }

        };

        var creepsByRole = this.countCreepsByRole();

        for (var r in requiredCreeps) {

            // If hostileOnly flag is set, don't spawn these unless there are hostile creeps
            if (requiredCreeps[r].hostilesPresent == true) {
                var hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);
                if (hostiles.length == 0) continue;
            }

            // If controllerLevelLessThan flag is set, don't spawn these unless controller level is less than the specified level
            if (requiredCreeps[r].controllerLevelLessThan != undefined) {
                var controller = spawn.room.find(FIND_STRUCTURES, {
                    filter: {structureType: STRUCTURE_CONTROLLER}
                })[0];
                if (controller.level >= requiredCreeps[r].controllerLevelLessThan) continue;
            }

            // If controllerLevelMoreThan flag is set, don't spawn these unless controller level is more than the specified level
            if (requiredCreeps[r].controllerLevelMoreThan != undefined) {
                var controller = spawn.room.find(FIND_STRUCTURES, {
                    filter: {structureType: STRUCTURE_CONTROLLER}
                })[0];
                if (controller.level <= requiredCreeps[r].controllerLevelMoreThan) continue;
            }

            var creepsForRole = (creepsByRole[r] == undefined) ? 0 : creepsByRole[r];
            //console.log(creepsForRole +" - " + spawn.getNumQueuedCreepsForRole(r) + " - " +  requiredCreeps[r].num);
            // If the number of active creeps + queued creeps is less than required, add one
            if ( (creepsForRole + spawn.getNumQueuedCreepsForRole(r)) < requiredCreeps[r].num ) {
                console.log("QUEUE " + r + " because " + (creepsByRole[r] + spawn.getNumQueuedCreepsForRole(r)) + " < " + requiredCreeps[r].num);
                spawn.addToQueue(requiredCreeps[r].parts, r, {});
            }

        }

        var harvesters = (creepsByRole['harvester'] == undefined) ? 0 : creepsByRole['harvester'];
        // As a backup, spawn a harvester to keep things moving
        if (creepsByRole['miner'] == undefined && (harvesters + spawn.getNumQueuedCreepsForRole('harvester')) < 2) {
            console.log("Spawning backup harvester");
            spawn.addToQueue([WORK, CARRY, MOVE], 'harvester', {}, true);
        }


        spawn.spawnNext();

    },

    countCreepsByRole: function()
    {
        var creepsByRole = {};
        for (var i in Game.creeps) {
            var role = Game.creeps[i].memory.role;
            if (creepsByRole[role] == undefined) creepsByRole[role] = 1;
            else creepsByRole[role]++;
        }
        return creepsByRole;
    },

    massSuicide: function()
    {
        for (var i in Game.creeps) {
            Game.creeps[i].say("Bye.. =(");
            Game.creeps[i].suicide();
        }
    }
};
