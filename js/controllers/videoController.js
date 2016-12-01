skiApp.controller('videoController', ['$scope', '$sce', 'sharedGraphDataProperties', function($scope, $sce, sharedGraphDataProperties) {
    //VIDEO variables
    var controller = this;
    var URL = window.URL || window.webkitURL;
    $scope.API = null;
    $scope.sliderSet = false;
    controller.onPlayerReady = function(API) {
        $scope.API = API;
    };

    //TODO Setting slider can be improved but API is returning 0 outside this function call
    $scope.setSliderValue = function() {
        if ($scope.API) {
            $scope.videoSlider.options.floor = -Math.ceil($scope.API.totalTime / 1000);
            $scope.videoSlider.options.ceil = Math.round($scope.API.totalTime / 1000);
        }

    }

    $scope.videoConfig = {
        preload: "none",

        sources: [
            // { src: $sce.trustAsResourceUrl("../assets/jump.mp4"), type: "video/mp4" }
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
        var currentXValue = 0;
        if (!$scope.sliderSet && $scope.API.totalTime!==0 ) {
            $scope.setSliderValue();
            $scope.sliderSet = true;
        }
        if(sharedGraphDataProperties.getTimeSyncVariable()){
            currentXValue = sharedGraphDataProperties.getTimeSyncVariable();
            console.log('Current Value :'+currentXValue);
            console.log('Current Value/4 :'+currentXValue/4);
            console.log('Current Value + Video Slider :'+($scope.videoSlider.value + currentXValue));
        }
        $scope.API.seekTime($scope.videoSlider.value + (currentXValue/4), false);

    }

    $scope.videoSlider = {
        value: 0,
        options: {
            floor: -450,
            ceil: 450,
            step: 0.1,
            precision: 1,
            onChange: $scope.videoSliderChanged,
            translate: function(value) {
                  return value +' s';
            }
        }
    };

    $scope.uploadFile = function(event) {
        var file = event.target.files[0];
        var fileURL = URL.createObjectURL(file);
        $scope.videoConfig.sources = [{src: $sce.trustAsResourceUrl(fileURL), type: 'video/mp4'}]
    };

    $scope.$on('doneWithAllDataSave', function(event, args) {
        //Time Value * conversion
        $scope.API.seekTime(((args[0] * args[1])) + $scope.videoSlider.value, false);
    });

    // $scope.$on('graphLeftPointClicked', function(event, args) {
    //     //(Time Value * conversion) / skipRate
    //     console.log(((args[0] * args[1])/args[2]));
    //     $scope.API.seekTime(((args[0] * args[1])/args[2]) + $scope.videoSlider.value, false);
    // });

    // $scope.$on('graphRightPointClicked', function(event, args) {
    //     //(Time Value * conversion) / skipRate
    //     $scope.API.seekTime(((args[0] * args[1])/args[2]) + $scope.videoSlider.value, false);
    // });

}]);
