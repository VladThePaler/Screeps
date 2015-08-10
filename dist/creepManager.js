module.exports = function (creep) {
    var role = creep.memory['role'];
    if (!role) {
        console.log("Creep role not defined for '"+creep.name+"' so it doesn't have a behaviour.");
    } else {

        try {
            var unit = require(role);
            unit(creep);
        } catch (err) {
            console.log("Could not require creep role '"+role+"': "+err.message);
        }
    }
};
