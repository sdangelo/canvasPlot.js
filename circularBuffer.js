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

canvasPlot.circularBuffer = {
	buffer:	null,
	index:	NaN,

	init: function (buffer) {
		this.buffer = buffer ? buffer : [];
		this.index = 0;
	},

	write: function (buffer, first, count) {
		var i = this.index;
		var j;
		var jLast = first + count;
		if (count > this.buffer.length) {
			count = this.buffer.length;
			j = jLast - count;
			if (j >= buffer.length)
				j -= buffer.length;
		} else
			j = first;
		jLast--;
		if (jLast >= buffer.length)
			jLast -= buffer.length;
		var iCountEnd = this.buffer.length - i;
		var jCountEnd = buffer.length - j;

		if (jCountEnd < count && iCountEnd > jCountEnd) {
			for (; j < buffer.length; i++, j++)
				this.buffer[i] = buffer[j];
			j = 0;
		}
		if (iCountEnd < count) {
			for (; i < this.buffer.length; i++, j++)
				this.buffer[i] = buffer[j];
			i = 0;
			if (j == buffer.length)
				j -= buffer.length;
		}
		if (jCountEnd < count && iCountEnd < jCountEnd) {
			for (; j < buffer.length; i++, j++)
				this.buffer[i] = buffer[j];
			j = 0;
		}
		for (; j <= jLast; i++, j++)
			this.buffer[i] = buffer[j];

		this.index = i == this.buffer.length ? 0 : i;
	}
};
