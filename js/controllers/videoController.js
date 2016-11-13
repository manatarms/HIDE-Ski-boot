

skiApp.controller('videoController', ['$scope', '$sce', 'sharedGraphDataProperties', function($scope, $sce, sharedGraphDataProperties) {
    //VIDEO variables
    var controller = this;
    $scope.API = null;

    controller.onPlayerReady = function(API) {
        $scope.API = API;
    };
    $scope.setTime = function(time) {
        $scope.API.seekTime(50, true);
    }

    $scope.videoConfig = {
        preload: "none",

        sources: [
            { src: $sce.trustAsResourceUrl("../assets/jump.mp4"), type: "video/mp4" }
        ],
        theme: {
            url: "../css/vendor/videogular.css"
        },
        plugins: {
            controls: {
                autoHide: true,
                autoHideTime: 5000
            }
        }
    };

    $scope.videoSliderChanged = function() {
        $scope.API.seekTime($scope.videoSlider.value, false);
    }

    $scope.videoSlider = {
        value: 0,
        options: {
            floor: 0,
            ceil: 450,
            onChange: $scope.videoSliderChanged
        }
    };



    $scope.$on('graphPointMoved', function(event, args) {
        //$scope.API.seekTime(args * 0.001, false);
        //Time Value * conversion
        $scope.API.seekTime(args[0] * args[1] + $scope.videoSlider.value, false);
    });

}]);

