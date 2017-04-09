skiApp.controller('footController', ['$scope', 'colorRangeService', 'sharedGraphDataProperties', function($scope, colorRangeService, sharedGraphDataProperties) {
    $scope.sensorSize = 0;
    $scope.s0LReferenceX = 50;
    $scope.s0LReferenceY = 100;

    $scope.s0RReferenceX = 83.5;
    $scope.s0RReferenceY = 100;
    $scope.MaxValueSet = false;

    var sValueL, sValueR, currentValueL, currentValueR, colorRange, colorMultiplier;

    $scope.footChartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                backgroundColor: 'rgba(0,0,0,0)'
            },
            legend: {
                width: 510,
                align: 'center',
                itemWidth: 60
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
            name: 's1L',
            data: [{
                x: $scope.s0LReferenceX,
                y: $scope.s0LReferenceY,
                z: $scope.sensorSize
            }],
            color: "transparent"

        }, {
            name: 's2L',
            data: [{
                x: $scope.s0LReferenceX - 12,
                y: $scope.s0LReferenceY - 25,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's3L',
            data: [{
                x: $scope.s0LReferenceX - 1,
                y: $scope.s0LReferenceY - 150,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's4L',
            data: [{
                x: $scope.s0LReferenceX - 12,
                y: $scope.s0LReferenceY - 180,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's5L',
            data: [{
                x: $scope.s0LReferenceX - 2.5,
                y: $scope.s0LReferenceY - 275,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's6L',
            data: [{
                x: $scope.s0LReferenceX - 12,
                y: $scope.s0LReferenceY - 330,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's7L',
            data: [{
                x: $scope.s0LReferenceX - 6,
                y: $scope.s0LReferenceY - 500,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's8L',
            data: [{
                x: $scope.s0LReferenceX - 6,
                y: $scope.s0LReferenceY - 670,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's1R',
            data: [{
                x: $scope.s0RReferenceX,
                y: $scope.s0RReferenceY,
                z: $scope.sensorSize
            }],
            color: "transparent"

        }, {
            name: 's2R',
            data: [{
                x: $scope.s0RReferenceX + 12,
                y: $scope.s0RReferenceY - 25,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's3R',
            data: [{
                x: $scope.s0RReferenceX + 1,
                y: $scope.s0RReferenceY - 150,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's4R',
            data: [{
                x: $scope.s0RReferenceX + 12,
                y: $scope.s0RReferenceY - 180,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's5R',
            data: [{
                x: $scope.s0RReferenceX + 2.5,
                y: $scope.s0RReferenceY - 275,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's6R',
            data: [{
                x: $scope.s0RReferenceX + 12,
                y: $scope.s0RReferenceY - 330,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's7R',
            data: [{
                x: $scope.s0RReferenceX + 6,
                y: $scope.s0RReferenceY - 500,
                z: $scope.sensorSize
            }],
            color: "transparent"
        }, {
            name: 's8R',
            data: [{
                x: $scope.s0RReferenceX + 6,
                y: $scope.s0RReferenceY - 670,
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
            title: { text: 'Force (Lbs)' },
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


    $scope.$on('doneWithAllDataSave', function(event, args) {
        if (!$scope.MaxValueSet) {
            $scope.yMax = args[2].yMax;
            $scope.MaxValueSet = true;
        }
        colorMultiplier = 100 / $scope.yMax;
        for (i = 0; i < 8; i++) {
            //keeps these variables local
            sValueL = 's' + i + 'L';
            sValueR = 's' + i + 'R';
            currentValueL = args[2][sValueL];
            currentValueR = args[2][sValueR];

            $scope.footChartConfig.series[i].data[0].z = currentValueL;
            $scope.footChartConfig.series[i].color = colorRangeService.convertValueToRgb(Math.round(currentValueL * colorMultiplier));

            $scope.footChartConfig.series[i + 8].data[0].z = currentValueR;
            $scope.footChartConfig.series[i + 8].color = colorRangeService.convertValueToRgb(Math.round(currentValueR * colorMultiplier));

        }

    });


}]);
