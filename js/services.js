// SERVICES
skiApp.service('sharedGraphDataProperties', function () {
        var property ='';

        return {
            getTimeSyncVariable: function () {
                return TimeSyncVariable;
            },
            setTimeSyncVariable: function(value) {
                TimeSyncVariable = value;
                            }
 };
 });

