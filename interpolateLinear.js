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

/* Does simple linear interpolation.
 * Writes countOut samples in yi starting from index firstOut, reading countIn
 * samples from y starting from index firstIn. x represents input x coordinates,
 * xi represents output x coordinates. Both x and xi are expected to be ordered
 * and non-decreasing. It produces NaNs for xi coordinates outside of x ranges
 * (i.e., no extrapolation is performed). */
canvasPlot.interpolateLinear = function (x, y, xi, yi, firstIn, firstOut,
					 countIn, countOut) {
	var i = firstOut;
	var nextOut = firstOut + countOut;

	for (; i < nextOut && xi[i] < x[firstIn]; i++)
		yi[i] = NaN;

	var j = firstIn + 1;
	var lastIn = firstIn + countIn - 1;
outer:
	for (; i < nextOut; i++) {
		while (xi[i] >= x[j]) {
			j++;
			if (j == lastIn) {
				yi[i] = xi[i] == x[j] ? y[j] : NaN;
				i++;
				break outer;
			}
		}
		var jl = j - 1;
		yi[i] = y[jl] + (y[j] - y[jl]) * (xi[i] - x[jl])
					       / (x[j] - x[jl]);
	}

	for (; i < nextOut; i++)
		yi[i] = NaN;
};
