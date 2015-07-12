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

/*** Prototype for resampler objects operating on uniformly-sampled
 *** signals. ***/

canvasPlot.resampler = {
	/* Read/write members. */
	stepRatio:	NaN,	// Input to output timestep ratio
	offset:		NaN,	// Time offset of first input sample w.r.t.
				// first output sample (i.e., t_in - t_out)

	init: function () {
	},

	/* Resets the resampler to its initial state (does not affect
	 * this.offset). */
	update: function () {
	},

	/* Does the resampling.
	 * Writes at most countOut samples in yOut starting from index firstOut,
	 * reading at most countIn samples from yIn starting from index firstIn.
	 * It also sets rw.nextOut to the first output sample index to be
	 * written by the next call, rw.nextIn to the first input sample index
	 * that the next call expects to read, and this.offset to the next input
	 * to output time offset.
	 * rw.nextOut and rw.nextIn are not necessarily within array index
	 * bounds and rw.nextIn is not necessarily consecutive to the last input
	 * sample. */
	process: function (yIn, yOut, firstIn, firstOut, countIn, countOut,
			   rw) {
		rw.nextIn = firstIn;
		rw.nextOut = firstOut;
	}
};
