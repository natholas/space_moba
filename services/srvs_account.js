client.service("Account", function(Socket, $q) {

	this.data = {};
	var data = this.data;

	this.check_login = function () {
		var deferred = $q.defer();
		if (data.loggedin) deferred.resolve(true);
		else deferred.resolve(false);
		return deferred.promise;
	}

})
