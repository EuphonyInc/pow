module.exports = function(grunt){
  //Configure task(s)
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:{
      build: ['build/']
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          './build/pow.js': ['./src/*.js']
        }
      }
    },
    uglify: {
      build: {
        options: {
          mangle: true,
          compress: true,
          preserveComments: false,
          header: "",
          footer: "",
        },
        src: ['build/pow.js'],
        dest: 'build/pow.min.js'
      },
      demo: {
        options: {
          mangle: false,
          compress: false,
          preserveComments: false,
          header: "",
          footer: "",
        },
        src: ['src/app.module.js','src/*.js'],
        dest: 'demo/pow.min.js'
      }
    }
  });

  //Load the plugins
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  //Register tasks
  grunt.registerTask('default', ['clean:build','ngAnnotate','uglify:build']);
  grunt.registerTask('demo', ['uglify:demo']);
};
