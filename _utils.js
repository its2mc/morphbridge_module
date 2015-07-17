//Buffer that is available for the user. *Create buffer dynamically*

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
}

buffer_object.prototype.unload = function(){
	return this.buffer.splice(0,this.buffer.length)
};// Unload messages from buffer

buffer_object.prototype.setLimit = function(limit){
	this.Limit = limit;
};// Set limit for buffer

channels_obj.newBuffer= function(){
	logger.logStat("New Buffer created");
	return new buffer_object ();
};// Returns a new buffer

