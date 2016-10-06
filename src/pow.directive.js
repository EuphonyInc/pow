/* Forked from work done by Kevin Ennis: http://stackoverflow.com/questions/22680572/build-html5-audio-player-with-web-audio-api */
/* Forked from work done by Kevin Ennis: http://jsbin.com/lenapigo/1/edit?html,css,output */


(function() {
  'use strict';

  angular.module('pow').directive('pow', function($pow, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'player.html',
      replace: true,
      link: function(scope, element, attrs, controller) {

        scope.$watch(attrs.arrayBuffer, function(arrayBuffer) {

          if (scope.data.arrayBuffer.__proto__.toString() === "[object ArrayBuffer]") {
            window.player.fetch(arrayBuffer);

            $timeout(function() {
              scope.data.arrayBuffer = {};
            }, 0, false);
          }


        });

        function Player ( el ) {
          this.ac = new ( window.AudioContext || webkitAudioContext )();
          this.url = url;
          this.el = el;
          this.button = el.children()[0].children[0];
          this.svgpath = el.children()[0].children[0].children[0];
          this.downloadButton = el.children()[0].children[2];
          this.track = el.children()[0].children[1];
          this.progress = el.children()[0].children[1].children[0];
          this.scrubber = el.children()[0].children[1].children[1];
          this.loading = true;
          this.bindEvents();
        }

        Player.prototype.bindEvents = function() {
          this.downloadButton.addEventListener('click', this.download.bind(this));
          this.button.addEventListener('click', this.toggle.bind(this));
          this.scrubber.addEventListener('mousedown', this.onMouseDown.bind(this));
          window.addEventListener('mousemove', this.onDrag.bind(this));
          window.addEventListener('mouseup', this.onMouseUp.bind(this));
        };


        Player.prototype.fetch = function(arrayBuffer) {
          if (arrayBuffer) {
            this.loading = true;
            this.decode(arrayBuffer);
          }
        };

        Player.prototype.decode = function( arrayBuffer ) {
          this.ac.decodeAudioData(arrayBuffer, function( audioBuffer ) {
            this.buffer = audioBuffer;
            this.wav = $pow.audioBufferToWav(audioBuffer);
            this.position = 0;
            this.draw();
            this.loading = false;
          }.bind(this));
        };

        Player.prototype.connect = function() {
          if ( this.playing ) {
            this.pause();
          }
          this.source = this.ac.createBufferSource();

          this.source.buffer = this.buffer;
          this.source.connect(this.ac.destination);
        };

        Player.prototype.play = function( position ) {
          this.connect();
          this.position = typeof position === 'number' ? position : this.position || 0;
          this.startTime = this.ac.currentTime - ( this.position || 0 );
          this.source.start(this.ac.currentTime, this.position);
          this.playing = true;

          console.log('path',this.svgpath);
          // var path = document.createElement("path");
          // path.d="M1664 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45zm-896 0v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45z";
        //  var child = document.getElementById("playButton").childNodes[0];
          // var parentDiv = child.parentNode;
          // parentDiv.replaceChild(child,path);
        //  child.setAttribute("d", "M1664 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45zm-896 0v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45z");
        //  console.log('child',child);
        };

        Player.prototype.pause = function() {
          if ( this.source ) {
            this.source.stop(0);
            this.source = null;
            this.position = this.ac.currentTime - this.startTime;
            this.playing = false;
          }
        };

        Player.prototype.seek = function( time ) {
          if ( this.playing ) {
            this.play(time);
          }
          else {
            this.position = time;
          }
        };

        Player.prototype.updatePosition = function() {
          this.position = this.playing ?
            this.ac.currentTime - this.startTime : this.position;
          if ( this.position >= this.buffer.duration ) {
            this.position = this.buffer.duration;
            this.pause();
          }
          return this.position;
        };

        Player.prototype.toggle = function() {
          if ( !this.playing ) {
            this.play();
          }
          else {
            this.pause();
          }
        };

        Player.prototype.download = function() {
          if ( !this.loading ) {
            var anchor = document.createElement('a');
            document.body.appendChild(anchor);
            anchor.style = 'display: none';

            var blob = new window.Blob([ new DataView(this.wav) ], {
              type: 'audio/wav'
            });

            var url = window.URL.createObjectURL(blob);
            anchor.href = url;
            anchor.download = 'audio.wav';
            anchor.click();
            window.URL.revokeObjectURL(url);
          }
          else {

          }
        };

        Player.prototype.onMouseDown = function( e ) {
          this.dragging = true;
          this.startX = e.pageX;
          this.startLeft = parseInt(this.scrubber.style.left || 0, 10);
        };

        Player.prototype.onDrag = function( e ) {
          var width, position;
          if ( !this.dragging ) {
            return;
          }
          width = this.track.offsetWidth;
          position = this.startLeft + ( e.pageX - this.startX );
          position = Math.max(Math.min(width, position), 0);
          this.scrubber.style.left = position + 'px';
        };

        Player.prototype.onMouseUp = function() {
          var width, left, time;
          if ( this.dragging ) {
            width = this.track.offsetWidth;
            left = parseInt(this.scrubber.style.left || 0, 10);
            time = left / width * this.buffer.duration;
            this.seek(time);
            this.dragging = false;
          }
        };

        Player.prototype.draw = function() {
          var progress = ( this.updatePosition() / this.buffer.duration ),
            width = this.track.offsetWidth;
          if ( this.playing ) {
          //this.button.innerHTML = '<path d="M1664 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45zm-896 0v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45z"/>';
            //this.button.classList.add('fa-pause');
            //this.button.classList.remove('fa-play');
          } else {
            //this.button.innerHTML = '<path d="M36.068 20.176l-29-20C6.761-0.035 6.363-0.057 6.035 0.114 5.706 0.287 5.5 0.627 5.5 0.999v40c0 0.372 0.206 0.713 0.535 0.886 0.146 0.076 0.306 0.114 0.465 0.114 0.199 0 0.397-0.06 0.568-0.177l29-20c0.271-0.187 0.432-0.494 0.432-0.823S36.338 20.363 36.068 20.176z"/>';
            //this.button.classList.add('fa-play');
            //this.button.classList.remove('fa-pause');
          }
          this.progress.style.width = ( progress * width ) + 'px';
          if ( !this.dragging ) {
            this.scrubber.style.left = ( progress * width ) + 'px';
          }
          requestAnimationFrame(this.draw.bind(this));
        };
        var url = 'http://static.kevvv.in/sounds/callmemaybe.mp3';

        // create a new instance of the player and get things started
        window.player = new Player(element);
      }

    }
  });
})();
