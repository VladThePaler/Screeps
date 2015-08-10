var creds = require("./creds.json");
/*
 {
 "email": "email@email.com",
 "password": "somepassword"
 }
*/
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: creds.email,
                password: creds.password,
                branch: 'default'
            },
            dist: {
                src: ['dist/**/*.js']
            }
        }
    });
};