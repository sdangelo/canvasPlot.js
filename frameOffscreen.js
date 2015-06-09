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

canvasPlot.frameOffscreen = Object.create(canvasPlot.frame);
canvasPlot.frameOffscreen.super = canvasPlot.frame;

canvasPlot.frameOffscreen.canvas = null;
canvasPlot.frameOffscreen.floorX = NaN;
canvasPlot.frameOffscreen.floorY = NaN;
canvasPlot.frameOffscreen.offsetX = NaN;
canvasPlot.frameOffscreen.offsetY = NaN;

canvasPlot.frameOffscreen.init = function (area) {
	this.super.init.call(this, area);
	this.canvas = document.createElement("canvas");
};

canvasPlot.frameOffscreen.update = function () {
	this.super.update.call(this);

	this.floorX = Math.floor(this.area.p.x);
	this.floorY = Math.floor(this.area.p.y);
	this.offsetX = this.area.p.x - this.floorX;
	this.offsetY = this.area.p.y - this.floorY;

	this.canvas.width = Math.ceil(this.offsetX + this.area.width);
	this.canvas.height = Math.ceil(this.offsetY + this.area.height);

	var ctx = this.canvas.getContext("2d");

	ctx.lineWidth = this.borderWidth;
	ctx.strokeStyle = this.borderStyle;

	var bwh = 0.5 * this.borderWidth;
	ctx.strokeRect(this.offsetX + bwh, this.offsetY + bwh,
		       this.strokeArea.width, this.strokeArea.height);
};

canvasPlot.frameOffscreen.draw = function (ctx) {
	ctx.drawImage(this.canvas, this.floorX, this.floorY);
};
