module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist/<%= pkg.name %>']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
              'src/intro.js',
              'src/helpers.js',
              'src/exception.js',
              'src/tabellabuilder.js',
              'src/constructor.js',
              'src/tabellainit.js',
              'src/publicmethods.js',
              'src/outro.js'  
             ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      dev:{
        src: [
              'src/intro.js',
              'src/helpers.js',
              'src/exception.js',
              'src/tabellabuilder.js',
              'src/constructor.js',
              'src/tabellainit.js',
              'src/publicmethods.js',
              'src/testoutro.js'  
             ],
        dest: 'test/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    jshint: {
       files: ['Gruntfile.js', 'dist/<%= pkg.name %>.js'],
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
          outputStyle: 'compressed'
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
  grunt.registerTask('default', [ 'clean', 'concat', 'jshint', 'uglify', 'sass' ]);

  // Style task.
  grunt.registerTask('style', [ 'sass' ]);

  // Minifying despite jshint warnings task.
  grunt.registerTask('minifyjs', [ 'clean', 'concat', 'uglify' ]);

};