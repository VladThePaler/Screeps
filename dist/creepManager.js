module.exports = {

    handleActions: function (creep) {
        var roleName = creep.memory['role'];
        if (!roleName) {
            console.log("Creep role not defined for '" + creep.name + "' so it doesn't have a behaviour.");
        } else {

            var role = this.getRole(roleName);
            if (role != false) {
                role.runAll(creep);
            }
        }
    },
// @TODO : Spawn queue, combat mode in ensureCreeps


    getRole: function(roleName)
    {
        try {
            var role = require(roleName);
            var base = require('baseRole');

            role = require('extend')(role, base);

            return role;
        } catch (err) {
            console.log("Could not require creep role '" + roleName + "': " + err.message + "("+err.filename+":"+err.lineNumber+")");
            return false;
        }
    },

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
                parts: [CARRY, CARRY, CARRY, MOVE, MOVE],
                num: 2,
                controllerLevelMoreThan: 3
            },
            harvester: {
                parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                num: 1,
                controllerLevelLessThan: 3
            },
            builder: {
                parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                num: 8
            },
            roadMaintainer: {
                parts: [WORK, CARRY, CARRY, MOVE],
                num: 1,
                controllerLevelMoreThan: 2
            },
            controllerUpgrader: {
                parts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
                num: 1
            },
            controllerHauler: {
                parts: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                num: 2,
                controllerLevelLessThan: 5
            },
            rampartDefender: {
                parts: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],
                num: 3,
                hostilesPresent: true
            }

        };

        var creepsByRole = this.countCreepsByRole(spawn);

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

        // As a backup, spawn a harvester to keep things moving. This can be useful when a bug causes all creeps to age out and there isn't enough energy to get started again
        var harvesters = (creepsByRole['harvester'] == undefined) ? 0 : creepsByRole['harvester'];
        if (creepsByRole['miner'] == undefined && (harvesters + spawn.getNumQueuedCreepsForRole('harvester')) < 2) {
            console.log("Spawning backup harvester");
            spawn.addToQueue([WORK, CARRY, MOVE], 'harvester', {}, true);
        }


        spawn.spawnNext();

        spawn = Game.spawns.Spawn2;
        // Temporary until I can refactor the scaling roles
        var cbr = this.countCreepsByRole(spawn);
        var h = (cbr['hauler'] == undefined) ? 0 : cbr['hauler'];
        if ((h + spawn.getNumQueuedCreepsForRole('hauler')) < 2) {
            spawn.addToQueue([CARRY, CARRY, CARRY, MOVE], 'hauler', {}, true);
        }

        var upgraders = (cbr['controllerUpgrader'] == undefined) ? 0 : cbr['controllerUpgrader'];
        if ((upgraders + spawn.getNumQueuedCreepsForRole('controllerUpgrader')) < 1) {
            spawn.addToQueue([WORK, WORK, CARRY, MOVE], 'controllerUpgrader', {}, true);
        }

        var haulers = (cbr['controllerHauler'] == undefined) ? 0 : cbr['controllerHauler'];
        if ((haulers + spawn.getNumQueuedCreepsForRole('controllerHauler')) < 1) {
            spawn.addToQueue([CARRY, CARRY, MOVE], 'controllerHauler', {}, true);
        }

        var rms = (cbr['roadMaintainer'] == undefined) ? 0 : cbr['roadMaintainer'];
        if ((rms + spawn.getNumQueuedCreepsForRole('roadMaintainer')) < 1) {
            spawn.addToQueue([WORK, CARRY, MOVE], 'roadMaintainer', {}, true);
        }

        var b = (cbr['builder'] == undefined) ? 0 : cbr['builder'];
        if ((b + spawn.getNumQueuedCreepsForRole('builder')) < 1) {
            spawn.addToQueue([WORK, CARRY, MOVE], 'builder', {}, true);
        }

        spawn.spawnNext();
    },

    countCreepsByRole: function(spawn)
    {
        var creepsByRole = {};
        for (var i in Game.creeps) {
            if (Game.creeps[i].memory.spawnedAt.name != spawn.name) continue;

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
