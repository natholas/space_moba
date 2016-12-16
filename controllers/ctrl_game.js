client.controller("gameCtrl", function($scope, Game) {

	game.start(Game.data.data);

	$scope.game = Game.data;

});
