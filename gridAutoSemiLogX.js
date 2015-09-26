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

/*** Automatic grid for semilogx maps. ***/

canvasPlot.gridAutoSemiLogX = Object.create(canvasPlot.grid);

/* Read/write members. */
canvasPlot.gridAutoSemiLogX.xRange = Object.create(canvasPlot.range);
canvasPlot.gridAutoSemiLogX.yRange = Object.create(canvasPlot.range);

/* Private member. */
canvasPlot.gridAutoSemiLogX.super = canvasPlot.grid;

canvasPlot.gridAutoSemiLogX.init = function (lines, xRange, yRange) {
	if (lines)
		this.lines = lines;
	else {
		this.lines = new Array(60);

		var xline = Object.create(canvasPlot.gridLine);
		xline.direction = canvasPlot.direction.vertical;
		var yline = Object.create(canvasPlot.gridLine);
		yline.direction = canvasPlot.direction.horizontal;

		for (var i = 0; i < 50; i++) {
			this.lines[i] = Object.create(xline);
			this.lines[i].init();
		}
		for (; i < 60; i++) {
			this.lines[i] = Object.create(yline);
			this.lines[i].init();
		}
	}

	this.xRange = xRange ? xRange : Object.create(this.xRange);
	this.yRange = yRange ? yRange : Object.create(this.yRange);
};

canvasPlot.gridAutoSemiLogX.update = function (map) {
	var s;
	var v1;
	var v2;
	if (this.xRange.min > 0) {
		s = 1;
		if (this.xRange.max > this.xRange.min) {
			v1 = this.xRange.max;
			v2 = this.xRange.min;
		} else {
			v1 = this.xRange.min;
			v2 = this.xRange.max;
		}
	} else {
		s = -1;
		if (this.xRange.max > this.xRange.min) {
			v1 = this.xRange.min;
			v2 = this.xRange.max;
		} else {
			v1 = this.xRange.max;
			v2 = this.xRange.min;
		}
	}

	var i = 0;
	if (v2 != 0) {
		var ratio = v1 / v2;
		if (ratio <= 1e5) {
			var step = s * Math.pow(10,
					Math.floor(Math.log10(s * v2)));
			var v = step * (Math.floor(v2 / step) + 1);
			var stepNext = 10 * step;
			for (; s * v < s * v1 && i < 50; i++) {
				this.lines[i].value = v;
				if (s * v >= s * stepNext) {
					step = stepNext;
					stepNext *= 10;
				}
				v += step;
			}
		} else {
			var l10step = ratio <= 1e10 ? 1
					: Math.floor(Math.log10(s * v1)) - 9;
			var step = Math.pow(10, l10step);
			var v = s * Math.pow(10, Math.floor(Math.log10(s * v2))
						  + l10step);
			for (; s * v < s * v1 && i < 50; i++) {
				this.lines[i].value = v;
				v *= step;
			}
		}
	}
	for (; i < 50; i++)
		this.lines[i].value = NaN;

	var min;
	var max;
	if (this.yRange.max > this.yRange.min) {
		min = this.yRange.min;
		max = this.yRange.max;
	} else {
		min = this.yRange.max;
		max = this.yRange.min;
	}
	var yStep = 0.1 * (max - min);
	order = Math.pow(10, Math.ceil(Math.log10(max - min)) - 1);
	yStep = Math.ceil(yStep / order) * order;

	v = yStep * (Math.floor(min / yStep) + 1);
	for (; v < max && i < 60; i++, v += yStep)
		this.lines[i].value = v;
	for (; i < 60; i++)
		this.lines[i].value = NaN;

	canvasPlot.superApply(this.super.update, this, arguments);
};
