game.renderer = new function() {

	var $this = this, ctx, canvas, game, data;

	this.start = function () {

		canvas = $this.canvas = document.getElementsByTagName('canvas')[0];
		ctx = $this.ctx = $this.canvas.getContext('2d');
		game = $this.game;
		data = game.data.data;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false; /// future

	}

	this.update = function () {

		// Checking if the data is loaded
		if (!game.data.data.loaded) return;
		data.hover_item = null;

		// Clearing the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Drawing the map
		$this.draw_map($this.screen_space_pos({"x":0,"y":0}), data.world_size);

		// Drawing each unit
		data.units.forEach(function(unit) {
			var pos = $this.screen_space_pos(unit.lerped_pos);

			if (unit.owner.id == data.player_data.id) {

				if (!data.hover_item) {
					$this.check_hover(pos, unit, 40);
				}

				if (data.selected_item && unit.id == data.selected_item.id) {
					$this.draw_circle(pos, 60, '#FFF');
				}
				if (unit.target.x != unit.lerped_pos.x) {
					var target_pos = $this.screen_space_pos(unit.target);
					$this.draw_circle(target_pos, 4, "red");
					$this.draw_line(pos, target_pos, "red");
				}
			}
			$this.draw_unit(pos, unit.rotation, unit.target, 100);

		});

	}

	this.draw_unit = function (pos, rot, target, size) {
	    ctx.save();
	    ctx.translate(pos.x, pos.y);
	    ctx.rotate(rot*Math.PI/180);
		ctx.drawImage(data.images.spaceship, -size / 2, -size / 2, size, size);
		ctx.restore();
	}

	this.draw_circle = function (pos, size, colour) {
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, size, 0, 2*Math.PI);
		ctx.strokeStyle = colour;
		ctx.lineWidth = 0.5;
		ctx.stroke();
		ctx.closePath();
	}

	this.draw_map = function (pos, size) {
		ctx.fillStyle="#625d7d";
		ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
	}

	this.draw_line = function (start, end, colour) {
		ctx.beginPath();
		ctx.moveTo(start.x,start.y);
		ctx.lineTo(end.x,end.y);
		ctx.stroke();
		ctx.closePath();
	}

	this.screen_space_pos = function (pos) {
		return {
			"x": $this.adjust_to_scren_space(pos.x, "x"),
			"y": $this.adjust_to_scren_space(pos.y, "y")
		}
	}

	this.adjust_to_scren_space = function (unit, dimention) {
		var type = (dimention == "x") ? "width" : "height";
		return unit + (canvas[type] / 2) + data.cam_pos[dimention];
	}

	this.check_hover = function (pos, object, offset, asjkfh) {
		if (pos.x < (data.mouse_pos.x + offset) && pos.x > (data.mouse_pos.x - offset)
		&& pos.y < (data.mouse_pos.y + offset) && pos.y > (data.mouse_pos.y - offset)) {
			data.hover_item = object;
			return true;
		}
		return false;
	}


}
