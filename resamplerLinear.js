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

canvasPlot.resamplerLinear = Object.create(canvasPlot.resampler);

canvasPlot.resamplerLinear.prev = NaN;
canvasPlot.resamplerLinear.offset = 0.0;

canvasPlot.resamplerLinear.update = function () {
	this.prev = NaN;
	this.offset = 0.0;
};

canvasPlot.resamplerLinear.process = function (yIn, yOut, firstIn, firstOut,
					       countIn, countOut, rw) {
	var j = firstOut;

	var lastIn = firstIn + countIn;
	var lastOut = j + countOut;

	var d = yIn[firstIn] - this.prev;
	for (; this.offset < 0.0 && j < lastOut;
	     this.offset += this.timeStepRatio, j++)
		yOut[j] = yIn[firstIn] + this.offset * d;

	var i = firstIn + this.offset;
	var il = Math.floor(i);
	var il1 = il - 1;
	for (; i < lastIn && j < lastOut; i += this.timeStepRatio, j++) {
		var ix = i - il;
		if (ix >= 1.0) {
			il = Math.floor(i);
			il1 = il - 1;
			ix = i - il;
		}
		yOut[j] = yIn[il1] + ix * (yIn[il] - yIn[il1]);
	}

	rw.nextOut = j;
	rw.nextIn = Math.floor(i);
	if (i < lastIn) {
		this.prev = yIn[rw.nextIn];
		rw.nextIn += 1;
	}
	this.offset = i - rw.nextIn;
};
