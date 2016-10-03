
var httpRequest = new XMLHttpRequest();
var inputText = document.getElementById("input");
var url = "http://api.euphonyinc.com/api/v1/voices";

window.onload = function(){
    document.getElementById("update").onclick=function(){
		// alert("Hello WOrld");

		console.log(inputText);
		var body = {
	      text: inputText.value,
	      audioType: "WAVE_FILE",
	      locale: "en_US",
	      "VOICE": "dawn_monotone_44100"
	    };

	    // transform an object to URL encoded String
	    function transformRequest(obj) {
	        var str = [];
	        for(var p in obj)
	        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        return str.join("&");
	    }

	    httpRequest.open("POST", url, true);

	    // set request headers
	    httpRequest.setRequestHeader('apikey', '973ed1eac7664149be302f7acd155ec1');
	    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


	    //check the state of the request
	    httpRequest.onreadystatechange = function () {
		    if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
            // var element = document.getElementById('message');
            // element.innerHTML = httpRequest.responseText;
            window.player.fetch(httpRequest.response);
	        }
	    }; //onreadystatechange function

	    httpRequest.responseType = "arraybuffer";

		// send with transformed request body
    var transformedBody = transformRequest(body);
    httpRequest.send(transformedBody);



	} //onclick function
} //window.onload function



        function Player ( el ) {
          this.ac = new ( window.AudioContext || webkitAudioContext )();
          this.url = url;
          this.el = el;
          this.button = el.children[0].children[0];
          this.downloadButton = el.children[0].children[2];
          this.track = el.children[0].children[1];
          this.progress = el.children[0].children[1].children[0];
          this.scrubber = el.children[0].children[1].children[0].children[0];
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
            // this.message.innerHTML = 'Loaded';
            this.buffer = audioBuffer;
            this.wav = audioBufferToWav(audioBuffer);
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

        // create a new instance of the player and get things started
        var play = document.getElementById("player");
        console.log(play);
        window.player = new Player(play);


//Audio buffer to wav for download functionality

function audioBufferToWav (buffer, opt) {
  opt = opt || {}

  var numChannels = buffer.numberOfChannels
  var sampleRate = buffer.sampleRate
  var format = opt.float32 ? 3 : 1
  var bitDepth = format === 3 ? 32 : 16

  var result
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1))
  } else {
    result = buffer.getChannelData(0)
  }

  return encodeWAV(result, format, sampleRate, numChannels, bitDepth)
}

function encodeWAV (samples, format, sampleRate, numChannels, bitDepth) {
  var bytesPerSample = bitDepth / 8
  var blockAlign = numChannels * bytesPerSample

  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  var view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, 'RIFF')
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  /* RIFF type */
  writeString(view, 8, 'WAVE')
  /* format chunk identifier */
  writeString(view, 12, 'fmt ')
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, 'data')
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) { // Raw PCM
    floatTo16BitPCM(view, 44, samples)
  } else {
    writeFloat32(view, 44, samples)
  }

  return buffer
}

function interleave (inputL, inputR) {
  var length = inputL.length + inputR.length
  var result = new Float32Array(length)

  var index = 0
  var inputIndex = 0

  while (index < length) {
    result[index++] = inputL[inputIndex]
    result[index++] = inputR[inputIndex]
    inputIndex++
  }
  return result
}

function writeFloat32 (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true)
  }
}

function floatTo16BitPCM (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
}

function writeString (view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}








