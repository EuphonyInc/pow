(function() {
  'use strict';
  angular.module('pow-demo').factory('voiceFactory',['$http', '$sce', '$httpParamSerializerJQLike' ,function($http, $sce, $httpParamSerializerJQLike){

    function getSrc(voicesrc,text){
      return $sce.trustAsResourceUrl("http://52.32.197.208:59125/process?INPUT_TEXT="+text+"&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&LOCALE=en_US&AUDIO=WAVE_FILE&VOICE="+voicesrc+"");
      //return $http.post('/api/v1/voices');
    }

    function getAudio(opts) {
      return $http({
        method: 'POST',
        url: "http://api.euphonyinc.com/api/v1/voices",
        headers: {
          apikey: '973ed1eac7664149be302f7acd155ec1',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: $httpParamSerializerJQLike({
          text: opts.text,
          audioType: opts.audioType,
          voice: opts.voice
        }),
        responseType: 'arraybuffer'
      }).then(function(response) {
        return response.data;
      });
    }

    return {
      getAudioSrc: function (voicesrc,text){
        return getSrc(voicesrc,text);
      },
      getAudio: function(opts) {
        return getAudio(opts);
      }
    };

  }]);
})();
