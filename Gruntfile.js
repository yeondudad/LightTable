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
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        jsdoc : {
            dist : {
                src : ['README.md', 'src/**/*.js'],
                options: {
                    destination: 'docs',
                    encoding : 'utf-8',
                    recurse : true,
                    private : true
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
            html: {
                src: 'src/<%= pkg.name %>.html',
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.html'
            },
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
        'jslint', 'karma',  'jsdoc',
        'concat', 'cssmin', 'uglify',
        'copy'
    ]);
};
