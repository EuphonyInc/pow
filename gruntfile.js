module.exports = function(grunt){
  //Configure task(s)
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:{
      build: ['build/']
    },
    cssmin:{
      build: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['*.css', '!*.min.css'],
          dest: 'build/',
          ext: '.min.css'
        }]
      },
      demo: {
        files: [{
          expand: true,
          cwd: 'demo/',
          src: ['*.css', '!*.min.css'],
          dest: 'demo/',
          ext: '.min.css'
        }]
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
        src: ['src/app.module.js','src/*.js'],
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
    },
    copy: {
      build: {
        files: [
          {expand: true, cwd:'src/', src: ['pow.css', 'player.html'], dest:'build/'}
        ]
      },
      demo: {
        files: [
          {expand: true, cwd:'src/', src: ['pow.css'], dest:'demo/'}
        ]
      }
    }
  });

  //Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  //Register tasks
  grunt.registerTask('default', ['clean:build','uglify:build','copy:build','cssmin:build']);
  grunt.registerTask('demo', ['uglify:demo']);
};
