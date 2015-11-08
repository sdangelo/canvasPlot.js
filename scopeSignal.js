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

/*** Plot curve holding time-domain data (WebAudio/AnalyserNode-based). ***/

canvasPlot.scopeSignal = Object.create(canvasPlot.curve);

/* Trigger type definition. */
canvasPlot.scopeSignal.triggerType = {
	off:	0,
	up:	1,
	down:	2
};

/* Read/write members. */
canvasPlot.scopeSignal.analyser = null;	// WebAudio AnalyserNode
canvasPlot.scopeSignal.trigger = canvasPlot.scopeSignal.triggerType.off;
canvasPlot.scopeSignal.triggerLevel = NaN;

/* Private members. */
canvasPlot.scopeSignal.super = canvasPlot.curve;
canvasPlot.scopeSignal.data = null;
canvasPlot.scopeSignal.count = 0;
canvasPlot.scopeSignal.samplePeriod = NaN;
canvasPlot.scopeSignal.rw = { nextIn: NaN, nextOut: NaN };

canvasPlot.scopeSignal.init = function (samples, mSamples) {
	canvasPlot.superApply(this.super.init, this, arguments);

	this.data = new Float32Array(32768);

	for (var i = 0; i < this.data.length; i++)
		this.data[i] = NaN;
};

canvasPlot.scopeSignal.updateAnalyser = function () {
	if (this.analyser)
		this.samplePeriod = 1 / this.analyser.context.sampleRate;
	else
		this.samplePeriod = NaN;
};

canvasPlot.scopeSignal.updateSamples = function (time, resampler, points) {
	if (!this.analyser) {
		this.count = 0;
		return;
	}

	this.analyser.getFloatTimeDomainData(this.data);

	var i = 0;

	if (this.trigger == canvasPlot.scopeSignal.triggerType.up) {
		i = 1;
		for (; i < this.analyser.fftSize; i++)
			if (this.data[i] >= this.triggerLevel
			    && this.data[i - 1] < this.triggerLevel)
				break;
	} else if (this.trigger == canvasPlot.scopeSignal.triggerType.down) {
		i = 1;
		for (; i < this.analyser.fftSize; i++)
			if (this.data[i] <= this.triggerLevel
			    && this.data[i - 1] > this.triggerLevel)
				break;
	}

	if (resampler) {
		var timeStep = time / (points - 1);
		resampler.stepRatio =
			timeStep * this.analyser.context.sampleRate;
		resampler.update();
		if (i == 0) {
			resampler.offset = 0;
		} else {
			var iNext = i;
			i--;
			resampler.offset = (this.triggerLevel - this.data[i])
					   / (this.data[iNext] - this.data[i]);
		}
		if (points > this.samples.x.length)
			points = this.samples.x.length;
		resampler.process(this.data, this.samples.y, i, 0,
				  this.analyser.fftSize - i, points, this.rw);
		this.count = this.rw.nextOut;
		var t = 0;
		for (var j = 0; j < this.count; j++, t += timeStep)
			this.samples.x[j] = t;
	} else {
		var countMax = this.analyser.fftSize - i;
		if (countMax > this.samples.x.length)
			countMax = this.samples.x.length;
		var timeSamples =
			Math.ceil(time * this.analyser.context.sampleRate) + 1;
		if (countMax > timeSamples)
			countMax = timeSamples;

		var t = 0;
		this.count = 0;
		for (var j = 0; j < countMax;
		     i++, j++, t += this.samplePeriod, this.count++) {
			this.samples.x[j] = t;
			this.samples.y[j] = this.data[i];
		}
	}
};

canvasPlot.scopeSignal.updatePart = function (map, first, count) {
	if (count > this.count)
		count = this.count;
	if (count > 0)
		canvasPlot.superApply(this.super.updatePart, this, arguments);
};

canvasPlot.scopeSignal.drawPart = function (ctx, area, curveDrawer, first, last)
{
	if (last >= this.count)
		last = this.count - 1;
	if (last > first)
		canvasPlot.superApply(this.super.drawPart, this, arguments);
};
