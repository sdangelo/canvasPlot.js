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

/*** Simplified plotting API (one map, one frame, one grid, many curves) ***/

canvasPlot.simplePlot = {
	/* Read/write members. */
	map:	null,
	frame:	null,	// Can be null
	grid:	null,	// Can bel null
	curves:	null,	// Array of curve objects, can be null

	init: function (map, frame, grid, curves) {
		if (frame)
			this.frame = frame;
		else {
			this.frame = Object.create(this.frame);
			this.frame.init(null);
		}

		if (map)
			this.map = map;
		else {
			this.map = Object.create(this.map);
			this.map.init(null, null);
		}

		if (grid)
			this.grid = grid;
		else {
			this.grid = Object.create(this.grid);
			this.grid.init(null);
		}

		this.curves = curves ? curves : [];
	},

	/* updateFrameArea tells whether to update the area member of frame. */
	update: function (updateFrameArea, updateMap) {
		if (updateFrameArea)
			this.frame.area.update();
		if (this.frame)
			this.frame.update();
		this.map.update(this.frame.innerArea);
		if (this.grid)
			this.grid.update(this.map);
		if (this.curves)
			for (var i = 0; i < this.curves.length; i++)
				this.curves[i].update(this.map);
	},

	/* curveDrawer is the curve-drawing object. */
	draw: function (ctx, curveDrawer) {
		if (this.grid)
			this.grid.draw(ctx, this.frame.innerArea);
		if (this.curves)
			for (var i = 0; i < this.curves.length; i++)
				this.curves[i].draw(ctx, this.frame.innerArea,
						    curveDrawer);
		if (this.frame)
			this.frame.draw(ctx);
	}
};

/* The necessary bookkepping. */

canvasPlot.simplePlot.map = Object.create(canvasPlot.map);
canvasPlot.simplePlot.frame = Object.create(canvasPlot.frame);
canvasPlot.simplePlot.grid = Object.create(canvasPlot.grid);
