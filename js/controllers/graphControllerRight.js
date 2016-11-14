
skiApp.controller('graphControllerRight', ['$rootScope', '$scope', '$timeout', 'sharedGraphDataProperties','csvService', function($rootScope, $scope, $timeout, sharedGraphDataProperties,csvService) {
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
                                $rootScope.$broadcast('graphPointMoved', [$scope.timeSyncVariable/800, 1, $scope.sensorValues]);
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

        $scope.skipRate = 400;
        $scope.xValueAtNextPoint = $scope.chartObj.series[8].data[0].x + $scope.skipRate;
        //Check if value at that X point exits in graph
        if (!$scope.chartObj.xAxis[0].categories[$scope.xValueAtNextPoint]) {
            x = 0;
        } else {
            x = $scope.xValueAtNextPoint;
            $scope.timeSyncVariable = x/$scope.skipRate;

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

