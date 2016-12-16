var Socket = {};
Socket.conn = io.connect();

Socket.is_connected = function (callback) {
	if (Socket.conn.connected) callback();
	else {
		Socket.conn.on('connect', function() {
			callback();
		});
	}
}
