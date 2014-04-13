module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        copy: {
            demo_required_js: {
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/d3/d3.js',
                    'bower_components/ui-router/release/angular-ui-router.js',
                    'dist/angular-d3.js',
                    'dist/angular-d3-axis.js',
                    'dist/angular-d3-bars.js',
                    'dist/angular-d3-lines.js',
                ],
                dest: 'demo/lib/',
                flatten: true,
                expand: true
            }
        },

        concat: {
            angular_d3_core_js: {
                src: [
                    'src/ngd3.js',
                    'src/services.js',
                    'src/directives.js'
                ],
                dest: 'dist/angular-d3.js'
            },
            angular_d3_axis_js: {
                src: ['src/axis/axis.js'],
                dest: 'dist/angular-d3-axis.js'
            },
            angular_d3_bars_js: {
                src: ['src/bars/bars.js'],
                dest: 'dist/angular-d3-bars.js'
            },
            angular_d3_lines_js: {
                src: ['src/lines/lines.js'],
                dest: 'dist/angular-d3-lines.js'
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
        'concat',
        'copy'
    ]);

};