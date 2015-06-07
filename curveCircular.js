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

canvasPlot.curveDrawer.drawPartCircular = function (mSamples, first, last) {
	if (first > last) {
		this.drawPart(mSamples, first, mSamples.x.length - 1);
		this.drawPart(mSamples, 0, last);
	} else
		this.drawPart(mSamples, first, last);
};

canvasPlot.curveCircular = Object.create(canvasPlot.curve);

canvasPlot.curveCircular.drawPart = function (ctx, area, curveDrawer,
					      first, last) {
		curveDrawer.drawBegin(ctx, area, this.lineWidth, this.lineStyle,
				      this.pointRadius);
		curveDrawer.drawPartCircular(this.mSamples, first, last);
		curveDrawer.drawEnd();
};

canvasPlot.curveCircular.updatePart = function (map, first, count) {
	var l1 = this.samples.x.length - first;
	var l2 = count - l1;
	if (l2 >= 0) {
		map.mapPoints(this.samples.x, this.samples.y, this.mSamples.x,
			      this.mSamples.y, first, first, first, first, l1);
		map.mapPoints(this.samples.x, this.samples.y, this.mSamples.x,
			      this.mSamples.y, 0, 0, 0, 0, l2);
	} else
		map.mapPoints(this.samples.x, this.samples.y, this.mSamples.x,
			      this.mSamples.y, first, first, first, first,
			      count);
};
