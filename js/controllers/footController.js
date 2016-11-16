skiApp.controller('footController', ['$scope', 'colorRangeService', function($scope, colorRangeService) {
    $scope.sensorSize = 0;
    $scope.s0ReferenceX = 83.5;
    $scope.s0ReferenceY = 100;
    $scope.MaxValueSet = false;

    $scope.footChartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'bubble',
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
                            }
                        }
                    },
                    // Disable turning off individuals bubbles
                    events: {
                        legendItemClick: function(event) {
                            return false;
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
