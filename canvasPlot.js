/*
 * Copyright (C) 2015, 2016 Stefano D'Angelo <zanga.mail@gmail.com>
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

/*** Core API. ***/

var canvasPlot = {

	/* Basic self-explaining definitions. */

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

	/* Now we need to talk a little bit about these...
	 *
	 * Here we use prototype inheritance heavily. If you are not familiar
	 * with it, go study it first before using this library.
	 *
	 * From the outside, object members can be read/write, read-only or
	 * private.
	 *
	 * init() functions are meant to create the members of an object, but
	 * not to initialize it. They often accept parameters for the user to
	 * supply himself said members if he prefers to do so.
	 *
	 * update() functions update read-only and private members using current
	 * read/write member values and supplied arguments.
	 *
	 * draw() functions always require a ctx argument, which is the drawing
	 * context.
	 *
	 * Usually the usage pattern is like:
	 *  1. create a new object using Object.create();
	 *  2. init() the object;
	 *  3. setup the object by writing read/write members;
	 *  4. update();
	 *  5. do something with the object (e.g., draw());
	 *  6. repeat 3 and 4, and/or 5 ad libitum.
	 */

	/* Set of samples. */
	samples: {
		/* Read/write coordinates. They are meant to be two arrays
		 * of same length. */
		x:	null,
		y:	null,

		init: function (x, y) {
			this.x = x ? x : [];
			this.y = y ? y : [];
		}
	},

	/* Rectangular area. */
	area: {
		/* Read/write members. */
		p:	null,	// Top-left point (inside the area)
		width:	NaN,
		height: NaN,

		/* Read-only. */
		p2:	null,	// Bottom-right point (outside the area)

		init: function (p) {
			this.p = p ? p : Object.create(this.p);
			this.p2 = Object.create(this.p2);
		},

		update: function () {
			this.p2.x = this.p.x + this.width;
			this.p2.y = this.p.y + this.height;
		},

		/* Whether the area contains the point (x, y). lx, tx, rx, and
		 * bx are, respectively, extra left, top, right, and bottom
		 * margins. */
		contains: function (x, y, lx, tx, rx, bx) {
			return x >= (this.p.x - lx) && x < (this.p2.x + rx)
			       && y >= (this.p.y - tx) && y < (this.p2.y + bx);
		}
	},

	/* Prototype for coordinate-mapping objects. */
	map: {
		/* Read/write input ranges. */
		xRange:		null,
		yRange:		null,

		init: function (xRange, yRange) {
			this.xRange = xRange ? xRange
					     : Object.create(this.xRange);
			this.yRange = yRange ? yRange
					     : Object.create(this.yRange);
		},

		/* area is the output rectangular area. */
		update: function (area) {
		},

		/* Stores into m the mapping of the point with input coordinates
		 * (x, y). */
		mapPoint: function (x, y, m) {
			m.x = NaN;
			m.y = NaN;
		},

		/* Maps the points with input coordinates stored into the arrays
		 * x and y, and writes the output coordinates into the mx and my
		 * arrays.
		 * xFirst, yFirst, mxFirst, and myFirst represent the indices of
		 * the first coordinate to map for each array.
		 * count is the number of points to map. */
		mapPoints: function (x, y, mx, my, xFirst, yFirst,
				     mxFirst, myFirst, count) {
			for (var i = 0; i < count; i++) {
				mx[mxFirst + i] = NaN;
				my[myFirst + i] = NaN;
			}
		}
	},

	/* Plot frame. */
	frame: {
		/* Read/write members. */
		area:		null,	// Area delimiting the frame
		borderWidth:	2,	// Drawing context lineWidth
		borderStyle:	"#000", // Drawing context strokeStyle

		/* Read-only members. */
		strokeArea:	null,	// area shrinked by half the borderWidth
		innerArea:	null,	// area shrinked by the borderWidth

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

	/* Grid line. */
	gridLine: {
		/* Read/write members. */
		value:		NaN,	// Non-mapped value
		direction:	NaN,	
		lineWidth:	1,	// Drawing context lineWidth
		lineStyle:	"#ccc",	// Drawing context strokeStyle

		/* Read-only members. */
		toDraw:		false,	// Whether the line has to be drawn
		p1:		null,	// Start drawing point
		p2:		null,	// End drawing point

		init: function () {
			this.p1 = Object.create(this.p1);
			this.p2 = Object.create(this.p2);
		},

		/* map is the coordinate-mapping object. */
		update: function (map) {
			if (map.xRange.min == map.xRange.max
			    || map.yRange.min == map.yRange.max) {
				this.toDraw = false;
			} else if (this.direction == 1) // direction.horizontal
			{
				var min;
				var max;
				if (map.yRange.max > map.yRange.min) {
					min = map.yRange.min;
					max = map.yRange.max;
				} else {
					min = map.yRange.max;
					max = map.yRange.min;
				}
				if (this.value >= min && this.value <= max) {
					map.mapPoint(map.xRange.min, this.value,
						     this.p1);
					map.mapPoint(map.xRange.max, this.value,
						     this.p2);
					this.toDraw = true;
				} else
					this.toDraw = false;
			} else if (this.direction == 2) // direction.vertical
			{
				var min;
				var max;
				if (map.xRange.max > map.xRange.min) {
					min = map.xRange.min;
					max = map.xRange.max;
				} else {
					min = map.xRange.max;
					max = map.xRange.min;
				}
				if (this.value >= min && this.value <= max) {
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

		/* area is the drawing area. */
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

	/* Plot grid. */
	grid: {
		/* Read/write array of lines that make the grid. */
		lines:	null,

		/* Read-only members. */
		toDraw:	false,	// Whether there is any line to draw

		init: function (lines) {
			this.lines = lines ? lines : [];
		},

		/* map is the coordinate-mapping object. */
		update: function (map) {
			this.toDraw = false;
			for (var i = 0; i < this.lines.length; i++) {
				this.lines[i].update(map);
				this.toDraw = this.toDraw
					      || this.lines[i].toDraw;
			}
		},

		/* area is the drawing area. */
		draw: function (ctx, area) {
			if (this.toDraw)
				for (var i = 0; i < this.lines.length; i++)
					this.lines[i].draw(ctx, area);
		},
	},

	/* Prototype for curve-drawing objects. */
	curveDrawer: {
		/* Begins drawing a curve.
		 * ctx is the drawing context.
		 * area is the drawing area.
		 * lineWidth is the drawing context lineWidth.
		 * lineStyle is the drawing context strokeStyle.
		 * pointRadius is the radius of isolated points. */
		drawBegin: function (ctx, area, lineWidth, lineStyle,
				     pointRadius) {
		},

		/* Draws part of a curve.
		 * mSamples is a sample object containing mapped coordinates.
		 * first is the index of the first sample to draw.
		 * last is the index of the last sample to draw. */
		drawPart: function (mSamples, first, last) {
		},

		/* Ends drawing a curve. */
		drawEnd: function () {
		}
	},

	/* Curve. */
	curve: {
		/* Read/write members. */
		samples:	null,	// sample object containing non-mapped
					// coordinates
		mSamples:	null,	// sample object containing mapped
					// coordinates
		lineWidth:	2,	// Drawing context lineWidth
		lineStyle:	"#0f0",	// Drawing context strokeStyle
		pointRadius:	4,	// Radius of isolated points

		init: function (samples, mSamples) {
			this.samples = samples ? samples
					       : Object.create(this.samples);
			this.mSamples = mSamples ? mSamples
					       : Object.create(this.mSamples);
			if (samples && !mSamples) {
				this.mSamples.init(
					new Array(this.samples.x.length),
					new Array(this.samples.y.length));
			} else if (!samples && mSamples) {
				this.samples.init(
					new Array(this.mSamples.x.length),
					new Array(this.mSamples.y.length));
			} else if (!samples && !mSamples) {
				this.samples.init(null, null);
				this.mSamples.init(null, null);
			}
		},

		/* Updates part of the curve.
		 * map is the coordinate-mapping object.
		 * first is the index of the first sample to update.
		 * count is the number of samples to update. */
		updatePart: function (map, first, count) {
			map.mapPoints(this.samples.x, this.samples.y,
				      this.mSamples.x, this.mSamples.y,
				      first, first, first, first, count);
		},

		/* map is the coordinate-mapping object. */
		update: function (map) {
			this.updatePart(map, 0, this.samples.x.length);
		},

		/* Draws part of the curve.
		 * ctx is the drawing context.
		 * area is the drawing area.
		 * curveDrawer is the curve-drawing object.
		 * first is the index of the first sample to draw.
		 * last is the index of the last sample to draw. */
		drawPart: function (ctx, area, curveDrawer, first, last) {
			curveDrawer.drawBegin(ctx, area, this.lineWidth,
					      this.lineStyle, this.pointRadius);
			curveDrawer.drawPart(this.mSamples, first, last);
			curveDrawer.drawEnd();
		},

		/* area is the drawing area.
		 * curveDrawer is the curve-drawing object. */
		draw: function (ctx, area, curveDrawer) {
			this.drawPart(ctx, area, curveDrawer,
				      0, this.samples.x.length - 1);
		}
	}
};

/* The necessary bookkepping. */

canvasPlot.area.p = Object.create(canvasPlot.point);
canvasPlot.area.p2 = Object.create(canvasPlot.point);

canvasPlot.map.area = Object.create(canvasPlot.area);
canvasPlot.map.xRange = Object.create(canvasPlot.range);
canvasPlot.map.yRange = Object.create(canvasPlot.range);
canvasPlot.map.tmpPoint = Object.create(canvasPlot.point);

canvasPlot.gridLine.p1 = Object.create(canvasPlot.point);
canvasPlot.gridLine.p2 = Object.create(canvasPlot.point);

canvasPlot.frame.area = Object.create(canvasPlot.area);
canvasPlot.frame.strokeArea = Object.create(canvasPlot.area);
canvasPlot.frame.innerArea = Object.create(canvasPlot.area);

canvasPlot.curve.samples = Object.create(canvasPlot.samples);
canvasPlot.curve.mSamples = Object.create(canvasPlot.samples);
