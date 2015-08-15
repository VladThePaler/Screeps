
module.exports = function (creep) {

    // If there's energy underfoot, grab it
    var energyUnderfoot = creep.pos.findInRange(FIND_DROPPED_ENERGY, 0);
    if (creep.carry.energy < creep.carryCapacity && energyUnderfoot.length > 0) {
        creep.pickup(energyUnderfoot[0]);
    }

    // If the creep is out of energy, go get more
    if(creep.carry.energy == 0) {
        creep.moveTo(Game.spawns.Spawn1);

        if (Game.spawns.Spawn1.energy > creep.carryCapacity) {
            Game.spawns.Spawn1.transferEnergy(creep, creep.carryCapacity);
        }
    } else {

        // Main actions. Try to repair, then build, then upgrade, then reinforce

        if ( ! (repairStructures(creep) ||
                buildStructures(creep) ||
                upgradeController(creep) ||
                reinforceWalls(creep) ) ) {
            console.log("Builder " +creep.name + " has nothing to do");
        }
    }
};


function repairStructures(creep)
{
    // If a structure needs repair, find the one in most need of repair - this takes precedence
    if (creep.memory.repairSite == undefined) {

        var structuresNeedRepair = creep.room.find(FIND_STRUCTURES, {
            filter: function(i) {
                return (i.hits / i.hitsMax) < 0.75 && i.structureType != STRUCTURE_ROAD && i.structureType != STRUCTURE_WALL && i.structureType != STRUCTURE_RAMPART;
            }
        }).sort(function (a, b) {
            return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
        });


        if (structuresNeedRepair.length > 0) {
            // Jitter the site based on roleId, within the first 4 results
            var repSiteChoice = (creep.memory.roleId % 4) % structuresNeedRepair.length;

            creep.memory.repairSite = structuresNeedRepair[repSiteChoice].id;
        }
    }

    if (creep.memory.repairSite != undefined) {
        var site = Game.getObjectById(creep.memory.repairSite);

        // Wipe the assigned site when complete
        if (site == null || site.hits >= site.hitsMax) {
            console.log("wiping repair site for creep " + creep.name + " because null site "+ site + " "+creep.memory.repairSite);
            creep.memory.repairSite = undefined;
            return repairStructures(creep); // Just finished. Recurse.
        }
        else {
            creep.moveTo(site);
            creep.repair(site);
            //console.log(creep.name + " repairing " + site + " ("+site.hits+"/"+site.hitsMax+")");
            return true;
        }
    }
    return false;
}


function buildStructures(creep)
{
    if (creep.memory.buildSite == undefined) {
        // Find the site that is the furthest built and focus on that
        var sites = creep.room.find(FIND_CONSTRUCTION_SITES).sort(function (a, b) {
            return a.progress - b.progress;
        });
        if (sites.length > 0) {

            // Jitter the site based on roleId, within the first 3 results
            var siteChoice = (creep.memory.roleId % 3) % sites.length;

            // If there has not been any progress, pick the closest target and assign to this creep
            creep.memory.buildSite = sites[siteChoice].id;
        }
    }
    if (creep.memory.buildSite != undefined) {
        var site = Game.getObjectById(creep.memory.buildSite);

        // Wipe the assigned site when complete
        if (site == null || site.progress >= site.progressTotal) {
            console.log("wiping build site for creep " + creep.name + " because null site "+ site + " "+creep.memory.buildSite);
            creep.memory.buildSite = undefined;
            return buildStructures(creep); // Just finished. Recurse.
        }
        else {
            creep.moveTo(site);
            creep.build(site);
            //console.log(creep.name + " building " + site + " ("+site.progress+"/"+site.progressTotal+")");
            return true;
        }
    }
    return false;
}

function upgradeController(creep)
{
    if (creep.memory.roleId%3 == 0) {
        // If there are no constructions, upgrade the controller
        var controller = creep.room.find(FIND_STRUCTURES, {
            filter: {structureType: STRUCTURE_CONTROLLER}
        });

        creep.moveTo(controller[0]);
        creep.upgradeController(controller[0]);
        return true;
    }
    return false;
}

function reinforceWalls(creep)
{
    var spawn = Game.spawns.Spawn1;
    var assignedWall = spawn.getStructureAssignedToCreep('reinforce', creep);

    // If no wall assigned, assign a wall
    if (assignedWall == undefined) {
        // If there is nothing left to do, and the creep isn't designated to upgrade, build up walls
        var reinforce = Game.spawns.Spawn1.pos.findClosest(FIND_STRUCTURES, {
            filter: function (s) {
                if (s.pos.x == 0 || s.pos.x == 49 || s.pos.y == 0 || s.pos.y == 49) return false; // Ignore starter walls
                if (spawn.structureIsAssigned('reinforce', s)) return false;
                return ( s.structureType == STRUCTURE_RAMPART && (s.hits < s.hitsMax - 25000) ) || ( s.structureType == STRUCTURE_WALL && s.hits < 975000);
            }
        });
        spawn.assignStructure('reinforce', reinforce, creep);
        assignedWall = reinforce;
        console.log("assigned " + creep.name + " to reinforce " + reinforce);
    }

    if (assignedWall != undefined) {
        //console.log(creep.name + " reinforcing " + assignedWall);
        creep.moveTo(assignedWall);
        creep.repair(assignedWall);

        // If the structure is built up, deassign the builder
        if
        (
            (assignedWall.structureType == STRUCTURE_RAMPART && assignedWall.hits >= assignedWall.hitsMax)
            ||
            (assignedWall.structureType == STRUCTURE_WALL && assignedWall.hits >= 1000000)
        ) {
            spawn.unassignStructure('reinforce', assignedWall);
            console.log("unassigned reinforce " + reinforce);
        }

        return true;
    }

    return false;
}
