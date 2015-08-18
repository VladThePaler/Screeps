
module.exports = {

    run: function (creep) {

        // If there's energy underfoot, grab it
        var energyUnderfoot = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (creep.carry.energy < creep.carryCapacity && energyUnderfoot.length > 0) {
            creep.pickup(energyUnderfoot[0]);
        }

        var controller = creep.getNearestController();

        creep.moveMeTo(controller);
        creep.claimController(controller);
        creep.upgradeController(controller);
    }
}

