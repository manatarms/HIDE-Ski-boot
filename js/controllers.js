// CONTROLLERS
skiApp.controller('homeController', ['$scope', '$sce', function ($scope) {

    //Details
    $scope.name = "John Doe";
    $scope.date = "1/2/2003";
    $scope.time = "01.02.03";
    $scope.runNo = "1";

}]);

skiApp.controller('videoController', ['$scope', '$sce', function ($scope, $sce) {
    //VIDEO variables
    var controller = this;
    // controller.API = null;
    // alert(API);
    //TODO Fix videogular API calls
    controller.vgPlayerReady = function (API) {
        controller.API = API;
        alert(API);
    };
    $scope.setTime = function (time) {
        $scope.$API.seekTime(50, true);
    }

    $scope.videoConfig = {
        preload: "none",

        sources: [{
            src: $sce.trustAsResourceUrl("../assets/jump.mp4"),
            type: "video/mp4"
        }, {
            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
            type: "video/webm"
        }, {
            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
            type: "video/ogg"
        }],
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

}]);

skiApp.controller('footController', ['$scope', function ($scope) {


}]);

skiApp.controller('graphController', ['$scope', function ($scope) {
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

    $scope.toggleLoading = function () {
        this.chartConfig.loading = !this.chartConfig.loading
    }

    //CHART VARIABLES
    $scope.chartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'line',
                zoomType: 'x'

            },
            tooltip: {
                style: {
                    padding: 10,
                    fontWeight: 'bold'
                }
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (event) {
                                //console.log('Category: '+ this.category +', value: '+ this.y);
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
            title: {
                text: 'Time (s)'
            }
        },
        yAxis: {
            title: {
                text: 'Force (N)'
            }
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
        func: function (chart) {
            //setup some logic for the chart
        }
    };


    //TODO make this watch a service
    $scope.$watch('csv.content', function () {
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

            $.each(lines, function (lineNo, line) {
                var items = line.split(',');
                // console.log(items);
                // header line containes categories

                // console.log(JSON.stringify($scope.chartConfig.series));
                if (lineNo == 0) {
                    $.each(items, function (itemNo, item) {
                        if (itemNo > 0) {
                            //Incase we use titles
                            //$scope.chartConfig.xAxis.categories.push(item);
                        }
                    });
                } else {

                    $.each(items, function (itemNo, item) {
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

skiApp.controller('aboutController', ['$scope', function ($scope) {



}]);


////////////////////////// GOOD STUFF STARTS HERE /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


skiApp.controller('plotlyController', ['$scope', '$timeout', function ($scope, $timeout) {
    function makeplot() {
        Plotly.d3.csv("./assets/DAQtestDataSlow.csv", function (data) {
            processData(data)
        });

    };

    function processData(allRows) {

        //console.log(allRows);
        var S0 = [],
            S1 = [],
            S2 = [],
            S3 = [],
            S4 = [],
            S5 = [],
            S6 = [],
            time1 = [];

        for (var i = 0; i < allRows.length; i++) {
            row = allRows[i];
            // console.log(row['S0']);
            S0.push(row['S0']);
            S1.push(row['S1']);
            S2.push(row['S2']);
            S3.push(row['S3']);
            S4.push(row['S4']);
            S5.push(row['S5']);
            S6.push(row['S6']);
            time1.push(row['time']);
            //console.log(time1);
        }
        // console.log(time1);
        var trace1 = {
            type: 'scatter',
            x: time1,
            y: S0,
            mode: "lines",
            name: "S0"
        };
        var trace2 = {
            type: 'scatter',
            x: time1,
            y: S1,
            mode: "lines",
            name: 'S1'
        };
        var trace3 = {
            type: 'scatter',
            x: time1,
            y: S2,
            mode: "lines",
            name: 'S2'
        };
        var trace4 = {
            type: 'scatter',
            x: time1,
            y: S3,
            name: 'S3'
        };
        var trace5 = {
            type: 'scatter',
            x: time1,
            y: S4,
            name: 'S4'
        };
        var trace6 = {
            type: 'scatter',
            x: time1,
            y: S5,
            name: 'S5'
        };
        var ax = {
            zeroline: false,
            showline: false,
            showticklabels: false,
            showgrid: false
        };

        var data = [trace1, trace2, trace3, trace4, trace5, trace6];

        var layout = {
            title: 'Left Foot',
            height: 500,
            width: 1000,
            axis: ax,
            xaxis: ax
        };

        Plotly.newPlot('steven plot', data, layout);
        //Plotly.newPlot('steven plot2', data, layout);


        //////// Ok now make the foot graph plot for animating //////           
        var i = 0;
        var x = [0, 4, 2, 6, 2, 6, 2, 6, 10];
        var y = [0, 2, 4, 4, 6, 6, 8, 8, 10];
        var z = [0, parseFloat(S0[i]), parseFloat(S1[i]), parseFloat(S2[i]), parseFloat(S3[i]), parseFloat(S4[i]), parseFloat(S5[i]), parseFloat(S6[i]), 2500];
        var s = [0, parseFloat(S0[i]) / 500, parseFloat(S1[i]) / 500, parseFloat(S2[i]) / 500, parseFloat(S3[i]) / 500, parseFloat(S4[i]) / 500, parseFloat(S5[i]) / 500, parseFloat(S6[i]) / 500, 0];
        i+=1;
            //console.log(z);

        var trace10 = {
            type: 'scatter',
            x: x,
            y: y,
            mode: 'markers',
            hoverinfo: 'text',
             marker: {
                color: z,
                size: s,
                colorscale: "Portland",
                showscale: true,
                },
        };

        var ax = {
            zeroline: false,
            showline: false,
            showticklabels: false,
            showgrid: false
        };

        
        var data2 = [trace10];

        var layout2 = {
            title: 'Left Foot',
            height: 500,
            width: 500,
            yaxis: ax,
            xaxis: ax,
        };

        Plotly.newPlot('steven plot2', data2, layout2);

        var x1 = [];
        var y1 = [];
        var z1 = [];
        var s1 = [];

        function compute() {
                z = [0, parseFloat(S0[i]), parseFloat(S1[i]), parseFloat(S2[i]), parseFloat(S3[i]), parseFloat(S4[i]), parseFloat(S5[i]), parseFloat(S6[i]), 2500];
                s = [0, parseFloat(S0[i]) / 10, parseFloat(S1[i]) / 10, parseFloat(S2[i]) / 10, parseFloat(S3[i]) / 10, parseFloat(S4[i]) / 10, parseFloat(S5[i]) / 10, parseFloat(S6[i]) / 10, 0];
                console.log(z);
                i = i + 1;
        }

        
        function update() {
            compute();
            //console.log(z1);

            Plotly.animate('steven plot2', {
                data: [{x: x, y: y, 'marker.color': z, 'marker.size': s, 'text' : z, 'colorscale' : 'Portland'}] // new data to plot
            }, {
                transition: {
                    duration: 0 //time it takes to transition to the next setof data
                },
                frame: {
                    duration: 0, // time it spends at the new point before going to the next (I think, it might be total time per frame)
                    redraw: false
                }
            });


            requestAnimationFrame(update);
            //console.log(i);
        }
		
        requestAnimationFrame(update);
        //console.log( 'X',x, 'Y',y, 'SD',standard_deviation );
        //makePlotly( x, y, );
		//console.log(i)
        //makePlotly();
    }


    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    ////////////// End of Stevene's stuff ////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////

    //makePlotly();
    makeplot();


    function makePlotly(x, y, standard_deviation) {
        var plotDiv = document.getElementById("forceGraphDiv");
        //console.log(x);
        //console.log(y);
        var traces = [{
            x: x,
            y: y
        }];

        Plotly.newPlot('forceGraphDiv', traces, {
            title: 'Plotting CSV data from AJAX call'
        });
    };
    makeplot();
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

    $scope.data = [{
                name: 's0',
                y: []

            }, {
                name: 's1',
                y: []
            }, {
                name: 's2',
                y: []
            }, {
                name: 's3',
                y: []
            }, {
                name: 's4',
                y: []
            }, {
                name: 's5',
                y: []
            }, {
                name: 's6',
                y: []
            }, {
                name: 's7',
                y: []
            }


        ]
        //  Plotly.newPlot('forceGraphDiv', $scope.data);

    //$scope.layout = {height: 600, width: 1000, title: 'foobar'};
    //$scope.options = {showLink: false, displayLogo: false};
    //TODO make this watch a service
    $scope.$watch('csv.content', function () {
        //console.log(JSON.stringify($scope.csv.result[0]));
        //console.log($scope.chartConfig.series[0].data);
        //$scope.chartConfig.series[0].data = $scope.csv.result;
        // console.log($scope.csv.content);

        if ($scope.csv.content !== null) {
            //  $scope.toggleLoading();
            var lines = $scope.csv.content.split('\n');
            //Optimize with local variable and push entire series array
            var series = [

            ];

            $.each(lines, function (lineNo, line) {
                var items = line.split(',');
                // console.log(items);
                // header line containes categories

                // console.log(JSON.stringify($scope.chartConfig.series));
                if (lineNo == 0) {
                    $.each(items, function (itemNo, item) {
                        if (itemNo > 0) {
                            //Incase we use titles
                            //$scope.chartConfig.xAxis.categories.push(item);
                        }
                    });
                } else {

                    $.each(items, function (itemNo, item) {
                        switch (itemNo) {
                        case 0:
                            //$scope.chartConfig.xAxis.categories.push(parseFloat(item));
                            break;
                        case 1:
                            //series[0].data.push(parseFloat(item));
                            $scope.data[0].y.push(parseFloat(item));
                            //console.log($scope.data[0]);
                            break;
                        case 2:
                            $scope.data[1].y.push(parseFloat(item));
                            //$scope.chartConfig.series[1].data.push(parseFloat(item));
                            break;
                        case 3:
                            $scope.data[2].y.push(parseFloat(item));
                            //$scope.chartConfig.series[2].data.push(parseFloat(item));
                            break;
                        case 4:
                            $scope.data[3].y.push(parseFloat(item));
                            //$scope.chartConfig.series[3].data.push(parseFloat(item));
                            break;
                        case 5:
                            $scope.data[4].y.push(parseFloat(item));
                            //$scope.chartConfig.series[4].data.push(parseFloat(item));
                            break;
                        case 6:
                            $scope.data[5].y.push(parseFloat(item));
                            //$scope.chartConfig.series[5].data.push(parseFloat(item));
                            break;
                        case 7:
                            $scope.data[6].y.push(parseFloat(item));
                            //$scope.chartConfig.series[6].data.push(parseFloat(item));
                            break;

                        default:
                        }
                    });
                    var update = {
                        opacity: 0.4
                    };
                    // Plotly.restyle(graphDiv, update);
                    Plotly.restyle(forceGraphDiv, update);

                    //var test = $scope.data;

                    //console.log($scope.data)
                    //Plotly.redraw('plotly.graph');
                    //Test setting seek
                    //$scope.$API.seekTime(22);    

                    // TODO Push a giant array and optimize later
                    //$scope.chartConfig.series[0].data.push(series);
                    // $scope.toggleLoading();
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

}]);

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// Steven's stuff ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/* var x = [0, 4, 2, 6, 2, 6, 2, 6, 10]
var y = [0, 2, 4, 4, 6, 6, 8, 8, 10]
var z = [0, 100, 200, 300, 400, 500, 600, 700, 800]
var s = [0, 10, 20, 30, 40, 50, 60, 70, 0]

var trace1 = {
    type: 'scatter',
    x: x,
    y: y,
    mode: 'markers',
    hoverinfo: 'text',
    text: z,
    marker: {
        color: z,
        size: s
    }
};

var ax = {
    zeroline: false,
    showline: false,
    showticklabels: false,
    showgrid: false
};


var data = [trace1];

var layout = {
    title: 'Left Foot',
    height: 500,
    width: 500,
    axis: ax,
    xaxis: ax
};

//Plotly.newPlot('steven plot', data, layout);
//console.log(test1); */