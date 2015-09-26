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

/*** Simplified WebAudio-based spectrum analyser plot API. ***/

canvasPlot.simpleSpectrumAnalyser = {
	/* Read/write members. */
	frame:		null,
	signals:	null,	// Array of spectrumAnalyserSignal objects
	xRange:		null,
	yRange:		null,
	linearMap:	false,	// true for linear map, false for semilogx map
	showGrid:	true,	// true for showing grid, false for the opposite
	interpolate:	null,	// Interpolation function or null
	points:		NaN,	// Number of interpolated points per signal
	ticLineWidth:	1,
	ticLineStyle:	"#ccc",

	/* Read-only */
	plot:		null,	// The actual "output object" for drawing

	/* Private */
	mapSemiLogX:	null,
	mapLinear:	null,
	gridSemiLogX:	null,
	gridLinear:	null,
	gridNull:	null,

	init: function (frame, signals, xRange, yRange) {
		if (frame)
			this.frame = frame;
		else {
			this.frame = Object.create(this.frame);
			this.frame.init(null);
		}

		this.signals = signals ? signals : [];

		this.xRange = xRange ? xRange : Object.create(this.xRange);
		this.yRange = yRange ? yRange : Object.create(this.yRange);

		this.mapSemiLogX = Object.create(this.mapSemiLogX);
		this.mapSemiLogX.init(this.xRange, this.yRange);

		this.gridSemiLogX = Object.create(this.gridSemiLogX);
		this.gridSemiLogX.init(null, this.xRange, this.yRange);

		this.mapLinear = Object.create(this.mapLinear);
		this.mapLinear.init(this.xRange, this.yRange);

		this.gridLinear = Object.create(this.gridLinear);
		this.gridLinear.init(null, this.xRange, this.yRange);

		this.gridNull = Object.create(this.gridNull);
		this.gridNull.init(null);

		this.plot = Object.create(this.plot);
		this.plot.init(this.mapSemiLogX, this.frame, this.gridSemiLogX,
			       this.signals);
	},

	/* updateFrameArea tells whether to update the area member of frame. */
	update: function (updateFrameArea) {
		if (this.linearMap) {
			this.plot.map = this.mapLinear;
			this.plot.grid = this.showGrid ? this.gridLinear
						       : this.gridNull;
		} else {
			this.plot.map = this.mapSemiLogX;
			this.plot.grid = this.showGrid ? this.gridSemiLogX
						       : this.gridNull;
		}

		function fillLinear(x, min, max, points) {
			if (max > min) {
				var step = (max - min) / (points - 1);
				var v = min;
			} else {
				var step = (min - max) / (points - 1);
				var v = max;
			}
			for (var i = 0; i < points; i++, v += step)
				x[i] = v;
		};

		function fillLogarithmic(x, min, max, points) {
			fillLinear(x, Math.log10(min), Math.log10(max), points);
			for (var i = 0; i < points; i++)
				x[i] = Math.pow(10, x[i]);
		};

		if (this.interpolate) {
			var f = this.linearMap ? fillLinear : fillLogarithmic;
			for (var i = 0; i < this.signals.length; i++) {
				var p = this.points
					< this.signals[i].samples.x.length
					? this.points
					: this.signals[i].samples.x.length;
				f(this.signals[i].samples.x,
				  this.xRange.min, this.xRange.max, p);
			}
		}

		this.plot.curves = this.signals;
		this.plot.update(updateFrameArea);
	},

	/* This actually updates signal data. */
	updateSignals: function () {
		for (var i = 0; i < this.signals.length; i++) {
			var p = this.points
				< this.signals[i].samples.x.length
				? this.points
				: this.signals[i].samples.x.length;
			this.signals[i].updateSamples(this.interpolate, 0, p);
			this.signals[i].update(this.plot.map);
		}
	},

	draw: function (ctx, curveDrawer) {
		this.plot.draw(ctx, curveDrawer);
	}
};

/* The necessary bookkepping. */

canvasPlot.simpleSpectrumAnalyser.frame =
	Object.create(canvasPlot.frameOffscreen);

canvasPlot.simpleSpectrumAnalyser.xRange = Object.create(canvasPlot.range);
canvasPlot.simpleSpectrumAnalyser.yRange = Object.create(canvasPlot.range);
canvasPlot.simpleSpectrumAnalyser.xRange.min = 20.0;
canvasPlot.simpleSpectrumAnalyser.xRange.max = 20000.0;
canvasPlot.simpleSpectrumAnalyser.yRange.min = -100.0;
canvasPlot.simpleSpectrumAnalyser.yRange.max = 0.0;

canvasPlot.simpleSpectrumAnalyser.mapSemiLogX =
	Object.create(canvasPlot.mapSemiLogX);
canvasPlot.simpleSpectrumAnalyser.mapLinear =
	Object.create(canvasPlot.mapLinear);

canvasPlot.simpleSpectrumAnalyser.gridSemiLogX =
	Object.create(canvasPlot.gridAutoSemiLogXOffscreen);
canvasPlot.simpleSpectrumAnalyser.gridLinear =
	Object.create(canvasPlot.gridAutoLinearOffscreen);
canvasPlot.simpleSpectrumAnalyser.gridNull =
	Object.create(canvasPlot.grid);

canvasPlot.simpleSpectrumAnalyser.plot =
	Object.create(canvasPlot.simplePlotOffscreen);
