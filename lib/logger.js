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

module.exports.logger_lib = function(){

	//Log Handler: This will manage custom error messages for platform errors.
	//Wish to code the messages to reduce size

	var fs = require('fs');
	var winston = require('winston');

	var logger = Object.create(null);

	logger = function(){
		this.log_object;
	};

	logger.prototype.init = function(){
		this.log_object = new (winston.Logger)({
			transports: [
				new (winston.transports.File)({
					name: 'error-file',
					filename: 'logs/errors.log',
					level: 'error',
					handleExceptions: true
				}),
				new (winston.transports.File)({
					name: 'info-file',
					filename: 'logs/stats.log',
					level: 'info'
				}) 
			]
		});
	};

	logger.prototype.logStat = function(tmp){
		this.log_object.log('info',tmp);
	};

	logger.prototype.logErr = function(tmp){
		this.log_object.error(tmp);
	};

	logger.prototype.logDebug = function(tmp){
		this.log_object.debug(tmp);
	};

	Object.freeze(logger);
	return new logger ();
};

