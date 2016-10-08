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
      $scope.data.audio = {
        text: $scope.data.text,
        locale: $scope.data.locale,
        audioType: $scope.data.audioType,
        voice: "dawn_monotone_44100"
      };

      voiceFactory.getAudio($scope.data.audio).then(function(arrayBuffer) {
        $scope.data.loadBuffers[num] = $scope.data.arrayBuffer;
      });
    };
  });

})();
