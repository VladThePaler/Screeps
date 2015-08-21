// Haul from a mine back to base
module.exports = {

    bodyParts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
    ],

    run: function (creep) {

        if (creep.memory.state == undefined) creep.memory.state = 'collecting';

        var controllerUpgraders = creep.room.find(FIND_MY_CREEPS, {
            filter: function (c) {
                return c.memory.role == 'controllerUpgrader';
            }
        });

        if (controllerUpgraders.length == 0) return;
        var controllerUpgrader = controllerUpgraders[0];

        var energyInRange = creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);
        var storage = creep.getNearestStorage();
        // Source will be spawn in the early game, storage in the later game
        var source = (storage == undefined) ? creep.getSpawn() : storage;

        if (creep.memory.state == 'collecting') {
            //console.log("c hauler collecting");

            // If there's nearby energy, gather it
            if (creep.hasCarryCapacity() && energyInRange.length > 0 && creep.pos.getRangeTo(controllerUpgrader) > 3 || creep.pos.getRangeTo(source) <= 1) creep.memory.state = 'gathering';
            else if (source.energy < 150) { // If the source doesn't have much energy, try to find dropped energy
                var energy = creep.pos.findClosest(FIND_DROPPED_ENERGY);
                creep.moveTo(energy);
            }
            else creep.moveMeTo(source);
        }

        if (creep.memory.state == 'gathering') {

            //console.log("c hauler gathering");
            source.transferEnergy(creep, (creep.energyCapacity - creep.carry.energy));
            if (creep.pos.getRangeTo(energyInRange[0]) > 1)
                creep.moveMeTo(energyInRange[0]);
            var pickup = creep.pickup(energyInRange[0]);
            if (pickup != OK) creep.memory.state = 'collecting';
            if (!creep.hasCarryCapacity()) creep.memory.state = 'transferring';
        }


        if (creep.memory.state == 'transferring') {
            //console.log("c hauler transferring");
            creep.moveMeTo(controllerUpgrader);
            creep.transferEnergy(controllerUpgrader, (controllerUpgrader.energyCapacity - controllerUpgrader.carry.energy));

            if (creep.carry.energy < 75) {
                creep.dropEnergy(creep.carry.energy);
                creep.memory.state = 'collecting';
            }

            if (creep.carry.energy <= 0) creep.memory.state = 'collecting';
        }
    }
}