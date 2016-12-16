client.service("Game", function($location, $timeout) {

	this.data = {"data": JSON.parse('{"status":2,"players":[{"username":"Nathan","id":"xUTbvXm3C1LSQPaFAAAl"},{"username":"jsdfsdjkhgfsd","id":"6jKbrRa19EYUDKjHAAAm"}],"game_id":0}')};
	var data = this.data,
	$this = this;

	this.join_game = function () {
		Socket.is_connected(function() {
			Socket.conn.emit("join_game");
		});
	}

	Socket.is_connected(function() {
		Socket.conn.on("game_update", function(response) {
			$this.check_game_status(response);
		});
	});

	this.check_game_status = function (response) {
		if (data.status != response.status) {
			if (response.status == 0) $location.path("/");
		 	else if (response.status == 1) $location.path("/waiting");
		 	else if (response.status == 2) {
				data.data = response;
				$location.path("/game");
			}
			$timeout();
			data.status = response.status;
		}
	}

})
