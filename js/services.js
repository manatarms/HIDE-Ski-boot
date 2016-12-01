// SERVICES

//Sharing variables
skiApp.service('sharedGraphDataProperties', function() {
    var timeSyncVariable = '';
    var sensorValues = '';
    var self = this;
    return {
        getTimeSyncVariable: function() {
            return this.timeSyncVariable;
        },
        setTimeSyncVariable: function(timeSyncVariable) {
            this.timeSyncVariable = timeSyncVariable;
        },
        setSensorValues: function(sensorValues) {
            this.sensorValues = sensorValues;
        },
        getSensorValues: function() {
            return this.sensorValues;
        }
    };
});

//Color ranging service
skiApp.service('colorRangeService', function() {
    var property = '';

    function hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h);
            g = hue2rgb(p, q, h + 1 / 3);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    }

    function numberToColorHsl(i) {
        // as the function expects a value between 0 and 1, and red = 0° and green = 120°
        // we convert the input to the appropriate hue value
        var hue = i * 1.2 / 360;
        // we convert hsl to rgb (saturation 100%, lightness 50%)
        var rgb = hslToRgb(hue, 1, .5);
        // we format to css value and return
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    }

    return {
        convertValueToRgb: function(value) {
            return numberToColorHsl(value);
        }
    };
});




//CSV handling service
skiApp.service('csvService', ['$timeout', '$q', function($timeout, $q) {



    function csvHander(content, chartConfig) {
        
        if (content !== null) {
            // var series = [

            // ];
            //Left the call in case we want to break out this function later
            processLargeArrayAsync(content);
            function processLargeArrayAsync(array, maxTimePerChunk) {
                maxTimePerChunk = maxTimePerChunk || 200;
                var index = 1;//Start from 1 to skip headings
                var rowLenght = array.length;
                function now() {
                    return new Date().getTime();
                }

                function doChunk() {
                    var startTime = now();
                    while (index < rowLenght && (now() - startTime) <= maxTimePerChunk) {
                        for(i=0;i<content[index].length;i++){
                            switch (i) {
                                case 0:
                                    chartConfig.xAxis.categories.push(parseFloat(content[index][i]));
                                    break;
                                case 1:
                                    chartConfig.series[0].data.push(parseFloat(content[index][i]));
                                    break;
                                case 2:
                                    chartConfig.series[1].data.push(parseFloat(content[index][i]));
                                    break;
                                case 3:
                                    chartConfig.series[2].data.push(parseFloat(content[index][i]));
                                    break;
                                case 4:
                                    chartConfig.series[3].data.push(parseFloat(content[index][i]));
                                    break;
                                case 5:
                                    chartConfig.series[4].data.push(parseFloat(content[index][i]));
                                    break;
                                case 6:
                                    chartConfig.series[5].data.push(parseFloat(content[index][i]));
                                    break;
                                case 7:
                                    chartConfig.series[6].data.push(parseFloat(content[index][i]));
                                    break;
                                case 8:
                                    chartConfig.series[7].data.push(parseFloat(content[index][i]));
                                    break;
                                default:
                                    break;

                            }

                        }
                        ++index;
                    }
                    if (index < rowLenght) {
                        // set Timeout for async iteration
                        $timeout(doChunk, 1);
                    }
                }    
                doChunk();    
            }
            

            
        } //End Null check 
        return $q(function(resolve, reject) {
            resolve();
        });

    }

    function setCsvContent(content) {
        this.savedCsv = content;
    }

    function getCsvContent() {
        return this.savedCsv;
    }

    return {
        csvHander: function(content, chartConfig) {
            return csvHander(content, chartConfig);
        },
        setCsvContent: function(content) {
            return setCsvContent(content);
        },
        getCsvContent: function(content) {
            return getCsvContent(content);
        }
    };
}]);


//Add chart config builder later
skiApp.service('chartConfigBuilder', function() {


});
