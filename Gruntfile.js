module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        copy: {
            demo_required_js: {
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/d3/d3.js',
                    'bower_components/ui-router/release/angular-ui-router.js'
                ],
                dest: 'demo/lib/',
                flatten: true,
                expand: true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy:demo_required_js']);

};