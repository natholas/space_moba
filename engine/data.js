game.data = new function() {
	var $this = this, game;
	$this.data = {"keys": {}, "mouse_pos": {}, "buttons": {}, "cam_pos": {"x":0,"y":0}, "cam_speed": 4};

	this.start = function (game_data, player_data) {


		// Temp
		player_data = {"username": "Nathan", "id": "uhJ6K0SIExs92RpjAAAB"};


		game = $this.game;

		$this.data.players = game_data.players;
		$this.data.units = game_data.units;
		$this.data.world_size = game_data.world_size;
		$this.data.player_data = player_data;

		$this.data.images = {};
		$this.data.images.spaceship = new Image();
		$this.data.images.spaceship.src = "/images/spaceship.png";

		$this.data.loaded = true;

	}

	this.update_data = function (new_data) {
		console.log(new_data);
	}

	Socket.is_connected(function() {
		Socket.conn.on("game_update", function(response) {
			$this.update_data(response);
		});
	});
}
