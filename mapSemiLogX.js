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

/*** Semi-log coordinate-mapping object with x logarithmic and y linear. ***/

canvasPlot.mapSemiLogX = Object.create(canvasPlot.map);

/* Private members. */
canvasPlot.mapSemiLogX.kx0 = NaN;
canvasPlot.mapSemiLogX.kx1 = NaN;
canvasPlot.mapSemiLogX.ky0 = NaN;
canvasPlot.mapSemiLogX.ky1 = NaN;

canvasPlot.mapSemiLogX.update = function (area) {
	this.kx1 = area.width / Math.log10(this.xRange.max / this.xRange.min);
	this.kx0 = area.p.x - 0.5;
	this.ky1 = -area.height / (this.yRange.max - this.yRange.min);
	this.ky0 = area.p2.y - this.ky1 * this.yRange.min - 0.5;
};

canvasPlot.mapSemiLogX.mapPoint = function (x, y, m) {
	m.x = this.kx0 + this.kx1 * Math.log10(x / this.xRange.min);
	m.y = this.ky0 + this.ky1 * y;
};

canvasPlot.mapSemiLogX.mapPoints = function (x, y, mx, my, xFirst, yFirst,
					     mxFirst, myFirst, count) {
	for (var i = 0; i < count; i++) {
		mx[mxFirst + i] = this.kx0
				  + this.kx1
				  * Math.log10(x[xFirst + i] / this.xRange.min);
		my[myFirst + i] = this.ky0 + this.ky1 * y[yFirst + i];
	}
};
