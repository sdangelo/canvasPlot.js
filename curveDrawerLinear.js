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

/*** Curve-drawing object using lines to connect consecutive samples. ***/

canvasPlot.curveDrawerLinear = Object.create(canvasPlot.curveDrawer);

/* Private members. */
canvasPlot.curveDrawerLinear.eAngle = Math.PI + Math.PI;
canvasPlot.curveDrawerLinear.ctx = null;
canvasPlot.curveDrawerLinear.area = null;
canvasPlot.curveDrawerLinear.pointRadius = NaN;
canvasPlot.curveDrawerLinear.xPrev = NaN;
canvasPlot.curveDrawerLinear.yPrev = NaN;
canvasPlot.curveDrawerLinear.pathBegun = false;
canvasPlot.curveDrawerLinear.mask = 0;

canvasPlot.curveDrawerLinear.drawBegin = function (ctx, area, lineWidth,
						   lineStyle, pointRadius) {
	this.ctx = ctx;
	this.area = area;
	this.pointRadius = pointRadius;
	this.xPrev = NaN;
	this.yPrev = NaN;
	this.pathBegun = false;
	this.mask = 0;

	ctx.save();

	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = lineStyle;
	ctx.fillStyle = lineStyle;
	ctx.lineJoin = "round";

	ctx.beginPath();
	ctx.rect(area.p.x, area.p.y, area.width, area.height);
	ctx.clip();
};

canvasPlot.curveDrawerLinear.drawPart = function (mSamples, first, last) {
	var xMin = this.area.p.x - 0.5;
	var xMax = this.area.p2.x + 0.5;
	var yMin = this.area.p.y - 0.5;
	var yMax = this.area.p2.y + 0.5;
	for (var i = first; i <= last; i++) {
		var x = mSamples.x[i];
		var y = mSamples.y[i];

		this.mask = (this.mask & 0xf0) >> 4;
		if (x <= xMax)
			this.mask |= 0x80;
		if (x >= xMin)
			this.mask |= 0x40;
		if (y <= yMax)
			this.mask |= 0x20;
		if (y >= yMin)
			this.mask |= 0x10; 

		if (this.pathBegun) {
			this.ctx.lineTo(this.xPrev, this.yPrev);
			var maskcc = this.mask & 0xcc;
			var mask33 = this.mask & 0x33;
			if (!(this.mask & 0xc0) || !(this.mask & 0x30)
			    || (maskcc == 0x44) || (maskcc == 0x88)
			    || (mask33 == 0x11) || (mask33 == 0x22)) {
				this.ctx.stroke();
				this.pathBegun = false;
			}
		} else if (!((this.mask & 0xc0) && (this.mask & 0x30))
			   && ((this.mask & 0xf) == 0xf)) {
			this.ctx.beginPath();
			this.ctx.arc(this.xPrev, this.yPrev, this.pointRadius,
				     0.0, this.eAngle);
			this.ctx.fill();
		} else if (((this.mask & 0x5a) == 0x5a)
			   || ((this.mask & 0x69) == 0x69)
			   || ((this.mask & 0x96) == 0x96)
			   || ((this.mask & 0xa5) == 0xa5)) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.xPrev, this.yPrev);
				this.pathBegun = true;
		}

		this.xPrev = x;
		this.yPrev = y;
	}
};

canvasPlot.curveDrawerLinear.drawEnd = function () {
	if (this.pathBegun) {
		this.ctx.lineTo(this.xPrev, this.yPrev);
		this.ctx.stroke();
	} else if ((this.mask & 0xf0) == 0xf0) {
		this.ctx.beginPath();
		this.ctx.arc(this.xPrev, this.yPrev, this.pointRadius, 0.0,
			     this.eAngle);
		this.ctx.fill();
	}

	this.ctx.restore();
};
