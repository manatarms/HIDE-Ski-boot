// CONTROLLERS
skiApp.controller('homeController', ['$scope','$sce', function($scope,$sce) {

	$scope.videoConfig = {
					sources: [
						{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
						{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
						{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
					],
					theme: "../css/videogular.css"
				};


    $scope.chartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'line'
            },
            tooltip: {
                style: {
                    padding: 10,
                    fontWeight: 'bold'
                }
            }
        },
        //The below properties are watched separately for changes.

        //Series object (optional) - a list of series using normal Highcharts series options.
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        //Title configuration (optional)
        title: {
            text: 'Hello'
        },
        //Boolean to control showing loading status on chart (optional)
        //Could be a string if you want to show specific loading text.
        loading: false,
        //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
        //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
        xAxis: {
            currentMin: 0,
            currentMax: 20,
            title: { text: 'values' }
        },

        //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
        useHighStocks: false,
        //size (optional) if left out the chart will default to size of the div or something sensible.
        size: {
            //width: 400,
            //height: 300
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }

        },

        //function (optional)
        func: function(chart) {
            //setup some logic for the chart
        }
    };
}]);

skiApp.controller('aboutController', ['$scope', function($scope) {



}]);
