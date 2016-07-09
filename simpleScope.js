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

/*** Simplified WebAudio-based oscilloscope plot API. ***/

canvasPlot.simpleScope = {
	/* Read/write members. */
	frame:			null,
	signals:		null,	// Array of spectrumAnalyserSignal objects
	yRange:			null,
	time:			NaN,	// Total time (horizontal) in seconds
	showGrid:		true,	// true for showing grid, false for the
					// opposite
	resampler:		null,	// Resampler object or null
	resamplerPoints:	NaN,	// Number of output points
	ticLineWidth:		1,
	ticLineStyle:		"#ccc",

	/* Read-only */
	plot:		null,	// The actual "output object" for drawing

	/* Private */
	xRange:		null,
	gridFixed:	null,
	gridNull:	null,

	init: function (frame, signals, yRange) {
		if (frame)
			this.frame = frame;
		else {
			this.frame = Object.create(this.frame);
			this.frame.init(null);
		}

		this.signals = signals ? signals : [];

		this.xRange = Object.create(this.xRange);
		this.yRange = yRange ? yRange : Object.create(this.yRange);

		var map = Object.create(canvasPlot.mapLinear);
		map.init(this.xRange, this.yRange);

		this.gridFixed = Object.create(this.gridFixed);
		this.gridFixed.init(null, this.xRange, this.yRange);

		this.gridNull = Object.create(this.gridNull);
		this.gridNull.init(null);

		this.plot = Object.create(this.plot);
		this.plot.init(map, this.frame, this.gridNull, this.signals);
	},

	/* updateFrameArea tells whether to update the area member of frame. */
	update: function (updateFrameArea) {
		this.plot.grid = this.showGrid ? this.gridFixed : this.gridNull;

		if (isFinite(this.time))
			this.xRange.max = this.time;

		this.plot.curves = this.signals;
		this.plot.update(updateFrameArea);
	},

	/* This actually updates signal data. */
	updateSignals: function () {
		for (var i = 0; i < this.signals.length; i++) {
			this.signals[i].updateSamples(this.time, this.resampler,
						      this.resamplerPoints);
			this.signals[i].update(this.plot.map);
		}
	},

	draw: function (ctx, curveDrawer) {
		this.plot.draw(ctx, curveDrawer);
	}
};

/* The necessary bookkepping. */

canvasPlot.simpleScope.frame =
	Object.create(canvasPlot.frameOffscreen);

canvasPlot.simpleScope.xRange = Object.create(canvasPlot.range);
canvasPlot.simpleScope.yRange = Object.create(canvasPlot.range);
canvasPlot.simpleScope.xRange.min = 0.0;
canvasPlot.simpleScope.xRange.max = 0.05;
canvasPlot.simpleScope.yRange.min = -1.0;
canvasPlot.simpleScope.yRange.max = 1.0;

canvasPlot.simpleScope.gridFixed
	= Object.create(canvasPlot.gridAutoFixedLinearEquispacedOffscreen);
canvasPlot.simpleScope.gridNull = Object.create(canvasPlot.grid);

canvasPlot.simpleScope.plot = Object.create(canvasPlot.simplePlotOffscreen);
