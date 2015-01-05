'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9000,
          keepalive: true,
          open: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*.js'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'connect',
    'watch'
  ]);

}
