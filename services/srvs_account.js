client.service("Account", function($q, $location, $timeout) {

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
			data.id = response;
			$location.path("/");
			$timeout();
		});
	}

	this.logout = function () {
		data.loggedin = false;
		delete data.username;
		Socket.conn.emit("logout");
		$location.path("/login");
	}

})
