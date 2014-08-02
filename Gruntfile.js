module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jslint : {
            dist : {
                src : ['src/**/*.js'],
                directives : {
                    nomen : true,
                    sloppy : true,
                    white : true,
                    browser : true,
                    predef : ['lt', '$']
                }
            }
        },

        jsdoc : {
            dist: {
                src: ['README.md'],
                options: {
                    "template": "node_modules/ink-docstrap/template",
                    "encoding": "utf8",
                    "destination": "docs",
                    "recurse": true,
                    "private": true,
                    configure: 'jsdoc.conf.json'
                }
            }
        },
        concat : {
            dist : {
                src : [
                    'src/namespace.js',
                    'src/**/*.js',
                    'src/<%= pkg.name %>.js'
                ],
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        cssmin: {
            dist: {
                files: {
                    'build/<%= pkg.name %>-<%= pkg.version %>.min.css': ['src/<%= pkg.name %>.css']
                }
            }
        },
        uglify : {
            dist : {
                files : {
                    'build/<%= pkg.name %>-<%= pkg.version %>.min.js' : [
                        'build/<%= pkg.name %>-<%= pkg.version %>.js'
                    ]
                }
            }
        },
        copy: {
            css: {
                src: 'src/<%= pkg.name %>.css',
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.css'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', [
        'jslint', 'jsdoc', 'concat',
        'cssmin', 'uglify', 'copy'
    ]);
};
