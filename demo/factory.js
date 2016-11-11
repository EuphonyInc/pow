(function() {
  'use strict';
  angular.module('pow-demo').factory('voiceFactory',['$http', '$sce', '$httpParamSerializerJQLike' ,function($http, $sce, $httpParamSerializerJQLike){

    function getAudio(opts) {
      return $http({
        method: 'POST',
        url: "http://api.euphonyinc.com/api/v1/voices",
        headers: {
          apikey: '6e43963fe1ea4e45813d631c8c5ac798',
          'Content-Type': 'application/json'
        },
        data: {
          text: opts.text,
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
