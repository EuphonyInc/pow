(function() {
  'use strict';
angular.module('pow').controller('AudioCtrl',function($scope, voiceFactory) {
  $scope.data = {};

  $scope.data.text = "Hello";
  $scope.data.voice = "en_US";
  $scope.data.audioType = "WAVE_FILE";
  $scope.data.audio = {};
  $scope.update = function() {
    console.log('okay')
    $scope.data.audio = {
      text: $scope.data.text,
      voice: $scope.data.voice,
      audioType: $scope.data.audioType
    };

    voiceFactory.getAudio($scope.data.audio).then(function(arrayBuffer) {
      $scope.data.arrayBuffer= arrayBuffer;
    });
  };
});

})();
