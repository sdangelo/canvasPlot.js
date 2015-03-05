var canvasPlot = {
	direction: {
		horizontal:	1,
		vertical:	2
	},

	area: {
		x:	0,
		y:	0,
		width:	0,
		height: 0
	},

	range: {
		min:	NaN,
		max:	NaN
	},

	samples: {
		x:	null,
		y:	null,

	},

	mapLinear: function (area, xrange, yrange, x, y) {
		var kx1 = area.width / (xrange.max - xrange.min);
		var kx0 = area.x - kx1 * xrange.min;
		var ky1 = -area.height / (yrange.max - yrange.min);
		var ky0 = area.y + area.height - ky1 * yrange.min;

		var ret	= {x: new Array(x.length), y: new Array(y.length)};
		for (var i = 0; i < x.length; i++) {
			ret.x[i] = kx0 + kx1 * x[i];
			ret.y[i] = ky0 + ky1 * y[i];
		}
		return ret;
	},

	frame: {
		area:		null,

		borderWidth:	2,
		borderStyle:	"#000",

		draw: function (ctx) {
			if (!this.area || this.area.width == 0
			    || this.area.height == 0)
				return;

			ctx.save();
			ctx.lineWidth = this.borderWidth;
			ctx.strokeStyle = this.borderStyle;

			ctx.strokeRect(this.area.x + 0.5 * this.borderWidth,
				       this.area.y + 0.5 * this.borderWidth,
				       this.area.width - this.borderWidth,
				       this.area.height - this.borderWidth);

			ctx.restore();
		},

		getInnerArea: function () {
			var area = Object.create(this.area);
			area.x = this.area.x + this.borderWidth;
			area.y = this.area.y + this.borderWidth;
			area.width = this.area.width - this.borderWidth
				     - this.borderWidth;
			area.height = this.area.height - this.borderWidth
				      - this.borderWidth;
			return area;
		}
	},

	tic: {
		value:		NaN,
		direction:	null,

		lineWidth:	1,
		lineStyle:	"#ccc",

		draw: function (ctx, area, map, xrange, yrange) {
			var p = null;
			if (this.direction == 1  // direction.horizontal
			    && this.value >= yrange.min
			    && this.value <= yrange.max)
				var p = map(area, xrange, yrange,
					    [xrange.min, xrange.max],
					    [this.value, this.value]);
			else if (this.direction == 2  // direction.vertical
				   && this.value >= xrange.min
				   && this.value <= xrange.max)
				var p = map(area, xrange, yrange,
					    [this.value, this.value],
					    [yrange.min, yrange.max]);

			if (p) {
				ctx.save();

				ctx.lineWidth = this.lineWidth;
				ctx.strokeStyle = this.lineStyle;
				ctx.lineCap = "square";

				ctx.rect(area.x, area.y,
					 area.width, area.height);
				ctx.clip();

				ctx.beginPath();
				ctx.moveTo(p.x[0], p.y[0]);
				ctx.lineTo(p.x[1], p.y[1]);
				ctx.stroke();

				ctx.restore();
			}
		}
	},

	grid: {
		tics:		null,

		draw: function (ctx, area, map, xrange, yrange) {
			if (!this.tics)
				return;

			for (var i = 0; i < this.tics.length; i++)
				this.tics[i].draw(ctx, area, map,
						  xrange, yrange);
		},
	},

	curve: {
		samples:	null,

		lineWidth:	2,
		lineStyle:	"#0f0",

		pointRadius:	4,

		draw: function (ctx, area, map, xrange, yrange) {
			if (!this.samples || this.samples.length == 0)
				return;

			var p = map(area, xrange, yrange,
				    this.samples.x, this.samples.y);

			var exists = function(x, y) {
				return isFinite(x) && isFinite(y);
			};

			var areax2 = area.x + area.width;
			var areay2 = area.y + area.height;
			var inRange = function(x, y) {
				return x >= area.x && x <= areax2
				       && y >= area.y && y <= areay2;
			};

			var radius = this.pointRadius;
			var eAngle = Math.PI + Math.PI;
			var drawPoint = function(x, y) {
				ctx.beginPath();
				ctx.arc(x, y, radius, 0.0, eAngle);
				ctx.fill();
			};

			ctx.save();
			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = this.lineStyle;
			ctx.fillStyle = this.lineStyle;
			ctx.lineJoin = "round";

			ctx.rect(area.x, area.y, area.width, area.height);
			ctx.clip();

			var xPrev = NaN;
			var yPrev = NaN;
			var exPrev = false;
			var irPrev = false;
			var pathBegun = false;
			p.x.push(NaN);
			p.y.push(NaN);
			for (var i = 0; i < p.x.length; i++) {
				var x = p.x[i];
				var y = p.y[i];
				var ex = exists(x, y);
				var ir = inRange(x, y);

				if (pathBegun) {
					if (exPrev)
						ctx.lineTo(xPrev, yPrev);
					if (!ex || (ex && !ir
						    && exPrev && !irPrev)) {
						ctx.stroke();
						pathBegun = false;
					}
				} else if (irPrev) {
					if (ex) {
						ctx.beginPath();
						ctx.moveTo(xPrev, yPrev);
						pathBegun = true;
					} else {
						drawPoint(xPrev, yPrev);
					}
				} else if (exPrev && ir) {
					ctx.beginPath();
					ctx.moveTo(xPrev, yPrev);
					pathBegun = true;
				}

				xPrev = x;
				yPrev = y;
				exPrev = ex;
				irPrev = ir;
			}

			ctx.restore();
		}
	},

	ctx:	null,

	xrange: null,
	yrange: null,

	curves:	null,

	map:	null,

	draw: function () {
		this.ctx.clearRect(this.area.x, this.area.y,
				   this.area.width, this.area.height);
		var area = this.frame.getInnerArea();

		if (this.map != null) {
			this.grid.draw(this.ctx, area, this.map,
				       this.xrange, this.yrange);

			if (this.curves != null)
				for (var i = 0; i < this.curves.length; i++)
					this.curves[i].draw(this.ctx, area,
							    this.map,
							    this.xrange,
							    this.yrange);
		}

		this.frame.draw(this.ctx);
	}
};
