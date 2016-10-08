angular.module('pow', [])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('player.html', '<div class="player" style="box-sizing: border-box;margin: 0 auto;width: 345px;"> <div class="controls" style="box-sizing: border-box;background: #fafafa;padding: 8px;"> <svg id="playButton" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 41.999 41.999" style="box-sizing: border-box;fill: #595959;width: 20px;margin: 3px 0 0 0;font-size: 16px;text-align: center;display: inline-block;cursor: pointer;background: transparent;border: none;outline: none;"><path d="M36.068 20.176l-29-20C6.761-0.035 6.363-0.057 6.035 0.114 5.706 0.287 5.5 0.627 5.5 0.999v40c0 0.372 0.206 0.713 0.535 0.886 0.146 0.076 0.306 0.114 0.465 0.114 0.199 0 0.397-0.06 0.568-0.177l29-20c0.271-0.187 0.432-0.494 0.432-0.823S36.338 20.363 36.068 20.176z" style="box-sizing: border-box;"></path></svg> <div class="track" style="box-sizing: border-box;position: relative;width: 236px;margin: 7px 0 6px 16px;height: 5px;background-color: #666;display: inline-block;vertical-align: center;"> <div class="progress" style="box-sizing: border-box;position: absolute;width: 0%;height: 100%;background: #4487f2;"></div><div class="scrubber" style="box-sizing: border-box;position: absolute;width: 18px;height: 18px;border-radius: 50%;margin: -6.5px 0 0 -9px;background: #4487f2;cursor: pointer;"></div></div><svg id="downloadButton" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 471.2 471.2" style="box-sizing: border-box;fill: #595959;width: 20px;margin: 3px 0 0 15px;font-size: 16px;text-align: center;display: inline-block;cursor: pointer;background: transparent;border: none;outline: none;"><path d="M457.7 230.2c-7.5 0-13.5 6-13.5 13.5v122.8c0 33.4-27.2 60.5-60.5 60.5H87.5c-33.4 0-60.5-27.2-60.5-60.5v-124.8c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v124.8c0 48.3 39.3 87.5 87.5 87.5h296.2c48.3 0 87.5-39.3 87.5-87.5v-122.8C471.2 236.3 465.2 230.2 457.7 230.2z" style="box-sizing: border-box;"></path><path d="M226.1 346.8c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l85.8-85.8c5.3-5.3 5.3-13.8 0-19.1 -5.3-5.3-13.8-5.3-19.1 0l-62.7 62.8V30.8c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v273.9l-62.8-62.8c-5.3-5.3-13.8-5.3-19.1 0 -5.3 5.3-5.3 13.8 0 19.1L226.1 346.8z" style="box-sizing: border-box;"></path></svg> </div></div>');
}]);

/* Forked from work done by Kevin Ennis: http://stackoverflow.com/questions/22680572/build-html5-audio-player-with-web-audio-api */
/* Forked from work done by Kevin Ennis: http://jsbin.com/lenapigo/1/edit?html,css,output */


(function() {
  'use strict';

  angular.module('pow').directive('pow', ['$pow', '$timeout', function($pow, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'player.html',
      replace: true,
      link: function(scope, element, attrs, controller) {
        var num = scope.$eval(attrs.playernumber);
        scope.$watch(attrs.arrayBuffer, function(arrayBuffer) {

          if(scope.data.arrayBuffer){

            if (scope.data.arrayBuffer.__proto__.toString() === "[object ArrayBuffer]") {
              currentplayer.fetch(arrayBuffer);

              $timeout(function() {
                scope.data.arrayBuffer = {};
              }, 0, false);
            }

          }
        });

        function Player ( el ) {
          this.ac = new ( window.AudioContext || webkitAudioContext )();
          this.url = url;
          this.el = el;
          this.button = el.children()[0].children[0];
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

        var currentplayer = window.player+num;
        // create a new instance of the player and get things started
        currentplayer = new Player(element);
      }

    }
  }]);
})();

/* Forked from https://github.com/Jam3/audiobuffer-to-wav */
(function() {
  'use strict';
  
  angular.module('pow').factory('$pow', function() {
    function encodeWAV (samples, format, sampleRate, numChannels, bitDepth) {
      var bytesPerSample = bitDepth / 8;
      var blockAlign = numChannels * bytesPerSample;

      var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
      var view = new DataView(buffer);

      /* RIFF identifier */
      writeString(view, 0, 'RIFF');
      /* RIFF chunk length */
      view.setUint32(4, 36 + samples.length * bytesPerSample, true);
      /* RIFF type */
      writeString(view, 8, 'WAVE');
      /* format chunk identifier */
      writeString(view, 12, 'fmt ');
      /* format chunk length */
      view.setUint32(16, 16, true);
      /* sample format (raw) */
      view.setUint16(20, format, true);
      /* channel count */
      view.setUint16(22, numChannels, true);
      /* sample rate */
      view.setUint32(24, sampleRate, true);
      /* byte rate (sample rate * block align) */
      view.setUint32(28, sampleRate * blockAlign, true);
      /* block align (channel count * bytes per sample) */
      view.setUint16(32, blockAlign, true);
      /* bits per sample */
      view.setUint16(34, bitDepth, true);
      /* data chunk identifier */
      writeString(view, 36, 'data');
      /* data chunk length */
      view.setUint32(40, samples.length * bytesPerSample, true);
      if (format === 1) { // Raw PCM
        floatTo16BitPCM(view, 44, samples);
      } else {
        writeFloat32(view, 44, samples);
      }

      return buffer
    }

    function interleave (inputL, inputR) {
      var length = inputL.length + inputR.length;
      var result = new Float32Array(length);

      var index = 0;
      var inputIndex = 0;

      while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
      }
      return result;
    }

    function writeFloat32 (output, offset, input) {
      for (var i = 0; i < input.length; i++, offset += 4) {
        output.setFloat32(offset, input[i], true);
      }
    }

    function floatTo16BitPCM (output, offset, input) {
      for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }

    function writeString (view, offset, string) {
      for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    return {
      audioBufferToWav: function (buffer, opt) {
        opt = opt || {};

        var numChannels = buffer.numberOfChannels;
        var sampleRate = buffer.sampleRate;
        var format = opt.float32 ? 3 : 1;
        var bitDepth = format === 3 ? 32 : 16;

        var result;
        if (numChannels === 2) {
          result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
        } else {
          result = buffer.getChannelData(0);
        }

        return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
      }
    };
  });
})();
