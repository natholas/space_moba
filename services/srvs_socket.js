client.service("Socket", function($q) {

	this.conn = io.connect();
	var conn = this.conn;

	this.is_connected = function () {
		var deferred = $q.defer();
		console.log(conn.connected);
		if (conn.connected) deferred.resolve(true);
		else {
			conn.on('connect', function() {
				deferred.resolve(true);
			});
		}

		return deferred.promise;
	}

})
