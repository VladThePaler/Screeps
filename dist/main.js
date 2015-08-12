// Main

var creepManager = require('creepManager');
require('globals')(); // @TODO : Any way to not redefine this for every tick?

creepManager.ensureCreeps();

for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    creepManager.handleActions(creep);
}


