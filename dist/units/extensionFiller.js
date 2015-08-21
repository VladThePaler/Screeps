// Late game unit for when we have a storage container, because at that point haulers will stop filling extensions

module.exports = {

    run: function (creep) {
        var storage = creep.getNearestStorage();
        if (creep.carry.energy < creep.carryCapacity)
            storage.transferEnergy(creep, creep.carryCapacity - creep.carry.energy);

        if (creep.memory.state == undefined) creep.memory.state = 'collecting';

        // First try collecting from the spawn
        if (creep.memory.state == 'collecting') {
            //console.log(creep.name + " collecting");
            var spawn = creep.getSpawn();

            creep.moveMeTo(spawn);
            var transferEnergy = creep.carryCapacity - creep.carry.energy;
            if (spawn.energy < transferEnergy) transferEnergy = spawn.energy;
            spawn.transferEnergy(creep, transferEnergy);

            if (spawn.energy < (creep.carryCapacity / 2)) creep.memory.state = 'collectingFromStorage';
            if (creep.carry.energy >= creep.carryCapacity) creep.memory.state = 'filling';
        }

        // Then try collecting from storage
        if (creep.memory.state == 'collectingFromStorage') {
            //console.log(creep.name + " collecting from storage");
            creep.moveMeTo(storage);

            if (creep.carry.energy >= creep.carryCapacity) creep.memory.state = 'filling';
        }

        // Then go around and fill non-full extensions
        if (creep.memory.state == 'filling') {
            //console.log(creep.name + " filling");
            var nonFullLink = creep.getSpawn().pos.findInRange(FIND_MY_STRUCTURES, 10, {
                filter: function (i) {
                    return i.structureType == STRUCTURE_LINK && (i.energy < i.energyCapacity);
                }
            });
            if (nonFullLink.length > 0) {
                creep.moveMeTo(nonFullLink[0]);
                creep.transferEnergy(nonFullLink[0]);
            } else {
                // Look for extensions that need filling
                var nonFullExtension = creep.pos.findClosest(FIND_MY_STRUCTURES, {
                    filter: function (i) {
                        return i.structureType == STRUCTURE_EXTENSION && (i.energy < i.energyCapacity);
                    }
                });

                if (nonFullExtension != undefined) {
                    creep.moveMeTo(nonFullExtension);
                    creep.transferEnergy(nonFullExtension);
                } else {
                    creep.moveMeTo(creep.getSpawn());
                    if (creep.ticksToLive <2) {
                        creep.transferEnergy(creep.getSpawn());
                        creep.suicide();
                    }
                }
            }
            if (creep.carry.energy == 0) creep.memory.state = 'collecting';
        }

    }
}