// CONTROLLERS
skiApp.controller('homeController', ['$scope', 'csvService', function($scope,csvService,csv) {

    //Details
    $scope.name = "";
    $scope.date = "";
    $scope.time = "";
    $scope.runNo = "";
    $scope.$on('leftCsvUploaded', function(event, args) {
        console.log(args[0].data[0]);
    
    if (args[0].data[0].length > 11 ) {
        
        $scope.name = args[0].data[0][11];
        $scope.date = args[0].data[0][12];
        $scope.runNo = args[0].data[0][13];
        
    }
     
    
    
        
    });
    
    

}]);



