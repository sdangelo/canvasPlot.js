/*
 * Copyright (C) 2015 Stefano D'Angelo <zanga.mail@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

var canvasPlot = {
	direction: {
		horizontal:	1,
		vertical:	2
	},

	point: {
		x:	NaN,
		y:	NaN
	},

	range: {
		min:	NaN,
		max:	NaN
	},

	samples: {
		x:	null,
		y:	null,

		init: function (x, y) {
			this.x = x ? x : [];
			this.y = y ? y : [];
		}
	},

	area: {
		p:	null,
		width:	NaN,
		height: NaN,

		p2:	null,

		init: function (p) {
			this.p = p ? p : Object.create(this.p);
			this.p2 = Object.create(this.p2);
		},

		update: function () {
			this.p2.x = this.p.x + this.width;
			this.p2.y = this.p.y + this.height;
		},

		contains: function (x, y, lx, tx, rx, bx) {
			return x >= (this.p.x - lx) && x < (this.p2.x + rx)
			       && y >= (this.p.y - tx) && y < (this.p2.y + bx);
		}
	},

	map: {
		xRange:		null,
		yRange:		null,

		init: function (xRange, yRange) {
			this.xRange = xRange ? xRange
					     : Object.create(this.xRange);
			this.yRange = yRange ? yRange
					     : Object.create(this.yRange);
		},

		update: function (area) {
		},

		mapPoint: function (x, y, m) {
			m.x = NaN;
			m.y = NaN;
		},

		mapPoints: function (x, y, mx, my, xFirst, yFirst,
				     mxFirst, myFirst, count) {
			for (var i = 0; i < count; i++) {
				mx[mxFirst + i] = NaN;
				my[myFirst + i] = NaN;
			}
		}
	},

	frame: {
		area:		null,

		borderWidth:	2,
		borderStyle:	"#000",

		strokeArea:	null,
		innerArea:	null,

		init: function (area) {
			if (area)
				this.area = area;
			else {
				this.area = Object.create(this.area);
				this.area.init(null);
			}
			this.strokeArea = Object.create(this.strokeArea);
			this.strokeArea.init(null);
			this.innerArea = Object.create(this.innerArea);
			this.innerArea.init(null);
		},

		update: function () {
			var bwh = 0.5 * this.borderWidth;
			var bw2 = this.borderWidth + this.borderWidth;

			this.strokeArea.p.x = this.area.p.x + bwh;
			this.strokeArea.p.y = this.area.p.y + bwh;
			this.strokeArea.width =
				this.area.width - this.borderWidth;
			this.strokeArea.height =
				this.area.height - this.borderWidth;
			this.strokeArea.update();

			this.innerArea.p.x = this.area.p.x + this.borderWidth;
			this.innerArea.p.y = this.area.p.y + this.borderWidth;
			this.innerArea.width = this.area.width - bw2;
			this.innerArea.height = this.area.height - bw2;
			this.innerArea.update();
		},

		draw: function (ctx) {
			ctx.save();

			ctx.lineWidth = this.borderWidth;
			ctx.strokeStyle = this.borderStyle;

			ctx.strokeRect(this.strokeArea.p.x, this.strokeArea.p.y,
				       this.strokeArea.width,
				       this.strokeArea.height);

			ctx.restore();
		}
	},

	tic: {
		value:		NaN,
		direction:	NaN,

		lineWidth:	1,
		lineStyle:	"#ccc",

		toDraw:		false,
		p1:		null,
		p2:		null,

		init: function () {
			this.p1 = Object.create(this.p1);
			this.p2 = Object.create(this.p2);
		},

		update: function (map) {
			if (this.direction == 1 /* direction.horizontal */) {
				if (this.value >= map.yRange.min
				    && this.value <= map.yRange.max) {
					map.mapPoint(map.xRange.min, this.value,
						     this.p1);
					map.mapPoint(map.xRange.max, this.value,
						     this.p2);
					this.toDraw = true;
				} else
					this.toDraw = false;
			} else if (this.direction == 2 /* direction.vertical */)
			{
				if (this.value >= map.xRange.min
				    && this.value <= map.xRange.max) {
					map.mapPoint(this.value, map.yRange.min,
						     this.p1);
					map.mapPoint(this.value, map.yRange.max,
						     this.p2);
					this.toDraw = true;
				} else
					this.toDraw = false;
			} else
				this.toDraw = false;
		},

		draw: function (ctx, area) {
			if (!this.toDraw)
				return;

			ctx.save();

			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = this.lineStyle;
			ctx.lineCap = "square";

			ctx.beginPath();
			ctx.rect(area.p.x, area.p.y, area.width, area.height);
			ctx.clip();

			ctx.beginPath();
			ctx.moveTo(this.p1.x, this.p1.y);
			ctx.lineTo(this.p2.x, this.p2.y);
			ctx.stroke();

			ctx.restore();
		}
	},

	grid: {
		tics:	null,

		init: function (tics) {
			this.tics = tics ? tics : [];
		},

		update: function (map) {
			for (var i = 0; i < this.tics.length; i++)
				this.tics[i].update(map);
		},

		draw: function (ctx, area) {
			for (var i = 0; i < this.tics.length; i++)
				this.tics[i].draw(ctx, area);
		},
	},

	curveDrawer: {
		drawBegin: function (ctx, area, lineWidth, lineStyle,
				     pointRadius) {
		},

		drawPart: function (mSamples, first, last) {
		},

		drawEnd: function () {
		}
	},

	curve: {
		samples:	null,
		mSamples:	null,

		lineWidth:	2,
		lineStyle:	"#0f0",

		pointRadius:	4,

		init: function (samples, mSamples) {
			this.samples = samples ? samples
					       : Object.create(this.samples);
			this.mSamples = mSamples ? mSamples
					       : Object.create(this.samples);
			if (samples && !mSamples) {
				this.mSamples.init(Array(this.samples.x.length),
					Array(this.samples.y.length));
			} else if (!samples && mSamples) {
				this.samples.init(Array(this.mSamples.x.length),
					Array(this.mSamples.y.length));
			} else if (!samples && !mSamples) {
				this.samples.init(null, null);
				this.mSamples.init(null, null);
			}
		},

		updatePart: function (map, first, count) {
			map.mapPoints(this.samples.x, this.samples.y,
				      this.mSamples.x, this.mSamples.y,
				      first, first, first, first, count);
		},

		update: function (map) {
			this.updatePart(map, 0, this.samples.x.length);
		},

		drawPart: function (ctx, area, curveDrawer, first, last) {
			curveDrawer.drawBegin(ctx, area, this.lineWidth,
					      this.lineStyle, this.pointRadius);
			curveDrawer.drawPart(this.mSamples, first, last);
			curveDrawer.drawEnd();
		},

		draw: function (ctx, area, curveDrawer) {
			this.drawPart(ctx, area, curveDrawer,
				      0, this.samples.x.length - 1);
		}
	}
};

canvasPlot.area.p = Object.create(canvasPlot.point);
canvasPlot.area.p2 = Object.create(canvasPlot.point);

canvasPlot.map.area = Object.create(canvasPlot.area);
canvasPlot.map.xRange = Object.create(canvasPlot.range);
canvasPlot.map.yRange = Object.create(canvasPlot.range);
canvasPlot.map.tmpPoint = Object.create(canvasPlot.point);

canvasPlot.tic.p1 = Object.create(canvasPlot.point);
canvasPlot.tic.p2 = Object.create(canvasPlot.point);

canvasPlot.frame.area = Object.create(canvasPlot.area);
canvasPlot.frame.strokeArea = Object.create(canvasPlot.area);
canvasPlot.frame.innerArea = Object.create(canvasPlot.area);

canvasPlot.curve.samples = Object.create(canvasPlot.samples);
canvasPlot.curve.mSamples = Object.create(canvasPlot.samples);
