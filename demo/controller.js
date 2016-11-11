(function() {
  'use strict';
  angular.module('pow-demo').controller('AudioCtrl',function($scope, voiceFactory) {

    $scope.playernumber = 0;

    $scope.data = {};

    $scope.data.text = "Hello";
    $scope.data.locale = "en_US";
    $scope.data.audioType = "WAVE_FILE";
    $scope.data.loadBuffers = [];
    $scope.update = function(num) {
      console.log("updating audio")
      $scope.data.audio = {
        text: $scope.data.text,
        voice: "Dawn Happy"
      };

      voiceFactory.getAudio($scope.data.audio).then(function(arrayBuffer) {
        console.log('got audio')
        $scope.data.loadBuffers[num] = arrayBuffer;
      });
    };
  });

})();
