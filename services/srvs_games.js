client.service("Games", function(Socket) {

	this.data = {};
	var data = this.data;

	this.join_game = function () {
		Socket.is_connected().then(function() {
			Socket.conn.emit("join_game", function(response) {
				console.log(response);
			});
		});
	}



})
