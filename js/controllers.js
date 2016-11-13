// CONTROLLERS
skiApp.controller('homeController', ['$scope', '$sce', function($scope) {

    //Details
    $scope.name = "John Doe";
    $scope.date = "1/2/2003";
    $scope.time = "01.02.03";
    $scope.runNo = "1";



}]);


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
        console.log("here");
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


skiApp.controller('graphController', ['$rootScope', '$scope', '$timeout', 'sharedGraphDataProperties','csvService', function($rootScope, $scope, $timeout, sharedGraphDataProperties,csvService) {
    //CSV imports
    $scope.csv = {
        content: null,
        header: false,
        headerVisible: true,
        separator: ',',
        separatorVisible: false,
        result: null,
        encoding: 'ISO-8859-1',
        encodingVisible: false,
        uploadButtonLabel: "upload a csv file"
    };

    $scope.toggleLoading = function() {
        this.chartConfig.loading = !this.chartConfig.loading
    }



    //CHART VARIABLES
    $scope.minY = 0;
    $scope.maxYRedLine = 2000;
    $scope.maxXEntireGraph = 20000;
    $scope.MaxValueSet = false;
    $scope.chartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'line',
                zoomType: 'x'

            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: ' units'

            },
            plotOptions: {
                series: {
                    cursor: 'pointer',

                    point: {
                        events: {
                            click: function(event) {
                                //alert('Category: '+ this.category +', value: '+ this.y);
                                //local variable for current
                                var currentClickedX = this.x;
                                $scope.timeSyncVariable = this.category;
                                sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);
                                // console.log($scope.chartConfig.series[7].data[currentClickedX]);
                                //ARGS value * conversion 
                                $scope.sensorValues = {
                                        "s0": $scope.chartConfig.series[0].data[currentClickedX],
                                        "s1": $scope.chartConfig.series[1].data[currentClickedX],
                                        "s2": $scope.chartConfig.series[2].data[currentClickedX],
                                        "s3": $scope.chartConfig.series[3].data[currentClickedX],
                                        "s4": $scope.chartConfig.series[4].data[currentClickedX],
                                        "s5": $scope.chartConfig.series[5].data[currentClickedX],
                                        "s6": $scope.chartConfig.series[6].data[currentClickedX],
                                        "s7": $scope.chartConfig.series[7].data[currentClickedX],
                                        "yMax": $scope.yMax
                                    }
                                    //Set the red line to clicked value
                                $scope.chartObj.series[8].setData([
                                    [currentClickedX, $scope.minY],
                                    [currentClickedX, $scope.maxYRedLine]
                                ]);
                                $rootScope.$broadcast('graphPointMoved', [$scope.timeSyncVariable, 0.001, $scope.sensorValues]);
                            }
                        }
                    }

                }
            }
        },

        //Series object (optional) - a list of series using normal Highcharts series options.
        series: [{
                name: 's0',
                data: []

            }, {
                name: 's1',
                data: []
            }, {
                name: 's2',
                data: []
            }, {
                name: 's3',
                data: []
            }, {
                name: 's4',
                data: []
            }, {
                name: 's5',
                data: []
            }, {
                name: 's6',
                data: []
            }, {
                name: 's7',
                data: []
            }, {
                //Animation line
                name: 'Current',
                data: [
                    [0, $scope.minY],
                    [0, $scope.maxYRedLine]
                ]
            }



        ],

        //Title configuration (optional)
        title: {
            text: false
        },
        //Boolean to control showing loading status on chart (optional)
        //Could be a string if you want to show specific loading text.
        loading: false,
        //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
        //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
        xAxis: {
            categories: [],
            title: { text: 'Time (ms)' }
        },
        yAxis: {
            title: { text: 'Force (N)' }
        },

        //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
        useHighStocks: false,
        //size (optional) if left out the chart will default to size of the div or something sensible.
        size: {
            //width: 400,
            //height: 300
        },

        //function (optional)
        func: function(chart) {
            //setup some logic for the chart
            //get a local reference for chart
            $scope.chartObj = chart;
        }
    };



    //TODO make this watch a service
    $scope.$watch('csv.content', function() {
        $scope.MaxValueSet = false;
        csvService.csvHander($scope.csv.content,$scope.chartConfig);

    }); //End watch

    //Animated line thing
    $scope.moveLine = function() {

        //TODO Change static value to get dynamic max X value
        //console.log($scope.chartObj.series[8].data[0].x);
        if ($scope.chartObj.series[0].data[0] > $scope.maxXEntireGraph) {
            x = 0;
        } else {
            x = $scope.chartObj.series[8].data[0].x + 1;
            $scope.timeSyncVariable = x;

            sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);

            //ARGS value * conversion, Object that contains values
            if (!$scope.MaxValueSet) {
                //Set all max values for graph points
                $scope.maxYRedLine = $scope.yMax = $scope.chartObj.yAxis[0].dataMax;
                $scope.maxXEntireGraph = $scope.chartObj.xAxis[0].categories[$scope.chartObj.xAxis[0].max];
                $scope.MaxValueSet = true;
                //set Max value for vertical red line
            }
            $scope.sensorValues = {
                "s0": $scope.chartConfig.series[0].data[x],
                "s1": $scope.chartConfig.series[1].data[x],
                "s2": $scope.chartConfig.series[2].data[x],
                "s3": $scope.chartConfig.series[3].data[x],
                "s4": $scope.chartConfig.series[4].data[x],
                "s5": $scope.chartConfig.series[5].data[x],
                "s6": $scope.chartConfig.series[6].data[x],
                "s7": $scope.chartConfig.series[7].data[x],
                "yMax": $scope.yMax
            }

            $rootScope.$broadcast('graphPointMoved', [$scope.timeSyncVariable, 1, $scope.sensorValues]);
            // console.log($scope.timeSyncVariable);
        }
        $scope.chartObj.series[8].setData([
            [x, $scope.minY],
            [x, $scope.maxYRedLine]
        ]);
        $scope.timeOutId = $timeout($scope.moveLine, 1000);
    }

    $scope.stopLine = function() {
        $timeout.cancel($scope.timeOutId);
    }
    $scope.resetLine = function() {
        $scope.stopLine();
        $scope.sensorValues = {
            "s0": 0,
            "s1": 0,
            "s2": 0,
            "s3": 0,
            "s4": 0,
            "s5": 0,
            "s6": 0,
            "s7": 0,
            "yMax": $scope.yMax
        }
        $rootScope.$broadcast('graphPointMoved', [0, 1, $scope.sensorValues]);
        $scope.chartObj.series[8].setData([
            [0, $scope.minY],
            [0, $scope.maxYRedLine]
        ]);
    }

}]);


skiApp.controller('footController', ['$scope', 'colorRangeService', function($scope,colorRangeService) {
    $scope.sensorSize = 0;
    $scope.s0ReferenceX = 100;
    $scope.s0ReferenceY = 100;
    $scope.MaxValueSet = false;

    $scope.footChartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'bubble',
                zoomType: 'xy',
                plotBorderWidth: 1,
                backgroundColor: 'rgba(0,0,0,0)'


            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: ' units'

            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                    },
                    point: {
                        events: {
                            click: function(event) {
                                //Do we need to do anything with a click
                                // $scope.timeSyncVariable = this.category;
                                // sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);
                                // $rootScope.$broadcast('graphPointClicked', [$scope.timeSyncVariable, 0.001]);
                            }
                        }
                    }

                }
            }
        },

        //Series object (optional) - a list of series using normal Highcharts series options.

        series: [{
            name: 's0',
            data: [{
                x: $scope.s0ReferenceX,
                y: $scope.s0ReferenceY,
                z: $scope.sensorSize
            }],
            color: "transparent"

        }, {
            name: 's1',
            data: [{
                x: $scope.s0ReferenceX + 12,
                y: $scope.s0ReferenceY - 25,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's2',
            data: [{
                x: $scope.s0ReferenceX + 1,
                y: $scope.s0ReferenceY - 150,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's3',
            data: [{
                x: $scope.s0ReferenceX + 12,
                y: $scope.s0ReferenceY - 180,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's4',
            data: [{
                x: $scope.s0ReferenceX + 2.5,
                y: $scope.s0ReferenceY - 275,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's5',
            data: [{
                x: $scope.s0ReferenceX + 12,
                y: $scope.s0ReferenceY - 330,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's6',
            data: [{
                x: $scope.s0ReferenceX + 6,
                y: $scope.s0ReferenceY - 500,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's7',
            data: [{
                x: $scope.s0ReferenceX + 6,
                y: $scope.s0ReferenceY - 670,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }],
        //Title configuration (optional)
        title: {
            text: false
        },
        //Boolean to control showing loading status on chart (optional)
        //Could be a string if you want to show specific loading text.
        loading: false,
        //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
        //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
        xAxis: {
            categories: [],
            title: { text: 'Time (s)' },

            labels: {
                //TURN THIS OFF WHEN NOT DEBUGGING
                enabled: false
            },
            min: 0,
            max: 140,
            tickInterval: 1,

        },
        yAxis: {
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            title: { text: 'Force (N)' },
            labels: {
                //TURN THIS OFF WHEN NOT DEBUGGING
                enabled: false
            },
            min: -670,
            // max: 600,
            tickInterval: 1
        },

        //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
        useHighStocks: false,
        //size (optional) if left out the chart will default to size of the div or something sensible.
        size: {
            // width: 100%,
            height: 450
        },

        //function (optional)
        func: function(chart) {
            //setup some logic for the chart
            //get a local reference for chart

            $scope.footChartObj = chart;
        }
    }


    $scope.$on('graphPointMoved', function(event, args) {
        //$scope.footChartConfig.series[0].data[0].z = 2000;
        //sconsole.log($scope.sensorSize);
        // $timeout(changeDate, 500);
        //  $scope.footchartObj.redraw();
        //$scope.sensorSize = Math.random() * (500 - 10) + 10;
        if (!$scope.MaxValueSet) {
            $scope.yMax = args[2].yMax;
            $scope.MaxValueSet = true;
        }
        for (i = 0; i < 8; i++) {
            //keeps these cariables local
            var sValue = 's' + i;
            var currentValue = args[2][sValue];
            var colorRange = Math.round((currentValue / $scope.yMax) * 100);
            $scope.footChartConfig.series[i].data[0].z = currentValue;
            $scope.footChartConfig.series[i].color = colorRangeService.convertValueToRgb(colorRange);

        }

    });

}]);





skiApp.controller('aboutController', ['$scope', function($scope) {



}]);
