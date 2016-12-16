var game = new function() {
	var $this = this, begin, data;

	this.start = function (game_data, player_data) {

		$this.renderer.game = $this;
		$this.data.game = $this;
		$this.camera.game = $this;
		$this.renderer.start();
		$this.data.start(game_data, player_data);
		$this.camera.start();
		data = $this.data.data;

		$this.update();

	}

	this.update = function () {

		begin = performance.now();

		$this.camera.update();
		$this.data.update();
		$this.renderer.update();

		data.last_frame = performance.now() - begin;

		var next_frame = (1000 / data.target_fps) - data.last_frame;

		data.fps = 1000 / data.last_frame;

		setTimeout($this.update, next_frame);

	}
}
