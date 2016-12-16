game.camera = new function() {

	var $this = this, game, data, canvas, renderer;

	this.start = function () {

		game = $this.game;
		data = game.data.data;
		canvas = game.renderer.canvas;
		renderer = game.renderer;

		document.addEventListener("keydown", function(e) {
			data.keys[e.key] = true;
		});

		document.addEventListener("keyup", function(e) {
			delete data.keys[e.key];
		});

		document.addEventListener("mousemove", function(e) {
			var offset = game.renderer.canvas.getBoundingClientRect();
			data.mouse_pos.x = ((e.clientX + -offset.left) / canvas.offsetWidth) * canvas.width;
			data.mouse_pos.y = ((e.clientY + -offset.top) / canvas.offsetHeight) * canvas.height;
		});

		document.addEventListener("mousedown", function(e) {
			data.buttons[e.button] = true;
		});

		document.addEventListener("mouseup", function(e) {
			delete data.buttons[e.button];
			if (e.button == 0) {
				data.selected_item = data.hover_item;
			} else if (e.button == 2 && data.selected_item) {
				data.target_pos = {
					"x": parseInt(data.mouse_pos.x - data.cam_pos.x - canvas.width / 2),
					"y": parseInt(data.mouse_pos.y - data.cam_pos.y - canvas.height / 2)
				}
				Socket.conn.emit("set_target", data.selected_item.id, data.target_pos);
			}
		});

		window.onblur = function () {
		 	data.keys = {};
		}

		document.oncontextmenu = function (e) {
			e.preventDefault();
		};

	}

	this.update = function () {

		if (data.keys.w) data.cam_pos.y += data.cam_speed;
		if (data.keys.s) data.cam_pos.y -= data.cam_speed;
		if (data.keys.a) data.cam_pos.x += data.cam_speed;
		if (data.keys.d) data.cam_pos.x -= data.cam_speed;

	}


}
