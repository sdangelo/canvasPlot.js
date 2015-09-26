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

/*** Plot curve holding frequency-domain magnitude data (in dBfs,
 *** WebAudio/AnalyserNode-based). ***/

canvasPlot.spectrumAnalyserSignal = Object.create(canvasPlot.curve);

/* Read/write WebAudio AnalyserNode. */
canvasPlot.spectrumAnalyserSignal.analyser = null;

/* Private members. */
canvasPlot.spectrumAnalyserSignal.super = canvasPlot.curve;
canvasPlot.spectrumAnalyserSignal.dataX = null;
canvasPlot.spectrumAnalyserSignal.dataY = null;
canvasPlot.spectrumAnalyserSignal.bins = 0;
canvasPlot.spectrumAnalyserSignal.first = 0;
canvasPlot.spectrumAnalyserSignal.count = 0;

canvasPlot.spectrumAnalyserSignal.init = function (samples, mSamples) {
	canvasPlot.superApply(this.super.init, this, arguments);

	this.dataX = new Float32Array(16384);
	this.dataY = new Float32Array(16384);

	for (var i = 0; i < this.dataX.length; i++)
		this.dataX[i] = NaN;
};

/* Call this after touching the analyser member. */
canvasPlot.spectrumAnalyserSignal.updateAnalyser = function () {
	var bins, fs;
	if (this.analyser) {
		bins = this.analyser.frequencyBinCount;
		fs = this.analyser.context.sampleRate;
	} else {
		bins = 0;
		fs = 0;
	}
	if (bins != canvasPlot.spectrumAnalyserSignal.bins) {
		var step = 0.5 * fs / bins;
		for (var i = 0; i < bins; i++)
			this.dataX[i] = step * i;
		for (; i < this.dataX.length; i++)
			this.dataX[i] = NaN;

		this.bins = bins;
	}
};

/* Gets data from the analyser node and coverts it to plot curve data.
 * If interpolate is not null, it must be a function that does interpolation.
 * In this case the interpolation is performed over the frequencies specified in
 * this.samples.x, where first is the index of the first sample to output and
 * count is the number of output samples to write. */
canvasPlot.spectrumAnalyserSignal.updateSamples = function (interpolate, first,
							    count) {
	if (!this.bins) {
		this.first = 0;
		this.count = 0;
		return;
	}

	this.analyser.getFloatFrequencyData(this.dataY);

	if (interpolate) {
		this.first = first;
		this.count = count;
		interpolate(this.dataX, this.dataY,
			    this.samples.x, this.samples.y,
			    0, first, this.bins, count);
	} else {
		this.first = 0;
		this.count = this.samples.x.length < this.bins
			     ? this.samples.x.length : this.bins;
		for (var i = 0; i < this.count; i++) {
			this.samples.x[i] = this.dataX[i];
			this.samples.y[i] = this.dataY[i];
		}
	}
};

canvasPlot.spectrumAnalyserSignal.updatePart = function (map, first, count) {
	if (first < this.first) {
		count -= this.first - first;
		first = this.first;
	}
	if (count > this.count)
		count = this.count;
	if (count > 0)
		canvasPlot.superApply(this.super.updatePart, this, arguments);
};

canvasPlot.spectrumAnalyserSignal.drawPart = function (ctx, area, curveDrawer,
						       first, last) {
	var next = this.first + this.count;
	if (first < this.first)
		first = this.first;
	if (last >= next)
		last = next - 1;
	if (last > first)
		canvasPlot.superApply(this.super.drawPart, this, arguments);
};
