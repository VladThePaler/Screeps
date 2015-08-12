// Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Builder1', {'role':'builder', 'tags':['worker']} );

module.exports = function (creep) {

    // If the creep is out of energy, go get more
    if(creep.carry.energy == 0) {
        creep.moveTo(Game.spawns.Spawn1);

        if (Game.spawns.Spawn1.energy > creep.carryCapacity) {
            Game.spawns.Spawn1.transferEnergy(creep, creep.carryCapacity);
        }
    } else {

        // Find the site that is the furthest built and focus on that
        var sites = creep.room.find(FIND_CONSTRUCTION_SITES).sort(function (a, b) {
            return a.progress > b.progress
        });
        if (sites.length > 0) {
            // If there has not been any progress, pick the closest target
            var site = (sites[0].progress > 0) ? sites[0] : creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
            creep.moveTo(site);
            creep.build(site);
        } else {
            // If there are no constructions, upgrade the controller
            var controller = creep.room.find(FIND_STRUCTURES, {
                filter: {structureType: STRUCTURE_CONTROLLER}
            });

            creep.moveTo(controller[0]);
            creep.upgradeController(controller[0]);
        }
    }
};