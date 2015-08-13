module.exports = function () {

    Creep.prototype.sayHello = function() {
        this.say('Heya!');
    };

    Creep.prototype.keepAwayFromEnemies = function(minRange)
    {
        var target = this.pos.findClosest(Game.HOSTILE_CREEPS);
        if(target !== null && target.pos.inRangeTo(this.pos, minRange))
            this.moveTo(this.pos.x + this.pos.x - this.pos.x, this.pos.y + this.pos.y - this.pos.y );
    };
};