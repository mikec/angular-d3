module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

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
            }
        },

        concat: {
            angular_d3_js: {
                src: grunt.file.expand('src/**/*.js'),
                dest: 'dist/angular-d3.js'
            }
        },

        'gh-pages': {
            options: {
                base: 'demo'
            },
            src: ['**']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', [
        'concat:angular_d3_js',
        'copy:demo_required_js'
    ]);

};