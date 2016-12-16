var game = new function() {
	var $this = this;

	this.start = function (game_data) {

		$this.renderer.game = $this;
		$this.data.game = $this;
		$this.renderer.start();
		$this.data.start(game_data);

		$this.update();

	}

	this.update = function () {

		$this.renderer.update();

		setTimeout(function () {
			$this.update();
		});

	}
}
