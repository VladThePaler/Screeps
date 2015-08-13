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
            harvester: {
                parts: [WORK, CARRY, MOVE],
                num: 5
            },
            builder: {
                parts: [WORK, CARRY, MOVE],
                num: 7
            }
        };

        var creepsByRole = this.countCreepsByRole();

        for (var r in requiredCreeps) {
            // If the number of active creeps + queued creeps is less than required, add one
            if ( (creepsByRole[r] + spawn.getNumQueuedCreepsForRole(r)) < requiredCreeps[r].num ) {
                spawn.addToQueue(requiredCreeps[r].parts, r, {});
                console.log("QUEUE " + r + " because " + (creepsByRole[r] + spawn.getNumQueuedCreepsForRole(r)) + " < " + requiredCreeps[r].num);
            }

        }

        spawn.spawnNext();

        /*
        if (!Game.creeps['Harvester1'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester1', {role:'harvester', tags:['worker']} );

        else if (!Game.creeps['Builder1'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Builder1', {role:'builder', tags:['worker']} );

        if (!Game.creeps['Harvester2'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester2', {role:'harvester', tags:['worker']} );

        else if (!Game.creeps['Builder2'])
            Game.spawns.Spawn1.createCreep( [WORK, WORK, CARRY, CARRY, MOVE], 'Builder2', {role:'builder', tags:['worker']} );

        if (!Game.creeps['Harvester3'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester3', {role:'harvester', tags:['worker']} );

        else if (!Game.creeps['Builder3'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Builder3', {role:'builder', tags:['worker']} );

        else if (!Game.creeps['BuilderC'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'BuilderC', {role:'builder', tags:['worker'], shouldUpgradeController:true} );

        if (!Game.creeps['Harvester4'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester4', {role:'harvester', tags:['worker']} );

        else if (!Game.creeps['BuilderC2'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'BuilderC2', {role:'builder', tags:['worker'], shouldUpgradeController:true} );

        else if (!Game.creeps['BuilderC3'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'BuilderC3', {role:'builder', tags:['worker'], shouldUpgradeController:true} );

        else if (!Game.creeps['BuilderC4'])
            Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'BuilderC4', {role:'builder', tags:['worker'], shouldUpgradeController:true} );

        //else if (!Game.creeps['MeleeSpawnPatrol1'])
        //Game.spawns.Spawn1.createCreep( [ATTACK, TOUGH, MOVE], 'MeleeSpawnPatrol1', {role:'meleeSpawnPatrol', tags:['combat']} );

        //else if (!Game.creeps['Healer1'])
        //Game.spawns.Spawn1.createCreep( [HEAL, MOVE], 'Healer1', {role:'healer'} );

        //else if (!Game.creeps['RangedSpawnPatrol1'])
        //    Game.spawns.Spawn1.createCreep( [RANGED_ATTACK, TOUGH, MOVE, MOVE], 'RangedSpawnPatrol1', {role:'rangedSpawnPatrol', tags:['combat']} );


        //else if (Game.spawns.Spawn1.energy >= Game.spawns.Spawn1.energyCapacity) {
        //    console.log("Maxed resources, spawning more melee defenders");
        //    Game.spawns.Spawn1.createCreep( [ATTACK, ATTACK, TOUGH, TOUGH, MOVE], 'MeleeSpawnPatrol'+Game.creeps.length+1, {role: 'meleeSpawnPatrol', tags:['combat']} );
        //}

        */
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
