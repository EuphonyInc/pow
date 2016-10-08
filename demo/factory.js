(function() {
  'use strict';
  angular.module('pow-demo').factory('voiceFactory',['$http', '$sce', '$httpParamSerializerJQLike' ,function($http, $sce, $httpParamSerializerJQLike){

    function getAudio(opts) {
      return $http({
        method: 'POST',
        url: "http://api.euphonyinc.com/api/v1/voices",
        headers: {
          apikey: 'debf1ac706e04ca7879be3b6547175ba',
          'Content-Type': 'application/json'
        },
        data: {
          text: opts.text,
          audioType: opts.audioType,
          locale: opts.locale,
          voice: opts.voice
        },
        responseType: 'arraybuffer'
      }).then(function(response) {
        return response.data;
      })
      .catch(function(err){
        console.log(err);
      });
    }

    return {
      getAudio: function(opts) {
        return getAudio(opts);
      }
    };

  }]);
})();
