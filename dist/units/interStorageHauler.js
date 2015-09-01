// Haul from one room to another. Quite manual at the moment.

var storage = {
    from: '55d0c8eba50b87585a33fa25',
    to: '55dbd4412c7e434c7c92c002'
};

module.exports = {

    bodyParts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    ],

    run: function (creep) {
        var from = Game.getObjectById(storage.from);
        var to = Game.getObjectById(storage.to);

        // If there's energy underfoot, grab it
        var energyUnderfoot = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (creep.carry.energy < creep.carryCapacity && energyUnderfoot.length > 0) {
            creep.pickup(energyUnderfoot[0]);
        }

        if (creep.carry.energy == 0) {
            creep.moveTo(from, {reusePath:20});
            from.transferEnergy(creep);
        } else {
            creep.moveTo(to, {reusePath:20});
            creep.transferEnergy(to);
        }
    }
};
