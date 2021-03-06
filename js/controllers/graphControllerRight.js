skiApp.controller('graphControllerRight',['$rootScope', '$scope', '$timeout', 'sharedGraphDataProperties', 'csvService', 'chartConfigBuilder','papaParse', function($rootScope, $scope, $timeout, sharedGraphDataProperties, csvService, chartConfigBuilder, papaParse) {
    $scope.skipRate = 4;
    //CSV imports
   var csvConfig = {
              delimiter: "",  // auto-detect
              newline: "",    // auto-detect
              header: false,
              dynamicTyping: false,
              preview: 0,
              encoding: "",
              worker: false,
              comments: false,
              step: undefined,
              complete: processCsv,
              error: undefined,
              download: false,
              skipEmptyLines: true,
              chunk: undefined,
              fastMode: true,
              beforeFirstChunk: undefined,
              withCredentials: undefined
      };
    $scope.toggleLoading = function() {
        this.chartConfig.loading = !this.chartConfig.loading
    }


    //CHART VARIABLES
    $scope.minY = 0;
    $scope.maxYRedLine = 0;
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
                valueSuffix: ' units',
                enabled: false

            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    turboThreshold: 0,
                    point: {
                        events: {
                            click: function(event) {
                                //local variable for current
                                var currentClickedX = $scope.timeSyncVariable = this.x;
                                sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);
                                //ARGS value * conversion 
                                if (!$scope.MaxValueSet) {
                                    //Set all max values for graph points
                                    $scope.maxYRedLine = $scope.yMax = $scope.chartObj.yAxis[0].dataMax;
                                    $scope.MaxValueSet = true;
                                }

                                //ARGS value * conversion 
                                $scope.sensorValues = {
                                        "s0R": $scope.chartConfig.series[0].data[currentClickedX],
                                        "s1R": $scope.chartConfig.series[1].data[currentClickedX],
                                        "s2R": $scope.chartConfig.series[2].data[currentClickedX],
                                        "s3R": $scope.chartConfig.series[3].data[currentClickedX],
                                        "s4R": $scope.chartConfig.series[4].data[currentClickedX],
                                        "s5R": $scope.chartConfig.series[5].data[currentClickedX],
                                        "s6R": $scope.chartConfig.series[6].data[currentClickedX],
                                        "s7R": $scope.chartConfig.series[7].data[currentClickedX],
                                        "yMaxR": $scope.yMax
                                    }
                                    //Set the red line to clicked value
                                $scope.chartObj.series[8].setData([
                                    [currentClickedX, $scope.minY],
                                    [currentClickedX, $scope.maxYRedLine]
                                ]);
                                $rootScope.$broadcast('graphRightPointClicked', [$scope.timeSyncVariable, 1,$scope.skipRate, $scope.sensorValues]);

                            }
                        }
                    }

                }
            }
        },

        //Series object (optional) - a list of series using normal Highcharts series options.
        series: [ {
                name: 's1R',
                data: [],
                color: '#7cb5ec',
                visible: false
            }, {
                name: 's2R',
                data: [],
                color: '#434348',
                visible: false
            }, {
                name: 's3R',
                data: [],
                color: '#90ed7d',
                visible: false
            }, {
                name: 's4R',
                data: [],
                color: '#f7a35c',
                visible: false
            }, {
                name: 's5R',
                data: [],
                color: '#8089e5',
                visible: false
            }, {
                name: 's6R',
                data: [],
                color: '#f15c80',
                visible: false
            }, {
                name: 's7R',
                data: [],
                color: '#e4d354',
                visible: false
            }, {
                name: 's8R',
                data: [],
                color: '#2b908f',
                visible: false

            }, {
                //Animation line
                name: 'Current',
                data: [
                    [0, $scope.minY],
                    [0, $scope.maxYRedLine]
                ],
                color: '#ff0000',
            }, {
                name: 'avg',
                data: [],
                color: '#da35ff',
                visible: true
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
            title: { text: 'Force (Lbs)' }
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


    $scope.uploadRightCsvFile = function(event) {
        var file = event.target.files[0];
        $scope.toggleLoading();
        papaParse.parse(file, csvConfig);

    };

    function processCsv(results, file){
        var csvServicePromise = csvService.csvHandler(results.data, $scope.chartConfig);
            csvServicePromise.then(function() {
                $scope.toggleLoading();
            });
    }
    
    //Animated line thing
    $scope.$on('graphPointMoved', function(event, args) {
        $scope.moveLineRight();
    });
    // $scope.$on('graphPointStop', function(event, args) {
    //     $scope.stopLineRight();
    // }); 
    $scope.$on('graphPointReset', function(event, args) {
        $scope.resetLineRight();

    });
    $scope.moveLineRight = function() {

        
        $scope.xValueAtNextPoint = $scope.chartObj.series[8].data[0].x + $scope.skipRate;
        //Check if value at that X point exits in graph
        if (!$scope.chartObj.xAxis[0].categories[$scope.xValueAtNextPoint]) {
            x = 0;
        } else {
            x = $scope.xValueAtNextPoint;
            $scope.timeSyncVariable = x / $scope.skipRate;

            sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);

            //ARGS value * conversion, Object that contains values
            if (!$scope.MaxValueSet) {
                //Set all max values for graph points
                $scope.maxYRedLine = $scope.yMax = $scope.chartObj.yAxis[0].dataMax;
                //Not using max graph value any more, instead checking for undefined variable in if
                // $scope.maxXEntireGraph = $scope.chartObj.xAxis[0].categories[$scope.chartObj.xAxis[0].max];
                //set Max value for vertical red line
                $scope.MaxValueSet = true;
            }
            $scope.sensorValues = {
                "s0R": $scope.chartConfig.series[0].data[x],
                "s1R": $scope.chartConfig.series[1].data[x],
                "s2R": $scope.chartConfig.series[2].data[x],
                "s3R": $scope.chartConfig.series[3].data[x],
                "s4R": $scope.chartConfig.series[4].data[x],
                "s5R": $scope.chartConfig.series[5].data[x],
                "s6R": $scope.chartConfig.series[6].data[x],
                "s7R": $scope.chartConfig.series[7].data[x],
                "yMaxR": $scope.yMax,
                "avg": ("s0R" + "s1R" + "s2R" + "s3R" + "s4R" + "s5R" + "s6R" + "s7R") / 8
            }

           //Get the left sensor values, append right values and save it back to shared properties for foot controller  
           //sharedGraphDataProperties.setSensorValues(angular.extend($scope.sensorValues,sharedGraphDataProperties.getSensorValues()));
            $scope.extendedSensorValues = angular.extend($scope.sensorValues,sharedGraphDataProperties.getSensorValues());
            sharedGraphDataProperties.setSensorValues($scope.extendedSensorValues);
            $rootScope.$broadcast('doneWithAllDataSave', [$scope.timeSyncVariable, 1, $scope.sensorValues]);
        }
        $scope.chartObj.series[8].setData([
            [x, $scope.minY],
            [x, $scope.maxYRedLine]
        ]);
    }

    $scope.stopLineRight = function() {
        // $timeout.cancel($scope.timeOutId);
    }
    $scope.resetLineRight = function() {
        $scope.stopLineRight();
        $scope.sensorValues = {
            "s0L": 0,
            "s1L": 0,
            "s2L": 0,
            "s3L": 0,
            "s4L": 0,
            "s5L": 0,
            "s6L": 0,
            "s7L": 0,
            "s0R": 0,
            "s1R": 0,
            "s2R": 0,
            "s3R": 0,
            "s4R": 0,
            "s5R": 0,
            "s6R": 0,
            "s7R": 0,
            "yMax": $scope.yMax,
            "avg": 0
        }
        $scope.chartObj.series[8].setData([
            [0, $scope.minY],
            [0, $scope.maxYRedLine]
        ]);
         $rootScope.$broadcast('doneWithAllDataSave', [0, 1, $scope.sensorValues]);
    }


    $scope.$on('graphLeftPointClicked', function(event, args) {
        // $scope.API.seekTime(((args[0] * args[1])/args[2]) + $scope.videoSlider.value, false);
        if (!$scope.MaxValueSet) {
            //Set all max values for graph points
            $scope.maxYRedLine = $scope.yMax = $scope.chartObj.yAxis[0].dataMax;
            $scope.MaxValueSet = true;
        }
        var xValue = args[0];
        var sensorValues = args[3];
        var yMax = args[3].yMax;
        $scope.timeSyncVariable = ((xValue * args[1])/args[2]);
        $scope.chartObj.series[8].data[0].x = xValue;
        $scope.sensorValues = {
            "s0R": $scope.chartConfig.series[0].data[xValue],
            "s1R": $scope.chartConfig.series[1].data[xValue],
            "s2R": $scope.chartConfig.series[2].data[xValue],
            "s3R": $scope.chartConfig.series[3].data[xValue],
            "s4R": $scope.chartConfig.series[4].data[xValue],
            "s5R": $scope.chartConfig.series[5].data[xValue],
            "s6R": $scope.chartConfig.series[6].data[xValue],
            "s7R": $scope.chartConfig.series[7].data[xValue],
            "yMaxR": $scope.yMax,
            "avg": ("s0R" + "s1R" + "s2R" + "s3R" + "s4R" + "s5R" + "s6R" + "s7R") / 8
        }

        $scope.chartObj.series[8].setData([
            [xValue, 0],
            [xValue, $scope.yMax]
        ]);
        //(Time Value * conversion) / skipRate

        $scope.extendedSensorValues = angular.extend(sensorValues,$scope.sensorValues);
        sharedGraphDataProperties.setSensorValues($scope.extendedSensorValues);
        $rootScope.$broadcast('doneWithAllDataSave', [$scope.timeSyncVariable, 1, $scope.extendedSensorValues]);
        
    });

}]);
