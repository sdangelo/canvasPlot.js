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

/*** Automatic grid for linear maps. ***/

canvasPlot.gridAutoLinear = Object.create(canvasPlot.grid);

/* Read/write members. */
canvasPlot.gridAutoLinear.xRange = Object.create(canvasPlot.range);
canvasPlot.gridAutoLinear.yRange = Object.create(canvasPlot.range);

/* Private member. */
canvasPlot.gridAutoLinear.super = canvasPlot.grid;

canvasPlot.gridAutoLinear.init = function (lines, xRange, yRange) {
	if (lines)
		this.lines = lines;
	else {
		this.lines = new Array(20);

		var xline = Object.create(canvasPlot.gridLine);
		xline.direction = canvasPlot.direction.vertical;
		var yline = Object.create(canvasPlot.gridLine);
		yline.direction = canvasPlot.direction.horizontal;

		for (var i = 0; i < 10; i++) {
			this.lines[i] = Object.create(xline);
			this.lines[i].init();
		}
		for (; i < 20; i++) {
			this.lines[i] = Object.create(yline);
			this.lines[i].init();
		}
	}

	this.xRange = xRange ? xRange : Object.create(this.xRange);
	this.yRange = yRange ? yRange : Object.create(this.yRange);
};

canvasPlot.gridAutoLinear.update = function (map) {
	var min;
	var max;
	if (this.xRange.max > this.xRange.min) {
		min = this.xRange.min;
		max = this.xRange.max;
	} else {
		min = this.xRange.max;
		max = this.xRange.min;
	}
	var xStep = 0.1 * (max - min);
	var order = Math.pow(10, Math.ceil(Math.log10(max - min)) - 1);
	xStep = Math.ceil(xStep / order) * order;

	var v = xStep * (Math.floor(min / xStep) + 1);
	for (var i = 0; v < max && i < 10; i++, v += xStep)
		this.lines[i].value = v;
	for (; i < 10; i++)
		this.lines[i].value = NaN;

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
	for (; v < max && i < 20; i++, v += yStep)
		this.lines[i].value = v;
	for (; i < 20; i++)
		this.lines[i].value = NaN;

	canvasPlot.superApply(this.super.update, this, arguments);
};
