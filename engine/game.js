var game = new function() {
	var $this = this;

	this.start = function (game_data) {

		$this.renderer.game = $this;
		$this.data.game = $this;
		$this.camera.game = $this;
		$this.renderer.start();
		$this.data.start(game_data);
		$this.camera.start();

		$this.update();

	}

	this.update = function () {

		$this.renderer.update();
		$this.camera.update();

		setTimeout(function () {
			$this.update();
		},100);

	}
}
