var client = angular.module("client", ['ngRoute']);

client.config(function($routeProvider) {
	// var originalWhen = $routeProvider.when;
    // $routeProvider.when = function(path, route) {
    //     route.resolve || (route.resolve = {});
    //     angular.extend(route.resolve, {
    //         login_status: function(Account, $location) {
	// 			if ($location.$$path == "/login") return true;
	// 			return Account.check_login().then(function(response) {
	// 				if (response) return;
	// 				else $location.path("/login");
	// 			});
    //         }
    //     });
    //     return originalWhen.call($routeProvider, path, route);
    // };

	$routeProvider
	.when('/', {
        templateUrl: '/html/pages/dash.html',
        controller: "dashCtrl"
    })
	.when('/login', {
        templateUrl: '/html/pages/login.html',
        controller: "loginCtrl"
    })
	.when('/waiting', {
        template: '<content><h2>Waiting for other players</h2></content>'
    })
	.when('/game', {
        templateUrl: '/html/pages/game.html',
        controller: "gameCtrl"
    })
    .otherwise({
        template: '<content><h2>404 - Page not found!</h2></content>'
    });
})
