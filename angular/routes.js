myApp.config( ['$routeProvider', '$locationProvider' ,function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('!');
	$locationProvider.html5Mode(true);
    $routeProvider
	.when('/',{
		templateUrl		: 'views/index-view.html',
	    controller 		: 'bookCtrl',
		controllerAs 	: 'allData'
	})
	.when('/singleDetail/:type/:number',{
    	templateUrl     : 'views/single-view.html',
    	controller 		: 'singleDetailController',
    	controllerAs 	: 'singleDetail'
    })
	.otherwise(
        {
            //redirectTo:'/'
            template   : '<h1>404 page not found</h1>'
        }
    );


}]);