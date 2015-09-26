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

/*** Widget-style object for the simplified plotting API.
 ***
 *** The plot automatically fills the given canvas element, and the canvas
 *** element itself is stretched to the avaiable size of its parent, within
 *** the limits of the given width to height ratio, if specified.
 ***/

canvasPlot.simplePlotWidget = {
	/* Read/write members. */
	curveDrawer:	null,
	ratio:		null,
	plot:		null,

	/* Read-only members. */
	canvas:		null,
	ctx:		null,

	init: function (canvas, map, frame, grid, curves, curveDrawer) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.plot = Object.create(this.plot);
		this.plot.init(map, frame, grid, curves);

		this.curveDrawer = curveDrawer ? curveDrawer
					: Object.create(this.curveDrawer);

		this.plot.frame.area.p.x = 0;
		this.plot.frame.area.p.y = 0;

		var self = this;
		function resize() {
			canvasPlot.canvasStretch(self.canvas, self.ratio);

			self.plot.frame.area.width = self.canvas.width;
			self.plot.frame.area.height = self.canvas.height;

			self.update(true);

			self.draw();
		}
		resize();
		window.addEventListener("resize", resize);
	},

	/* updateFrameArea tells whether to update the area member of
	 * plot.frame. */
	update: function (updateFrameArea) {
		this.plot.update(updateFrameArea);
	},

	draw: function () {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.plot.draw(this.ctx, this.curveDrawer);
	}
};

/* The necessary bookkepping. */

canvasPlot.simplePlotWidget.curveDrawer = Object.create(canvasPlot.curveDrawer);
canvasPlot.simplePlotWidget.plot = Object.create(canvasPlot.simplePlot);
