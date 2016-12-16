var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var users = [];
var connections = [];
var games = [];
var players_per_game = 2;
var min_players_per_game = 2;
var units_per_player = 1;
var world_size = 1000;

server.listen(process.env.PORT || 3000);

console.log("Server running");

app.get("/", function(req, resp) {
	resp.sendFile(__dirname + "/index.html");
});

app.get("/*", function(req, resp) {
	resp.sendFile(__dirname + req.url);
});


io.sockets.on('connection', function(socket) {

	// Setting up the connection
	connections.push(socket);
	console.log("%s sockets connected", connections.length);

	// Disconnect
	socket.on("disconnect", function(data) {
		if (socket.username) {
			if (socket.game) socket.game.player_disconnected(socket.id, null);
			users.splice(users.indexOf(socket.username), 1);
		}
		updateUserNames();
		connections.splice(connections.indexOf(socket), 1);
		console.log("%s sockets connected", connections.length);
	});



	// Login
	socket.on("login", function(data, callback) {
		socket.username = data.username;
		callback(socket.id);
		if (users.indexOf(data.username) < 0) {
			users.push(data.username);
			updateUserNames();
		}
	});


	// Logout
	socket.on("logout", function() {
		if (socket.username) {
			users.splice(users.indexOf(socket.username), 1);
			updateUserNames();
		}
	});



	// Join game
	socket.on("join_game", function() {
		if (!socket.username) return;
		var old_game = find_game_by_player_id(socket.id);
		if (old_game) old_game.player_disconnected(socket.id);

		var game_to_join;

		// Checking if there is a game that the player can join
		for (var i in games) {
			if (games[i].data.players.length >= players_per_game) continue;
			game_to_join = games[i];
			break;
		}

		// if there was not then we can create a new one
		if (!game_to_join) {
			game_to_join = new game();
			games.push(game_to_join);
			game_to_join.data.game_id = games.length - 1;
			game_to_join.data.status = 1;
		}

		// Connecting this game to the socket
		socket.game = game_to_join;

		// Adding the player to the game
		game_to_join.data.players.push({
			username: socket.username,
			id: socket.id
		});

		// Checking if the player count in this game is not at the max
		if (game_to_join.data.players.length == players_per_game) {
			// Starting the game
			game_to_join.start();
		} else {
			game_to_join.update()
		}

	});




	function updateUserNames() {
		io.sockets.emit("get_users", users);
		console.log("%s users connected", users.length);
	}

	function find_socket(socket_id) {
		for (var i in connections) {
			if (connections[i].id == socket_id) return connections[i];
		}
		return false;
	}

	function find_game_by_player_id(id) {
		for (var i in games) {
			for (var ii in games[i].data.players) {
				if (games[i].data.players[ii].id == id) return games[i];
			}
		}
		return false;
	}

	function find_game_index_by_id(id) {
		for (var i in games) if (games[i].game_id == id) return i;
		return -1;
	}

	function game() {
		var $this = this;
		this.data = {status: 0, players: [], units: [], world_size: world_size};
		var data = $this.data;
		this.start = function () {
			// Updating the status
			data.status = 2;

			// Spawning the units
			for (var i in data.players) {
				for (var ii = 0; ii < units_per_player; ii ++) {
					data.units.push(new unit(data.players[i]));
				}
			}

			$this.update();
		}

		this.update = function () {
			for (var i in data.players) {
				var player_socket = find_socket(data.players[i].id);
				if (player_socket) player_socket.emit("game_update", data);
				else $this.player_disconnected(0, i);
			}
		}

		this.end = function () {
			data.status = 0;
			$this.update();
			games.splice(find_game_index_by_id(data.game_id), 1);
		}

		this.player_disconnected = function (id, index) {
			if (!index) index = $this.find_player(id);
			data.players.splice(index, 1);
			if (data.players.length < min_players_per_game) $this.end();
			else $this.update();
		}

		this.find_player = function (id) {
			for (var i in data.players) {
				if (data.players[i].id == id) return i;
			}
		}
	}

});

function unit(player) {
	var $this = this;
	this.owner = player;
	this.pos = {
		"x": 0,
		"y": 0
	}
	this.target = {
		"x": 0,
		"y": 0
	}
}
