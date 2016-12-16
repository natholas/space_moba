client.service("Players", function(Socket) {

	this.data = {"users": []};
	var data = this.data;

	Socket.is_connected().then(function() {
		Socket.conn.on("get_users", function(response) {
			data.users = response;
		});
	});


})
