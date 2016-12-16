var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var users = [];
var connections = [];
var games = [];
var players_per_game = 2;

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
		if (socket.username) users.splice(users.indexOf(socket.username), 1);
		updateUserNames();
		connections.splice(connections.indexOf(socket), 1);
		console.log("%s sockets connected", connections.length);
	});



	// Login
	socket.on("login", function(data, callback) {
		socket.username = data.username;
		callback(true);
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
	socket.on("join_game", function(callback) {
		if (!socket.username) return;

		var game_to_join;

		// Checking if there is a game that the player can join
		for (var i in games) {
			if (games[i].players.length >= players_per_game) continue;
			game_to_join = games[i];
			break;
		}

		// if there was not then we can create a new one
		if (!game_to_join) {
			game_to_join = new game();
			games.push(game_to_join);
			game_to_join.data.game_id = games.length - 1;
		}

		// Connecting this game to the socket
		socket.game = game_to_join;

		// Adding the player to the game
		game_to_join.players.push(socket.username);

		// Checking if the player count in this game is not at the max
		if (game_to_join.players.length == players_per_game) {

			// Starting the game
			game_to_join.start();
		}

		callback(game_to_join);

	});




	function updateUserNames() {
		io.sockets.emit("get_users", users);
		console.log("%s users connected", users.length);
	}

	function game() {
		var $this = this;
		this.players = [];
		this.data = {status: 0};
		this.start = function () {
			$this.data.status = 1;
		}
	}

});
