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

/* Circular-array-based resampling API. */

/* Analogous of canvasPlot.resampler.process() for circular arrays.
 * Writes as many samples as needed to the circular array yOut starting from
 * index firstOut.
 * Reads at most countIn samples from the circular array yIn starting from index
 * firstIn.
 * It also sets rw.nextOut to the first output sample index to be written by
 * the next call, rw.firstOut to the first output sample that was not
 * overwritten, rw.writtenOut to the total number of output samples that were
 * written, rw.nextIn to the first input sample index that the next call expects
 * to read, rw.readIn to the total number of input samples that were read, and
 * this.offset to the next input to output time offset.
 * rw.nextOut and rw.nextIn are within array index but rw.nextIn is not
 * necessarily consecutive to the last input sample that was read. */
canvasPlot.resampler.processCircular = function (yIn, yOut, firstIn, firstOut,
						 countIn, rw) {
	rw.nextIn = firstIn;
	rw.readIn = 0;
	rw.firstOut = firstOut;
	rw.nextOut = firstOut;
	rw.writtenOut = 0;

	var outWrapped = false;
	while (countIn > 0) {
		var inCountEnd = yIn.length - rw.nextIn;
		var outCountEnd = yOut.length - rw.nextOut;

		var fi = rw.nextIn;
		var fo = rw.nextOut;
		var ci = inCountEnd < countIn ? inCountEnd : countIn;

		this.process(yIn, yOut, fi, fo, ci, outCountEnd, rw);

		var c = rw.nextIn - fi;
		rw.readIn += c;
		rw.writtenOut += rw.nextOut - fo;
		countIn -= c;

		if (rw.nextOut == yOut.length) {
			outWrapped = true;
			rw.nextOut = 0;
		}
		if (outWrapped && rw.nextOut > rw.firstOut)
			rw.firstOut = rw.nextOut;

		if (rw.nextIn >= yIn.length)
			rw.nextIn %= yIn.length;
	}
}
