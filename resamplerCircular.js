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

canvasPlot.resampler.processCircular = function (yIn, yOut, firstIn, firstOut,
						 countIn, rw) {
	rw.nextIn = firstIn;
	rw.firstOut = firstOut;
	rw.nextOut = firstOut;

	var lastIn = firstIn + countIn - 1;
	if (lastIn >= yIn.length)
		lastIn -= yIn.length;

	var inWrapped = false;
	var outWrapped = false;
	while (true) {
		var inCountEnd = yIn.length - rw.nextIn;
		var outCountEnd = yOut.length - rw.nextOut;

		var fi = rw.nextIn;
		var ci = inCountEnd < countIn ? inCountEnd : countIn;

		this.process(yIn, yOut, fi, rw.nextOut, ci, outCountEnd, rw);

		countIn -= rw.nextIn - fi;

		var no = rw.nextOut;
		if (rw.nextOut == yOut.length) {
			outWrapped = true;
			rw.nextOut = 0;
		}
		if (outWrapped && no > rw.firstOut)
			rw.firstOut = rw.nextOut;

		if (firstIn <= lastIn) {
			if (rw.nextIn > lastIn)
				break;
		} else {
			var ni = rw.nextIn;
			if (rw.nextIn >= yIn.length) {
				inWrapped = true;
				ni -= yIn.length;
			}
			if (inWrapped && ni > lastIn)
				break;
			rw.nextIn = ni;
		}
	}
}
