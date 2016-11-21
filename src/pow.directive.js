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

        // create a new instance of the player and get things started

        var playerIndex;

        // we use the global scope here to store an array of players. Due to
        // browser limitations, the maximum players on a page is 6.
        if (window.players) {

          window.players.push(new Player(element));
          playerIndex = window.players.length - 1;

        } else {

          window.players = [];
          window.players.push(new Player(element));
          playerIndex = window.players.length - 1;

        }

        // watch the array-buffer attribute on the directive for changes to the
        // value.
        scope.$watch(attrs.arrayBuffer, function(arrayBuffer) {

          // we use eval to grab the audio off a dynamically changing value of
          // `attrs.arrayBuffer`
          var str = "scope." + attrs.arrayBuffer;
          var audio = eval(str);

          if(audio){

            // if audio is an arrayBuffer
            if (audio.__proto__.toString() === "[object ArrayBuffer]") {

              //
              window.players[playerIndex].fetch(arrayBuffer);

              var para = document.createElement("div");

              window.players[playerIndex].el[0].replaceChild(para, window.players[playerIndex].el[0].children[0]);

              $timeout(function() {}, 0, false);
            }

          }
        });

        function Player ( el ) {
          this.ac = new ( window.AudioContext || webkitAudioContext )();
          this.el = el;
          this.overlay = el.children()[0];
          this.button = el.children()[1].children[0];
          this.downloadButton = el.children()[1].children[2];
          this.track = el.children()[1].children[1];
          this.progress = el.children()[1].children[1].children[0];
          this.scrubber = el.children()[1].children[1].children[1];
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
          if(this.position === this.buffer.duration){
            this.position = 0;
          }
          this.position = typeof position === 'number' ? position : this.position || 0;
          this.startTime = this.ac.currentTime - ( this.position || 0 );
          this.source.start(this.ac.currentTime, this.position);
          this.playing = true;
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
            this.button.classList.add('fa-pause');
            this.button.classList.remove('fa-play');
          } else {
            this.button.classList.add('fa-play');
            this.button.classList.remove('fa-pause');
          }
          this.progress.style.width = ( progress * width ) + 'px';
          if ( !this.dragging ) {
            this.scrubber.style.left = ( progress * width ) + 'px';
          }
          requestAnimationFrame(this.draw.bind(this));
        };

      }

    }
  });
})();
