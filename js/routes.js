// ROUTES
skiApp.config(['$routeProvider',function ($routeProvider) {
   
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
    
    .when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'aboutController'
    })
    
    
}]);