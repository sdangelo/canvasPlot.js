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

/*** Canvas auto-resize utility. ***/

/* Stretches a canvas element to the available size of its parent, within the
 * limits of a given width to height ratio, if specified. */
canvasPlot.canvasStretch = function (canvas, ratio) {
	var s = window.getComputedStyle(canvas);

	var p = canvas.parentNode;
	var ps = window.getComputedStyle(p);

	var w = p.clientWidth - parseFloat(ps.paddingLeft)
		- parseFloat(s.marginLeft) - parseFloat(s.borderLeftWidth)
		- parseFloat(s.paddingLeft) - parseFloat(ps.paddingRight)
		- parseFloat(s.marginRight) - parseFloat(s.borderRightWidth);
	var h = p.clientHeight - parseFloat(ps.paddingTop)
		- parseFloat(s.marginTop) - parseFloat(s.borderTopWidth)
		- parseFloat(s.paddingTop) - parseFloat(ps.paddingBottom)
		- parseFloat(s.marginBottom) - parseFloat(s.borderBottomWidth);

	if (ratio) {
		var r = w / h;
		if (r > ratio)
			w = h * ratio;
		else if (r < ratio)
			h = w / ratio;
	}

	canvas.width = w;
	canvas.height = h;
};
