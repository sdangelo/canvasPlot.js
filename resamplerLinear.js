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
canvasPlot.resamplerLinear.offset = NaN;

canvasPlot.resamplerLinear.update = function () {
	this.prev = NaN;
	this.offset = 0.0;
};

canvasPlot.resamplerLinear.process = function (yIn, yOut, firstIn, firstOut,
					       countIn, countOut, rw) {
	var lastIn = firstIn + countIn - 1;
	var lastOut = firstOut + countOut - 1;
	var j = firstOut;

	var d = yIn[firstIn] - this.prev;
	for (; this.offset < 0.0 && j <= lastOut;
	     this.offset += this.stepRatio, j++)
		yOut[j] = yIn[firstIn] + this.offset * d;

	if (this.offset == 0.0 && j <= lastOut) {
		yOut[j] = yIn[firstIn];
		this.offset += this.stepRatio;
		j++;
	}

	var i = firstIn + this.offset;
	var il = -1;  // force update on first run
	var ih;
	for (; i <= lastIn && j <= lastOut; i += this.stepRatio, j++) {
		var ix = i - il;
		if (ix > 1.0) {
			ih = Math.ceil(i);
			il = ih - 1;
			ix = i - il;
			d = yIn[ih] - yIn[il];
		}
		yOut[j] = yIn[il] + ix * d;
	}

	rw.nextOut = j;
	rw.nextIn = Math.floor(i);
	if (rw.nextIn <= lastIn) {
		this.prev = yIn[rw.nextIn];
		rw.nextIn++;
	}
	this.offset = i - rw.nextIn;
};
