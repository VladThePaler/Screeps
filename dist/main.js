// Main

var creepManager = require('creepManager');
require('globals')(); // @TODO : Any way to not redefine this for every tick?

ensureCreeps();

for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    creepManager(creep);
}

function ensureCreeps()
{
    if (!Game.creeps['Harvester1'])
        Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Harvester1', {role:'harvester', tags:['worker']} );

    else if (!Game.creeps['MeleeSpawnPatrol1'])
        Game.spawns.Spawn1.createCreep( [ATTACK, TOUGH, MOVE], 'MeleeSpawnPatrol1', {role:'meleeSpawnPatrol', tags:['combat']} );

    else if (!Game.creeps['Builder1'])
        Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Builder1', {role:'builder', tags:['worker']} );

    else if (!Game.creeps['Healer1'])
        Game.spawns.Spawn1.createCreep( [HEAL, MOVE], 'Healer1', {role:'healer'} );

    else if (!Game.creeps['RangedSpawnPatrol1'])
        Game.spawns.Spawn1.createCreep( [RANGED_ATTACK, TOUGH, MOVE, MOVE], 'RangedSpawnPatrol1', {role:'rangedSpawnPatrol', tags:['combat']} );


    //else if (Game.spawns.Spawn1.energy >= Game.spawns.Spawn1.energyCapacity) {
    //    console.log("Maxed resources, spawning more melee defenders");
    //    Game.spawns.Spawn1.createCreep( [ATTACK, ATTACK, TOUGH, TOUGH, MOVE], 'MeleeSpawnPatrol'+Game.creeps.length+1, {role: 'meleeSpawnPatrol', tags:['combat']} );
    //}
}

function clearSim()
{
    for (var i in Game.creeps) {
        Game.creeps[i].say("Bye.. =(");
        Game.creeps[i].suicide();
    }

}