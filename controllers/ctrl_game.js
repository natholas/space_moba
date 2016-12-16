client.controller("gameCtrl", function($scope, Game, Account) {

	game.start(Game.data.data, Account.data);

	$scope.game = Game.data;

});
