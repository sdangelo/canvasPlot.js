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

canvasPlot.curveDrawerLinear = Object.create(canvasPlot.curveDrawer);

canvasPlot.curveDrawerLinear.eAngle = Math.PI + Math.PI;

canvasPlot.curveDrawerLinear.ctx = null;
canvasPlot.curveDrawerLinear.area = null;
canvasPlot.curveDrawerLinear.pointRadius = NaN;
canvasPlot.curveDrawerLinear.xPrev = NaN;
canvasPlot.curveDrawerLinear.yPrev = NaN;
canvasPlot.curveDrawerLinear.exPrev = false;
canvasPlot.curveDrawerLinear.irPrev = false;
canvasPlot.curveDrawerLinear.pathBegun = false;

canvasPlot.curveDrawerLinear.drawBegin = function (ctx, area, lineWidth,
						   lineStyle, pointRadius) {
	this.ctx = ctx;
	this.area = area;
	this.pointRadius = pointRadius;
	this.xPrev = NaN;
	this.yPrev = NaN;
	this.exPrev = false;
	this.irPrev = false;
	this.pathBegun = false;

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
	for (var i = first; i < last; i++) {
		var x = mSamples.x[i];
		var y = mSamples.y[i];
		var ex = isFinite(x) && isFinite(y);
		var ir = this.area.contains(x, y);

		if (this.pathBegun) {
			if (this.exPrev)
				this.ctx.lineTo(this.xPrev, this.yPrev);
			if (!ex || !this.exPrev) {
				this.ctx.stroke();
				this.pathBegun = false;
			}
		} else if (ex) {
			if (this.exPrev) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.xPrev, this.yPrev);
				this.pathBegun = true;
			}
		} else if (this.irPrev) {
			this.ctx.beginPath();
			this.ctx.arc(x, y, this.pointRadius, 0.0, this.eAngle);
			this.ctx.fill();
		}

		this.xPrev = x;
		this.yPrev = y;
		this.exPrev = ex;
		this.irPrev = ir;
	}
};

canvasPlot.curveDrawerLinear.drawEnd = function () {
	if (this.pathBegun) {
		if (this.exPrev)
			this.ctx.lineTo(this.xPrev, this.yPrev);
		this.ctx.stroke();
	} else if (this.irPrev) {
		this.ctx.beginPath();
		this.ctx.arc(this.xPrev, this.yPrev, this.pointRadius, 0.0,
			     this.eAngle);
		this.ctx.fill();
	}

	this.ctx.restore();
};
