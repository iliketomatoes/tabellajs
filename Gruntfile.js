/*jshint esversion: 6 */

const release = `/*
 *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>
 *  <%= grunt.template.today("yyyy-mm-dd") %>
 *
 *  <%= pkg.homepage %>
 */\n\n`;

const copyright = `/*
 *  Copyright (C) 2014-2016  Interpromotion <info@interpromotion.com>
 *  Copyright (C) 2014-2016  Giancarlo Soverini <giancarlosoverini@gmail.com>
 *
 *  This file is part of Tabellajs.
 *
 *  Tabellajs is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  Tabellajs is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */\n\n`;

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: release + copyright,
    // Task configuration.
    clean: {
      css: ['./dist/css/home.css', './dist/css/tabella.css'],
      js: ['./dist/*.js']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: {
          block: true
        }
      },
      dist: {
        src: [
              'src/intro.js',
              'src/classie.js',
              'src/helpers.js',
              'src/exception.js',
              'src/animator.js',
              'src/toucher.js',
              'src/tabellabuilder.js',
              'src/constructor.js',
              'src/events.js',
              'src/publicmethods.js',
              'src/outro.js'
             ],
        dest: 'dist/tabella.js'
      },
      dev:{
        src: [
              'src/intro.js',
              'src/classie.js',
              'src/helpers.js',
              'src/exception.js',
              'src/animator.js',
              'src/toucher.js',
              'src/tabellabuilder.js',
              'src/constructor.js',
              'src/events.js',
              'src/publicmethods.js',
              'src/testoutro.js'
             ],
        dest: 'test/tabella.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/tabella.min.js'
      },
    },
    jshint: {
       files: ['Gruntfile.js', 'dist/tabella.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          outputStyle: 'expanded'
        },
        files: {
          'dist/assets/css/tabella.css': 'src/scss/app.scss',
          'dist/assets/css/home.css': 'src/scss/home.scss'
        }
      }
    },
    watch: {
      styling: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      },
      chaining: {
        files: ['<%= concat.dist.src %>'],
        tasks: ['concat']
      },
      hinting: {
        files: ['Gruntfile.js', '<%= jshint.files %>'],
        tasks: ['jshint']
      },
      uglifying: {
        files: ['<%= concat.dist.dest %>'],
        tasks: ['uglify']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', [ 'clean:css', 'clean:js','concat', 'jshint', 'uglify', 'sass' ]);

  // Default task.
  grunt.registerTask('js', [ 'clean:js', 'concat', 'jshint', 'uglify' ]);

  // Style task.
  grunt.registerTask('style', [ 'clean:css', 'sass' ]);

};
