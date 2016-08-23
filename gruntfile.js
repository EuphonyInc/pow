module.exports = function(grunt){
  //Configure task(s)
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:{
      build: ['build/']
    },
    cssmin:{
      target: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['*.css', '!*.min.css'],
          dest: 'build/',
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
      }
    },
    copy: {
      build: {
        files: [
          {expand: true, cwd:'src/', src: ['pow.css', 'player.html'], dest:'build/'}
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
  grunt.registerTask('default', ['clean:build','uglify:build','copy:build','cssmin']);
};
