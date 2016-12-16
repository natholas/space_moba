game.data = new function() {
	var $this = this, game, data;
	$this.data = {"keys": {}, "mouse_pos": {}, "buttons": {}, "cam_pos": {"x":0,"y":0}, "cam_speed": 4, "target_fps": 60};

	this.start = function (game_data, player_data) {
		game = $this.game;
		data = $this.data;
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
		$this.data.players = new_data.players;
		for (var i in new_data.units) {
			new_data.units[i].lerped_pos = {
				"x": new_data.units[i].pos.x,
				"y": new_data.units[i].pos.y
			}
			new_data.units[i].last_update = new Date().getTime();
		}
		$this.data.units = new_data.units;
	}

	this.update = function () {
		if (!data.loaded) return;

		data.units.forEach(function(unit) {

			if (unit.target.x == unit.pos.x && unit.target.y == unit.pos.y) return;
			if (unit.target.x == unit.lerped_pos.x && unit.target.y == unit.lerped_pos.y) return;

			var speed = $this.find_new_pos(unit.pos, unit.target, unit.speed, new Date().getTime() - unit.last_update);

			var dist = Math.abs(unit.target.x - unit.lerped_pos.x);
			var future_dist = Math.abs(unit.target.x - (unit.pos.x + speed.x));
			if (dist < future_dist) {
				unit.lerped_pos = unit.target;
				return;
			}

			unit.lerped_pos.x = unit.pos.x + speed.x;
			unit.lerped_pos.y = unit.pos.y + speed.y;
			unit.rotation = speed.r;

		});
	}

	this.find_new_pos = function (pos, target, speed, time_since_update) {
		var dir_x = target.x - pos.x;
		var dir_y = target.y - pos.y;

		var abs_x = Math.abs(target.x - pos.x);
		var abs_y = Math.abs(target.y - pos.y);

		var rad = Math.atan2(dir_x,dir_y);
		var deg = rad * 180/Math.PI;

		return {
			"x": (speed / (abs_x + abs_y) * dir_x) * time_since_update / 1000,
			"y": (speed / (abs_x + abs_y) * dir_y) * time_since_update / 1000,
			"r": -deg + 180
		}
	}

	Socket.is_connected(function() {
		Socket.conn.on("game_update", function(response) {
			$this.update_data(response);
		});
	});
}
