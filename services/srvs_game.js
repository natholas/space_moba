client.service("Game", function($location, $timeout) {

	this.data = {"data": JSON.parse('{"status":2,"players":[{"username":"Nathan","id":"uhJ6K0SIExs92RpjAAAB","$$hashKey":"object:19"},{"username":"Silas","id":"b6FAp30Qz4bFhMFlAAAC","$$hashKey":"object:20"}],"units":[{"owner":{"username":"Silas","id":"b6FAp30Qz4bFhMFlAAAC","$$hashKey":"object:20"},"pos":{"x":0,"y":0},"target":{"x":0,"y":0}},{"owner":{"username":"Nathan","id":"uhJ6K0SIExs92RpjAAAB","$$hashKey":"object:19"},"pos":{"x":0,"y":0},"target":{"x":0,"y":0}}],"world_size":1000,"game_id":0}')};
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
