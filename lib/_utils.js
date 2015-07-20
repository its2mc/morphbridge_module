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

module.exports._utils = function(){

	//Buffer that is available for the user. 

	var buffer_object = function (){
			this.buffer = [];
			this._isLimitEnabled = 0;// Toggle to allow for memory limits
			this.Limit = 10;
	}//Basic buffer object

	buffer_object.prototype.load = function(data){
		var tmp_data = data.toString('utf8',0,data.length);
		if (this._isLimitEnabled == 1){
			if (this.buffer.length > this.Limit)
				return 0;
			else{
				this.buffer.push(tmp_data);
				return 1;
			}
		}
		else 
			this.buffer.push(tmp_data);
	}//Load a message to a buffer

	buffer_object.prototype.unload = function(){
		return this.buffer.splice(0,this.buffer.length)
	};// Unload messages from buffer

	buffer_object.prototype.setLimit = function(limit){
		this.Limit = limit;
	};// Set limit for buffer

}