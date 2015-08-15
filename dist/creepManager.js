module.exports = {

    handleActions: function (creep) {
        var role = creep.memory['role'];
        if (!role) {
            console.log("Creep role not defined for '" + creep.name + "' so it doesn't have a behaviour.");
        } else {

            try {
                var unit = require(role);
                unit(creep);
            } catch (err) {
                console.log("Could not require creep role '" + role + "': " + err.message);
            }
        }
    },
// @TODO : Spawn queue, combat mode in ensureCreeps

    ensureCreeps: function() {

        var spawn = Game.spawns.Spawn1;

        var requiredCreeps = {
            miner: {
                parts: [WORK, WORK, WORK, WORK, MOVE],
                num: 2
            },
            hauler: {
                parts: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                num: 4
            },
            harvester: {
                parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                num: 0
            },
            builder: {
                parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                num: 9
            },
            roadMaintainer: {
                parts: [WORK, CARRY, CARRY, MOVE],
                num: 1
            }

        };

        var creepsByRole = this.countCreepsByRole();

        for (var r in requiredCreeps) {
            var creepsForRole = (creepsByRole[r] == undefined) ? 0 : creepsByRole[r];
            //console.log(creepsForRole +" - " + spawn.getNumQueuedCreepsForRole(r) + " - " +  requiredCreeps[r].num);
            // If the number of active creeps + queued creeps is less than required, add one
            if ( (creepsForRole + spawn.getNumQueuedCreepsForRole(r)) < requiredCreeps[r].num ) {
                spawn.addToQueue(requiredCreeps[r].parts, r, {});
                console.log("QUEUE " + r + " because " + (creepsByRole[r] + spawn.getNumQueuedCreepsForRole(r)) + " < " + requiredCreeps[r].num);
            }

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
