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
        // @TODO : Add priority
        // @TODO : Change from num as object to int num as default plus override as obj
        var requiredCreeps = {
            miner: {
                num: {E6N8: 3, E6N7: 1, E7N7: 1},
                spawnForSources: true,
                controllerLevelMoreThan: 2
            },
            hauler: {
                num: {E6N8: 11, E6N7: 0, E7N7: 2},
                controllerLevelMoreThan: 2
            },
            extensionFiller: {
                num: {E6N8: 2, E6N7: 1},
                controllerLevelMoreThan: 3
            },
            harvester: {
                num: 4,
                controllerLevelLessThan: 3
            },
            builder: {
                num: {E6N8: 3, E6N7: 2, E7N7: 1}
            },
            roadMaintainer: {
                num: 1,
                controllerLevelMoreThan: 2
            },
            controllerUpgrader: {
                num: 1
            },
            controllerHauler: {
                num: 2,
                controllerLevelLessThan: 5
            },
            rampartDefender: {
                num: 4,
                hostilesPresent: true
            },
            builderSupplier: {
                num: 1,
                controllerLevelMoreThan: 3
            },
            interStorageHauler: {
                num: {E6N8: 3, E6N7: 0},
                controllerLevelMoreThan: 3
            }


        };

        for (var i in Game.spawns) {
            var spawn = Game.spawns[i];
            var creepsByRole = this.countCreepsByRole(spawn);
            var memory = {};

            for (var roleName in requiredCreeps) {
                var creepsForRole = (creepsByRole[roleName] == undefined) ? 0 : creepsByRole[roleName];
                // If the number of active creeps + queued creeps is less than required, add one
                var num = requiredCreeps[roleName].num;
                if (typeof num == 'object') num = num[spawn.room.name];

                // If hostileOnly flag is set, don't spawn these unless there are hostile creeps
                if (requiredCreeps[roleName].hostilesPresent == true) {
                    var hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);
                    if (hostiles.length == 0) continue;
                }

                // If controllerLevelLessThan flag is set, don't spawn these unless controller level is less than the specified level
                if (requiredCreeps[roleName].controllerLevelLessThan != undefined) {
                    var controller = spawn.room.find(FIND_STRUCTURES, {
                        filter: {structureType: STRUCTURE_CONTROLLER}
                    })[0];
                    if (controller.level >= requiredCreeps[roleName].controllerLevelLessThan) continue;
                }

                // If controllerLevelMoreThan flag is set, don't spawn these unless controller level is more than the specified level
                if (requiredCreeps[roleName].controllerLevelMoreThan != undefined) {
                    var controller = spawn.room.find(FIND_STRUCTURES, {
                        filter: {structureType: STRUCTURE_CONTROLLER}
                    })[0];
                    if (controller.level <= requiredCreeps[roleName].controllerLevelMoreThan) continue;
                }

                if (requiredCreeps[roleName].spawnForSources == true) {
                    var numSources = spawn.room.find(FIND_SOURCES).length;
                    var numFlags = spawn.room.find(FIND_FLAGS, {filter: {color:COLOR_YELLOW}}).length;
                    num = numSources+numFlags;
                    memory.spawnForSources = true;
                }


                var queuedCreeps = spawn.getNumQueuedCreepsForRole(roleName);

                if ((creepsForRole + queuedCreeps) < num) {
                    console.log(spawn.name + " QUEUE level " + spawn.getPartsLevel() + " " + roleName + " because " + (creepsByRole[roleName] + queuedCreeps) + " < " + num);
                    spawn.addToQueue(roleName, memory);
                }

            }

            // As a backup, spawn a harvester to keep things moving. This can be useful when a bug causes all creeps to age out and there isn't enough energy to get started again
            // Only spawn if there is no miner, there is a miner queued, the spawn cannot spawn the queued miner and the number of harvesters is < 2
            var harvesters = (creepsByRole.harvester == undefined) ? 0 : creepsByRole.harvester;
            if (creepsByRole.miner == undefined && spawn.getNumQueuedCreepsForRole('miner') >= 1 && !spawn.canCreateCreep(spawn.getPartsForQueuedCreep('miner')) && harvesters + spawn.getNumQueuedCreepsForRole('harvester') < 2) {
                console.log("Spawning backup harvester");
                spawn.addToQueue('harvester', {}, [WORK, CARRY, MOVE], true);
            }


            spawn.spawnNext();
        }

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
