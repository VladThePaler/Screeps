// Late game unit for when we have a storage container, because at that point haulers will stop filling extensions
// Also distribute to/from links

// Handle two types of links, designated by flags:
// BLUE - fill from nearby storage to link - Used when linking to controller
// GREEN - fill from link to storage - Used when linking to mine

module.exports = {

    bodyParts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, MOVE],
        [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    ],

    run: function (creep) {

        if (this.handleLinks(creep)) return;

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
            if (creep.carry.energy == 0) creep.memory.state = 'collecting';
        }

    },

    handleLinks: function (creep) {
        var links = creep.getSpawn().pos.findInRange(FIND_MY_STRUCTURES, 10, { filter: {structureType: STRUCTURE_LINK}});
        if (links.length > 0) {
            for (var i in links) {
                var link = links[i];
                var flags = link.pos.findInRange(FIND_FLAGS, 1);
                if (flags.length > 0) {
                    var storage = creep.getNearestStorage();
                    var flag = flags[0];
                    // This is a link we should fill from storage
                    if (flag.color == COLOR_BLUE && (link.energy < link.energyCapacity) ) {
                        //console.log(creep.name + " filling link from blue storage");
                        creep.moveMeTo(link);
                        storage.transferEnergy(creep);
                        creep.transferEnergy(link);
                        return true;
                    }

                    // This is a link we should empty to storage
                    if (flag.color == COLOR_GREEN && (link.energy > 0) ) {
                        //console.log(creep.name + " filling storage from green link");
                        creep.moveMeTo(link);
                        link.transferEnergy(creep);
                        creep.transferEnergy(storage);
                        return true;
                    }

                }
            }
        }
        return false;

    }
};
