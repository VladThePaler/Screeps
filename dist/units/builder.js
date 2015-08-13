// Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Builder1', {'role':'builder', 'tags':['worker']} );

module.exports = function (creep) {

    // If the creep is out of energy, go get more
    if(creep.carry.energy == 0) {
        creep.moveTo(Game.spawns.Spawn1);

        if (Game.spawns.Spawn1.energy > creep.carryCapacity) {
            Game.spawns.Spawn1.transferEnergy(creep, creep.carryCapacity);
        }
    } else {
        var structuresNeedRepair = creep.room.find(FIND_MY_STRUCTURES, {
            filter: function(i) {
                return i.needsRepair() && i.structureType != STRUCTURE_WALL && i.structureType != STRUCTURE_RAMPART;
            }
        });

        // If a structure needs repair, find the one in most need of repair - this takes precedence
        if (structuresNeedRepair.length > 0){
            var repairStructure = structuresNeedRepair.sort(function(a,b) { return (a.hits/a.hitsMax) - (b.hits/b.hitsMax);})[0];
            creep.moveTo(repairStructure);
            creep.repair(repairStructure);
            return;
        }

        // Find the site that is the furthest built and focus on that
        var sites = creep.room.find(FIND_CONSTRUCTION_SITES).sort(function (a, b) {
            return a.progress - b.progress;
        });
        if (sites.length > 0) {
            // If there has not been any progress, pick the closest target
            var site = (sites[0].progress > 0) ? sites[0] : creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
            creep.moveTo(site);
            creep.build(site);
        } else {

            if (creep.memory.shouldUpgradeController) {
                // If there are no constructions, upgrade the controller
                var controller = creep.room.find(FIND_STRUCTURES, {
                    filter: {structureType: STRUCTURE_CONTROLLER}
                });

                creep.moveTo(controller[0]);
                creep.upgradeController(controller[0]);
            } else {
                // If there is nothing left to do, and the creep isn't designated to upgrade, build up walls
                var reinforce = Game.spawns.Spawn1.pos.findClosest(FIND_MY_STRUCTURES, {
                    filter: function(i) {
                        return (i.hits < i.hitsMax) && (i.structureType == STRUCTURE_RAMPART || i.structureType == STRUCTURE_WALL);
                    }
                });

                if (reinforce){
                    // @TODO : find a better way, need some jitter in here
                    // Bucket by 1000 so that workers won't churn between ramparts
                    //var reinforceStructure = reinforce.sort(function(a,b) { return Math.floor( (a.hits - b.hits) / 1000 );})[1];

                    console.log(reinforce);
                    creep.moveTo(reinforce);
                    creep.repair(reinforce);
                }
            }
        }
    }
};
