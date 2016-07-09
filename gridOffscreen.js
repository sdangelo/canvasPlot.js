/*
 * Copyright (C) 2015, 2016 Stefano D'Angelo <zanga.mail@gmail.com>
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

/*** Offscreen-rendered plot grid object. ***/

canvasPlot.gridOffscreen = Object.create(canvasPlot.grid);

/* Private members. */
canvasPlot.gridOffscreen.super = canvasPlot.grid;
canvasPlot.gridOffscreen.canvas = null;
canvasPlot.gridOffscreen.area = Object.create(canvasPlot.area);
canvasPlot.gridOffscreen.offsetX = NaN;
canvasPlot.gridOffscreen.offsetY = NaN;

canvasPlot.gridOffscreen.init = function (lines) {
	canvasPlot.superApply(this.super.init, this, arguments);
	this.canvas = document.createElement("canvas");
	this.area = Object.create(this.area);
	this.area.init(null);
};

canvasPlot.gridOffscreen.update = function (map) {
	canvasPlot.superApply(this.super.update, this, arguments);

	if (!this.toDraw)
		return;

	var minX = Infinity;
	var minY = Infinity;
	var maxX = -Infinity;
	var maxY = -Infinity;
	var maxLineWidth = 0;
	for (var i = 0; i < this.lines.length; i++) {
		if (!this.lines[i].toDraw)
			continue;
		if (this.lines[i].p1.x < minX)
			minX = this.lines[i].p1.x;
		if (this.lines[i].p1.x > maxX)
			maxX = this.lines[i].p1.x;
		if (this.lines[i].p1.y < minY)
			minY = this.lines[i].p1.y;
		if (this.lines[i].p1.y > maxY)
			maxY = this.lines[i].p1.y;
		if (this.lines[i].p2.x < minX)
			minX = this.lines[i].p2.x;
		if (this.lines[i].p2.x > maxX)
			maxX = this.lines[i].p2.x;
		if (this.lines[i].p2.y < minY)
			minY = this.lines[i].p2.y;
		if (this.lines[i].p2.y > maxY)
			maxY = this.lines[i].p2.y;
		if (this.lines[i].lineWidth > maxLineWidth)
			maxLineWidth = this.lines[i].lineWidth;
	}
	minX -= maxLineWidth;
	minY -= maxLineWidth;
	maxX += maxLineWidth;
	maxY += maxLineWidth;

	this.offsetX = Math.floor(minX);
	this.offsetY = Math.floor(minY);

	this.area.p.x = minX - this.offsetX;
	this.area.p.y = minY - this.offsetY;
	this.area.width = maxX - minX;
	this.area.height = maxY - minY;
	this.area.update();

	this.canvas.width = Math.ceil(this.area.p2.x);
	this.canvas.height = Math.ceil(this.area.p2.y);
	var ctx = this.canvas.getContext("2d");

	for (var i = 0; i < this.lines.length; i++) {
		if (!this.lines[i].toDraw)
			continue;

		var oldX1 = this.lines[i].p1.x;
		var oldY1 = this.lines[i].p1.y;
		var oldX2 = this.lines[i].p2.x;
		var oldY2 = this.lines[i].p2.y;

		this.lines[i].p1.x -= this.offsetX;
		this.lines[i].p1.y -= this.offsetY;
		this.lines[i].p2.x -= this.offsetX;
		this.lines[i].p2.y -= this.offsetY;

		this.lines[i].draw(ctx, this.area);

		this.lines[i].p1.x = oldX1;
		this.lines[i].p1.y = oldY1;
		this.lines[i].p2.x = oldX2;
		this.lines[i].p2.y = oldY2;
	}
};

canvasPlot.gridOffscreen.draw = function (ctx, area) {
	if (!this.toDraw)
		return;

	ctx.save();

	ctx.beginPath();
	ctx.rect(area.p.x, area.p.y, area.width, area.height);
	ctx.clip();

	ctx.drawImage(this.canvas, this.offsetX, this.offsetY);

	ctx.restore();
};
