

skiApp.controller('videoController', ['$scope', '$sce', 'sharedGraphDataProperties', function($scope, $sce, sharedGraphDataProperties) {
    //VIDEO variables
    var controller = this;
    $scope.API = null;
    $scope.sliderSet = false;
    controller.onPlayerReady = function(API) {
        $scope.API = API;
    };

    //TODO Setting slider can be improved but API is returning 0 outside this function call
    $scope.setSliderValue = function() {
        if($scope.API){
        $scope.videoSlider.options.floor = -Math.ceil($scope.API.totalTime/1000);
        $scope.videoSlider.options.ceil = Math.round($scope.API.totalTime/1000);
        }
        
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
        if(!$scope.sliderSet){
        $scope.setSliderValue();
        $scope.sliderSet = true;
        }
        $scope.API.seekTime($scope.videoSlider.value, false);

    }

    $scope.videoSlider = {
        value: 0,
        options: {
            floor: -450,
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

