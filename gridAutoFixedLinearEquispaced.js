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

/*** Automatic fixed grid with equispaced lines for linear maps. ***/

canvasPlot.gridAutoFixedLinearEquispaced = Object.create(canvasPlot.grid);

/* Read/write members. */
canvasPlot.gridAutoFixedLinearEquispaced.xRange =
	Object.create(canvasPlot.range);
canvasPlot.gridAutoFixedLinearEquispaced.yRange =
	Object.create(canvasPlot.range);
canvasPlot.gridAutoFixedLinearEquispaced.xLines = 9;
canvasPlot.gridAutoFixedLinearEquispaced.yLines = 9;

/* Private member. */
canvasPlot.gridAutoFixedLinearEquispaced.super = canvasPlot.grid;

canvasPlot.gridAutoFixedLinearEquispaced.init = function (lines, xRange, yRange)
{
	if (lines)
		this.lines = lines;
	else {
		this.lines = new Array(this.xLines + this.yLines);

		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i] = Object.create(canvasPlot.gridLine);
			this.lines[i].init();
		}
	}

	this.xRange = xRange ? xRange : Object.create(this.xRange);
	this.yRange = yRange ? yRange : Object.create(this.yRange);
};

canvasPlot.gridAutoFixedLinearEquispaced.update = function (map) {
	var min;
	var max;
	if (this.xRange.max > this.xRange.min) {
		min = this.xRange.min;
		max = this.xRange.max;
	} else {
		min = this.xRange.max;
		max = this.xRange.min;
	}
	var xStep = (max - min) / (this.xLines + 1);
	var v = min + xStep;
	for (var i = 0; v < max && i < this.xLines; i++, v += xStep) {
		this.lines[i].direction = canvasPlot.direction.vertical;
		this.lines[i].value = v;
	}

	if (this.yRange.max > this.yRange.min) {
		min = this.yRange.min;
		max = this.yRange.max;
	} else {
		min = this.yRange.max;
		max = this.yRange.min;
	}
	var yStep = (max - min) / (this.yLines + 1);
	var v = min + yStep;
	var next = this.xLines + this.yLines;
	for (; v < max && i < next; i++, v += yStep) {
		this.lines[i].direction = canvasPlot.direction.horizontal;
		this.lines[i].value = v;
	}

	for (; i < this.lines.length; i++)
		this.lines[i].value = v;

	canvasPlot.superApply(this.super.update, this, arguments);
};
