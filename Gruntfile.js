module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        //scripts: grunt.file.expand('**/*.js'),

        copy: {
            demo_required_js: {
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/d3/d3.js',
                    'bower_components/ui-router/release/angular-ui-router.js',
                    'dist/angular-d3.js'
                ],
                dest: 'demo/lib/',
                flatten: true,
                expand: true
            },
            demo_required_css: {
                src: [
                    'dist/angular-d3.css'
                ],
                dest: 'demo/lib/',
                flatten: true,
                expand: true
            }
        },

        concat: {
            angular_d3_js: {
                src: grunt.file.expand('src/**/*.js'),
                dest: 'dist/angular-d3.js'
            },
            angular_d3_css: {
                src: grunt.file.expand('src/**/*.css'),
                dest: 'dist/angular-d3.css'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', [
        'concat:angular_d3_js',
        'concat:angular_d3_css',
        'copy:demo_required_js',
        'copy:demo_required_css'
    ]);

};