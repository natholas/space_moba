client.service("Players", function() {

	this.data = {"users": []};
	var data = this.data;

	Socket.is_connected(function() {
		Socket.conn.on("get_users", function(response) {
			data.users = response;
		});
	});


})
