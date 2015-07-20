/* 
* This work has been done by Phillip Ochola Makanyengo
* Email: its2uraps@gmail.com
*
* This work uses open source code and libraries and 
* can therefore be replicated unless certain portions
* are stated otherwise. 
*
* Please refer to the author when using the code.
* 
* Copyright (c) [2015], [Phillip Ochola Mak'Anyengo] <[its2uraps@msn.com]>
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
*
*/

"use strict"; 

// Import utils lib.. This includes the buffer object and
// other helper tools that will be added on

var _utils = require('./lib/_utils')._utils;
_utils();
// Import logger lib.. The logger has been revamped.
var logger = require('./lib/logger').logger_lib();
logger.init();
module.exports.logger = logger;

// Import channels lib... Includes the channels object
var channels_obj = require('./lib/channels').channels_lib(logger);
module.exports.channels_obj = channels_obj;

// Import comms lib.. This is the main library
var comms = require('./lib/comms').comms_lib(logger);
module.exports.comms = comms;

