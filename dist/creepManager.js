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

    ensureCreeps: function() {
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
    },

    massSuicide: function()
    {
        for (var i in Game.creeps) {
            Game.creeps[i].say("Bye.. =(");
            Game.creeps[i].suicide();
        }
    }
};
