// Main

var harvester = require('harvester');

for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    harvester(creep);
}