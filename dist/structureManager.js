var links = {
    E6N8: {
        from: '55d3865211cd391749e73814',
        to: '55d388e08a945a294979f488'
    },
    E6N7: {
        from: '55dde34ba808013032e0d11e',
        to: '55dde444f43f2ba81b08477b'
    }

};

module.exports = {

    handleStructures: function () {
        this.handleLinks();
    },

    handleLinks: function() {
        for (var room in links) {
            var fromLink = Game.getObjectById(links[room].from);
            var toLink = Game.getObjectById(links[room].to);

            if (fromLink.energy >= fromLink.energyCapacity && toLink.energy == 0 && fromLink.cooldown <= 0) {
                fromLink.transferEnergy(toLink, fromLink.energy);
            }

            if (toLink.energy > 0) {

                var creeps = toLink.pos.findInRange(FIND_MY_CREEPS, 1, {filter: function (c) {return c.memory.role != 'hauler';} });
                if (creeps.length > 0) {
                    var lowestCreep = creeps.sort(function (a, b) {
                        return a.carry.energy - b.carry.energy ;
                    })[0];
                    toLink.transferEnergy(lowestCreep, (lowestCreep.energyCapacity - lowestCreep.carry.energy));
                }
            }
        }
    }
};
