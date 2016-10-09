// ROUTES
skiApp.config(function ($routeProvider) {
   
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
    
    .when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'aboutController'
    })
    
    
});