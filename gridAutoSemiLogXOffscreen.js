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

/*** Offscreen-rendered automatic grid for semilogx maps. ***/

canvasPlot.gridAutoSemiLogXOffscreen =
	Object.create(canvasPlot.gridAutoSemiLogX);

/* Private members. */
canvasPlot.gridAutoSemiLogXOffscreen.super = canvasPlot.gridAutoSemiLogX;
canvasPlot.gridAutoSemiLogXOffscreen.canvas = null;
canvasPlot.gridAutoSemiLogXOffscreen.area = Object.create(canvasPlot.area);
canvasPlot.gridAutoSemiLogXOffscreen.offsetX = NaN;
canvasPlot.gridAutoSemiLogXOffscreen.offsetY = NaN;

canvasPlot.gridAutoSemiLogXOffscreen.init = canvasPlot.gridOffscreen.init;
canvasPlot.gridAutoSemiLogXOffscreen.update = canvasPlot.gridOffscreen.update;
canvasPlot.gridAutoSemiLogXOffscreen.draw = canvasPlot.gridOffscreen.draw;
