skiApp.controller('graphControllerLeft', ['$rootScope', '$scope', '$timeout', 'sharedGraphDataProperties', 'csvService', 'chartConfigBuilder','papaParse', function($rootScope, $scope, $timeout, sharedGraphDataProperties, csvService, chartConfigBuilder, papaParse) {
    //CSV imports
    $scope.skipRate = 4;
  
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
        $scope.chartConfig.loading = !$scope.chartConfig.loading
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
                valueSuffix: ' units'

            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    turboThreshold: 0,
                    point: {
                        events: {
                            click: function(event) {
                                //alert('Category: '+ this.category +', value: '+ this.y);
                                //local variable for current
                                var currentClickedX = $scope.timeSyncVariable = this.x;
                                sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);

                                //ARGS value * conversion 
                                if (!$scope.MaxValueSet) {
                                    //Set all max values for graph points
                                    $scope.maxYRedLine = $scope.yMax = $scope.chartObj.yAxis[0].dataMax;
                                    $scope.MaxValueSet = true;
                                }
                                $scope.sensorValues = {
                                        "s0L": $scope.chartConfig.series[0].data[currentClickedX],
                                        "s1L": $scope.chartConfig.series[1].data[currentClickedX],
                                        "s2L": $scope.chartConfig.series[2].data[currentClickedX],
                                        "s3L": $scope.chartConfig.series[3].data[currentClickedX],
                                        "s4L": $scope.chartConfig.series[4].data[currentClickedX],
                                        "s5L": $scope.chartConfig.series[5].data[currentClickedX],
                                        "s6L": $scope.chartConfig.series[6].data[currentClickedX],
                                        "s7L": $scope.chartConfig.series[7].data[currentClickedX],
                                        "yMax": $scope.yMax
                                    }
                                    //Set the red line to clicked value
                                $scope.chartObj.series[8].setData([
                                    [currentClickedX, $scope.minY],
                                    [currentClickedX, $scope.maxYRedLine]
                                ]);
                                //Divide by skip rate because we have actual values in timeSyncVariable
                                $rootScope.$broadcast('graphLeftPointClicked', [$scope.timeSyncVariable, 1, $scope.skipRate, $scope.sensorValues]);

                                // $rootScope.$broadcast('graphPointMoved', [$scope.timeSyncVariable, 1, $scope.sensorValues]);
                            }
                        }
                    }

                }
            }
        },

        //Series object (optional) - a list of series using normal Highcharts series options.
        series: [{
                name: 's1L',
                data: [],
                visible: true
            }, {
                name: 's2L',
                data: [],
                visible: true
            }, {
                name: 's3L',
                data: [],
                visible: true
            }, {
                name: 's4L',
                data: [],
                visible: true
            }, {
                name: 's5L',
                data: [],
                visible: true
            }, {
                name: 's6L',
                data: [],
                visible: true
            }, {
                name: 's7L',
                data: [],
                visible: true
            }, {
                name: 's8L',
                data: [],
                visible: true

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


    // console.log(chartConfigBuilder.getChartConfig());

    $scope.uploadLeftCsvFile = function(event) {
        var file = event.target.files[0];
        // $scope.toggleLoading();
        papaParse.parse(file, csvConfig);

    };

    function processCsv(results, file){
        $scope.toggleLoading();
        var csvServicePromise = csvService.csvHandler(results.data, $scope.chartConfig);
            csvServicePromise.then(function() {
                $scope.toggleLoading();
            });
        $rootScope.$broadcast('leftCsvUploaded', [results]); 
    }
    
  
    //Animated line thing
    $scope.moveLineLeft = function() {
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
                "s0L": $scope.chartConfig.series[0].data[x],
                "s1L": $scope.chartConfig.series[1].data[x],
                "s2L": $scope.chartConfig.series[2].data[x],
                "s3L": $scope.chartConfig.series[3].data[x],
                "s4L": $scope.chartConfig.series[4].data[x],
                "s5L": $scope.chartConfig.series[5].data[x],
                "s6L": $scope.chartConfig.series[6].data[x],
                "s7L": $scope.chartConfig.series[7].data[x],
                "yMax": $scope.yMax
            }
            sharedGraphDataProperties.setSensorValues($scope.sensorValues);
            $rootScope.$broadcast('graphPointMoved', [$scope.timeSyncVariable, 1, $scope.sensorValues]);
        }
        $scope.chartObj.series[8].setData([
            [x, $scope.minY],
            [x, $scope.maxYRedLine]
        ]);
        $scope.timeOutId = $timeout($scope.moveLineLeft, 1000);
    }

    $scope.stopLineLeft = function() {
        $timeout.cancel($scope.timeOutId);
        $rootScope.$broadcast('graphPointStop', [0, 1, $scope.sensorValues]);
    }
    $scope.resetLineLeft = function() {
        $scope.stopLineLeft();
        $scope.sensorValues = {
            "s0L": 0,
            "s1L": 0,
            "s2L": 0,
            "s3L": 0,
            "s4L": 0,
            "s5L": 0,
            "s6L": 0,
            "s7L": 0,
            "yMax": $scope.yMax
        }
        $rootScope.$broadcast('graphPointReset', [$scope.timeSyncVariable, 1, $scope.sensorValues]);
        $scope.chartObj.series[8].setData([
            [0, $scope.minY],
            [0, $scope.maxYRedLine]
        ]);
    }

    $scope.$on('graphRightPointClicked', function(event, args) {
        if (!$scope.MaxValueSet) {
            //Set all max values for graph points
            $scope.maxYRedLine = $scope.yMax = $scope.chartObj.yAxis[0].dataMax;
            $scope.MaxValueSet = true;
        }
        var xValue = args[0];
        var sensorValues = args[3];
        var yMax = args[3].yMax;
        var sensorValues = args[3];
        var yMax = args[3].yMax;
        $scope.timeSyncVariable = ((xValue * args[1]) / args[2]);
        $scope.chartObj.series[8].data[0].x = xValue;
        $scope.sensorValues = {
            "s0L": $scope.chartConfig.series[0].data[xValue],
            "s1L": $scope.chartConfig.series[1].data[xValue],
            "s2L": $scope.chartConfig.series[2].data[xValue],
            "s3L": $scope.chartConfig.series[3].data[xValue],
            "s4L": $scope.chartConfig.series[4].data[xValue],
            "s5L": $scope.chartConfig.series[5].data[xValue],
            "s6L": $scope.chartConfig.series[6].data[xValue],
            "s7L": $scope.chartConfig.series[7].data[xValue],
            "yMax": $scope.yMax
        }

        $scope.chartObj.series[8].setData([
            [xValue, 0],
            [xValue, $scope.yMax]
        ]);
        //(Time Value * conversion) / skipRate

        $scope.extendedSensorValues = angular.extend(sensorValues, $scope.sensorValues);
        sharedGraphDataProperties.setSensorValues($scope.extendedSensorValues);
        $rootScope.$broadcast('doneWithAllDataSave', [$scope.timeSyncVariable, 1, $scope.extendedSensorValues]);



    });

}]);
