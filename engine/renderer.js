game.renderer = new function() {

	var $this = this, ctx, canvas, game;

	this.start = function () {

		canvas = $this.canvas = document.getElementsByTagName('canvas')[0];
		ctx = $this.ctx = $this.canvas.getContext('2d');
		game = $this.game;
	}

	this.update = function () {

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.arc(600,200,50,0,2*Math.PI);
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.closePath();

	}


}
