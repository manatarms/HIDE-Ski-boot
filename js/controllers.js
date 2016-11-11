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
            { src: $sce.trustAsResourceUrl("../assets/jump.mp4"), type: "video/mp4" },
            { src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm" },
            { src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg" }
        ],
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        plugins: {
            controls: {
                autoHide: true,
                autoHideTime: 5000
            }
        }
    };

    $scope.$on('graphPointClicked', function(event, args) {
        //$scope.API.seekTime(args * 0.001, false);
        //Value * conversion
        $scope.API.seekTime(args[0] * args[1], false);
    });

}]);

skiApp.controller('footController', ['$scope', function($scope) {


}]);

skiApp.controller('graphController', ['$rootScope', '$scope', '$timeout', 'sharedGraphDataProperties', function($rootScope, $scope, $timeout, sharedGraphDataProperties) {
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
    $scope.maxY = 0;
    $scope.minY = 2000;
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
                                $scope.timeSyncVariable = this.category;
                                console.log(this);
                                sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);
                                $rootScope.$broadcast('graphPointClicked', [$scope.timeSyncVariable, 0.001]);
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
                data: [
                    [0, $scope.minY],
                    [0, $scope.maxY]
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
            title: { text: 'Time (s)' }
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

        loading: false,

        //function (optional)
        func: function(chart) {
            //setup some logic for the chart
            //get a local reference for chart
            $scope.chartObj = chart;
        }
    };


    //TODO make this watch a service
    $scope.$watch('csv.content', function() {
        //console.log(JSON.stringify($scope.csv.result[0]));
        //console.log($scope.chartConfig.series[0].data);
        //$scope.chartConfig.series[0].data = $scope.csv.result;
        // console.log($scope.csv.content);

        if ($scope.csv.content !== null) {
            $scope.toggleLoading();
            var lines = $scope.csv.content.split('\n');
            //Optimize with local variable and push entire series array
            var series = [

            ];

            $.each(lines, function(lineNo, line) {
                var items = line.split(',');
                // console.log(items);
                // header line containes categories

                // console.log(JSON.stringify($scope.chartConfig.series));
                if (lineNo == 0) {
                    $.each(items, function(itemNo, item) {
                        if (itemNo > 0) {
                            //Incase we use titles
                            //$scope.chartConfig.xAxis.categories.push(item);
                        }
                    });
                } else {

                    $.each(items, function(itemNo, item) {
                        switch (itemNo) {
                            case 0:
                                $scope.chartConfig.xAxis.categories.push(parseFloat(item));
                                break;
                            case 1:
                                //series[0].data.push(parseFloat(item));
                                $scope.chartConfig.series[0].data.push(parseFloat(item));
                                // console.log($scope.chartConfig.series[0].data);
                                break;
                            case 2:
                                $scope.chartConfig.series[1].data.push(parseFloat(item));
                                break;
                            case 3:
                                $scope.chartConfig.series[2].data.push(parseFloat(item));
                                break;
                            case 4:
                                $scope.chartConfig.series[3].data.push(parseFloat(item));
                                break;
                            case 5:
                                $scope.chartConfig.series[4].data.push(parseFloat(item));
                                break;
                            case 6:
                                $scope.chartConfig.series[5].data.push(parseFloat(item));
                                break;
                            case 7:
                                $scope.chartConfig.series[6].data.push(parseFloat(item));
                                break;

                            default:

                        }
                    });
                    //Test setting seek
                    //$scope.$API.seekTime(22);    

                    // TODO Push a giant array and optimize later
                    //$scope.chartConfig.series[0].data.push(series);
                    $scope.toggleLoading();
                }

                //Animated line thing

                $scope.moveLine = function() {

                    //TODO Change static value to get dynamic max X value
                    //console.log($scope.chartObj.series[8].data[0].x);
                    if ($scope.chartObj.series[0].data[0] == 18985) {
                        x = 0;
                    } else {
                        x = $scope.chartObj.series[8].data[0].x + 1;
                        $scope.timeSyncVariable = x;

                        sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);
                        $rootScope.$broadcast('graphPointClicked', [$scope.timeSyncVariable, 1]);
                        // console.log($scope.timeSyncVariable);
                    }
                    $scope.chartObj.series[8].setData([
                        [x, $scope.minY],
                        [x, $scope.maxY]
                    ]);
                    $scope.timeOutId = $timeout($scope.moveLine, 1000);
                }


                $scope.stopLine = function() {
                    $timeout.cancel($scope.timeOutId);
                }

                $scope.resetLine = function() {
                        $scope.stopLine();
                        $scope.chartObj.series[8].setData([
                            [0, $scope.minY],
                            [0, $scope.maxY]
                        ]);
                    }
                    // the rest of the lines contain data with their name in the first 
                    // position
                    // else {
                    //     var series = {
                    //         data: []
                    //     };
                    //     $.each(items, function(itemNo, item) {
                    //         if (itemNo == 0) {
                    //             series.name = item;
                    //         } else {
                    //             series.data.push(parseFloat(item));
                    //         }
                    //     });

                //    chartConfig.series.push(series);

                // }

            });
        }
    });

}]); //End watch


skiApp.controller('footController', ['$scope','$timeout', function($scope,$timeout) {
    $scope.sensorSize = 100;
    $scope.s0ReferenceX = 100;
    $scope.s0ReferenceY = 100;


    $scope.footChartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'bubble',
                zoomType: 'xy',
                plotBorderWidth: 1
               

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
                                //alert('Category: '+ this.category +', value: '+ this.y);
                                $scope.timeSyncVariable = this.category;
                                sharedGraphDataProperties.setTimeSyncVariable($scope.timeSyncVariable);
                                $rootScope.$broadcast('graphPointClicked', [$scope.timeSyncVariable, 0.001]);
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
            color: "red"

        }, {
            name: 's1',
            data: [{
                x: $scope.s0ReferenceX + 12,
                y: $scope.s0ReferenceY - 25,
                z: $scope.sensorSize
            }]
        }, {
            name: 's2',
            data: [{
                x: $scope.s0ReferenceX + 1,
                y: $scope.s0ReferenceY - 150,
                z: $scope.sensorSize
            }]
        }, {
            name: 's3',
            data: [{
                x: $scope.s0ReferenceX + 12,
                y: $scope.s0ReferenceY - 180,
                z: $scope.sensorSize
            }]
        }, {
            name: 's4',
            data: [{
                x: $scope.s0ReferenceX + 2.5,
                y: $scope.s0ReferenceY - 275,
                z: $scope.sensorSize
            }]
        }, {
            name: 's5',
            data: [{
                x: $scope.s0ReferenceX + 12,
                y: $scope.s0ReferenceY - 330,
                z: $scope.sensorSize
            }]
        }, {
            name: 's6',
            data: [{
                x: $scope.s0ReferenceX + 6,
                y: $scope.s0ReferenceY - 500,
                z: $scope.sensorSize
            }]
        }, {
            name: 's7',
            data: [{
                x: $scope.s0ReferenceX + 6,
                y: $scope.s0ReferenceY - 670,
                z: $scope.sensorSize
            }]
        }],
        // series: [{
        //             data: [
        //                 { x: 95, y: 95, z: 500, name: 's0', country: 'Belgium' },
        //                 { x: 86.5, y: 102.9, z: 14.7, name: 's1', country: 'Germany' },
        //                 { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
        //                 { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
        //                 { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
        //                 { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
        //                 { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
        //                 { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
        //                 { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
        //                 { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
        //                 { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
        //                 { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
        //                 { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
        //                 { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
        //                 { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
        //             ]
        //         }],
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
            //width: 400,
            //height: 300
        },

        loading: false,

        //function (optional)
        func: function(chart) {
            //setup some logic for the chart
            //get a local reference for chart
            $scope.footchartObj = chart;
        }
    };


 $scope.$on('graphPointClicked', function(event, args) {
        $scope.footChartConfig.series[0].data[0].z = 2000;
        console.log($scope.sensorSize);
       // $timeout(changeDate, 500);
      //  $scope.footchartObj.redraw();
        //$scope.sensorSize = Math.random() * (500 - 10) + 10;
    });
 //JUST A TEST FUNCTION
 // function changeDate (){
 //    $scope.footChartConfig.series[0].data[0].z = Math.random() * (500 - 10) + 10;
 //         $timeout(changeDate, 500);
 // }

}]);





skiApp.controller('aboutController', ['$scope', function($scope) {



}]);
