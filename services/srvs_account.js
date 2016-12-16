client.service("Account", function(Socket, $q, $location, $timeout) {

	this.data = {};
	var data = this.data;

	this.check_login = function () {
		var deferred = $q.defer();
		if (data.loggedin) deferred.resolve(true);
		else deferred.resolve(false);
		return deferred.promise;
	}

	this.login = function (username) {
		Socket.conn.emit("login", {username: username}, function(response) {
			data.loggedin = true;
			data.username = username;
			$location.path("/");
			$timeout(function() {});
		});
	}

	this.logout = function () {
		data.loggedin = false;
		delete data.username;
		Socket.conn.emit("logout");
		$location.path("/login");
	}

})
