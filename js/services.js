//csvFactory
// skiApp.factory('csvFactory',function(scope){

// 	// SERVICES
// 		return function(){
// 	        if (scope.csv.content !== null) {
// 	            scope.toggleLoading();
// 	            var lines = scope.csv.content.split('\n');
// 	            //Optimize with local variable and push entire series array
// 	            var series = [

// 	            ];

// 	            $.each(lines, function(lineNo, line) {
// 	                var items = line.split(',');
// 	                // console.log(items);
// 	                // header line containes categories

// 	                // console.log(JSON.stringify(scope.chartConfig.series));
// 	                if (lineNo == 0) {
// 	                    $.each(items, function(itemNo, item) {
// 	                        if (itemNo > 0) {
// 	                            //Incase we use titles
// 	                            //scope.chartConfig.xAxis.categories.push(item);
// 	                        }
// 	                    });
// 	                } else {

// 	                    $.each(items, function(itemNo, item) {
// 	                        switch (itemNo) {
// 	                            case 0:
// 	                                scope.chartConfig.xAxis.categories.push(parseFloat(item));
// 	                                break;
// 	                            case 1:
// 	                                //series[0].data.push(parseFloat(item));
// 	                                scope.chartConfig.series[0].data.push(parseFloat(item));
// 	                                // console.log(scope.chartConfig.series[0].data);
// 	                                break;
// 	                            case 2:
// 	                                scope.chartConfig.series[1].data.push(parseFloat(item));
// 	                                break;
// 	                            case 3:
// 	                                scope.chartConfig.series[2].data.push(parseFloat(item));
// 	                                break;
// 	                            case 4:
// 	                                scope.chartConfig.series[3].data.push(parseFloat(item));
// 	                                break;
// 	                            case 5:
// 	                                scope.chartConfig.series[4].data.push(parseFloat(item));
// 	                                break;
// 	                            case 6:
// 	                                scope.chartConfig.series[5].data.push(parseFloat(item));
// 	                                break;
// 	                            case 7:
// 	                                scope.chartConfig.series[6].data.push(parseFloat(item));
// 	                                break;

// 	                            default:

// 	                        }
// 	                    });
// 	                    //Test setting seek
// 	                    //scope.$API.seekTime(22);    

// 	                    // TODO Push a giant array and optimize later
// 	                    //scope.chartConfig.series[0].data.push(series);
// 	                    scope.toggleLoading();
// 	                }


// 	                // the rest of the lines contain data with their name in the first 
// 	                // position
// 	                // else {
// 	                //     var series = {
// 	                //         data: []
// 	                //     };
// 	                //     $.each(items, function(itemNo, item) {
// 	                //         if (itemNo == 0) {
// 	                //             series.name = item;
// 	                //         } else {
// 	                //             series.data.push(parseFloat(item));
// 	                //         }
// 	                //     });

// 	                //    chartConfig.series.push(series);

// 	                // }

// 	            });
// 	        }

// 	    }
// });