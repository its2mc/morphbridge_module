
//Channel Object. This is the King Kunta.. :D 
var channels_obj = Object.create(null);
channels_obj.channel_list = [];//Channel list

/*
I think its better if a user creates a new channel in a
variable on his script.. For now this will allow a user to
create simple channels.. if you want to dynamically create
many channels then this channel object might work for you

*/

channels_obj.newChannel = function(){
	logger.logStat("New Channel created");
	return new channel_object();
};//This returns a new channel object


channels_obj.createChannel = function(channelId){
	this.channel_list[channelId] = new channel_object ();
	return 1;
};//Have changed this to return a new channel


channels_obj.destroyChannel = function(channelId){
	for (var i in this.channels_list) //Correct the reference
		if(i==channelId) 
			this.channels_list.splice(i,1);
	return 1;
};// Purges a channel

/*
I have decided to leave this function to allow for users
to control channel creation direction from connected devices 
as opposed to hardcoding it on their script, this would allow
for dynamic channeling from the devices themselves
*/

channels_obj.translate = function(msg,userId){
	var tmpMsg = JSON.parse(msg);
	/*
	To use this function a message hast have the following parts:
		tmpMsg[0] ==> An integer string that commands the translator
		tmpMsg[1] ==> A string that denotes the channel meant for communication..
			users are encouraged to use simple integers to save on memory
		tmpMsg[2] ==> A string with the message payload to be broadcast
	While these positions are reserved, positions from 3 are available
		for the user to use.  
	*/
	switch (tmpMsg[0]) {
		case "1" : //Create a communication channel
			try{
				if(this.createChannel(tmpMsg[1]))	
					logger.logStat("Channel Creation Successful");
				else logger.logStat("Channel Already exists");
			}catch(e){
				logger.logErr("Error Has occurred during channel creation : "+e);
			}
		break;
		
		case "2": //Destroy a communication channel
			try{
				if(this.destroyChannel(tmpMsg[1]))
					logger.logStat("Channel Destruction Successful");
			}catch(e){
				logger.logErr("Error Has occurred during channel destruction : "+e);
			}
		break;
		
		case "3" : //Subscribe a single user to a communication channel
			try{
				if(this.channel_list[tmpMsg[1]].subscribe(userId))
					logger.logStat("Subscription Successful");
				else throw "Subscriber Already Exists";
			}catch(e){
				logger.logErr("Error Has occurred during subscription : " + e);
			}
		break;
		
		case "4" : //Unsubscribe a single user to a communication channel
			try{
				if(this.channel_list[tmpMsg[1]].unsubscribe(userId))
					logger.logStat("Unsubscription Successful");
			}catch(e){
				logger.logErr("Error Has occurred during unsubscription : "+e);
			}
		break;
				
		case "5" : //Bare Broadcast allows only message payload to be sent to clients
			try{
				if(this.channel_list[tmpMsg[1]].bare_broadcast(tmpMsg[2]))
					logger.logStat("Bare Broadcast Sent");
			}catch(e){
				logger.logErr("Message not sent : "+e);
			}
		break;

		default: //Default method is broadcast, sends whole message to clients
			try{ 
				if(this.channel_list[tmpMsg[1]].broadcast(tmpMsg[2]))
					logger.logStat("Broadcast Sent");
			}catch(e){
				logger.logErr("Message not sent : "+e);
			}
		break;
	}
};// This translator helps manage channel creation and broadcasting directly by clients

/*channels_obj.checkTimeout = function(){
	for (var i in this.channels_list)
		if(i==channelId) 
			this.channels_list.splice(i,1);
	return 1;
};// Checks if the timeout has been passed */

channels_obj.stats = function(){
	return {
		noOfChannels:this.channels_obj.channels_list.length,
		channelInfo: function(){
			return 0;
			//return "{"++"}"++"";
		}
	};
};// Give a full list of channels and their subscribers



//Channel sub object *Create channel objects dynamically*
var channel_object = function(){
	this.timestamp = 0;//Timestamp to check for time outs
	this.timeLimit = 0;
	this._isTimeoutEnabled = 0;//Enable timing out
	this.subscribers = [];//Array container for channel subscribers
};// Basic channel object

channel_object.prototype.subscribe = function(sock){
	//if (this.checkTimeout) return 0;
	//for(var i in this.subscribers) 
	//	if(this.subscribers[i]==sock) 
	//		return 0;
	this.subscribers.push(sock);
	return 1;
};// Subscribes a user to a channel

channel_object.prototype.unsubscribe = function(sock){
	this.subscribers.splice(this.subscribers.indexOf(sock),1);
	return 1;
};// Subscribes a user to a channel

channel_object.prototype.tcp_bcast = function(msg){
	//if (this.checkTimeout) return 0;
	//if (this.subscibers.length<1) return 0;
	for (var i in this.subscribers)
 		this.subscribers[i].send(msg);
	return 1;
};// Broadcasting a message to a specific tcp channel

channel_object.prototype.websocket_bcast = function(msg){
	//if (this.checkTimeout) return 0;
	//if (this.subscibers.length<1) return 0;
	for (var i in this.subscribers)
	 	this.subscribers[i].write(msg);
	return 1;	
};// Broadcast a message for a websocket channel

channel_object.prototype.checkTimeout = function(){
	if (!this._isTimeoutEnabled) return 0;
	var temp = Date.getTime() / 1000; 
	if ((temp - this.timestamp) > this.timeLimit)
		return true;
	else 
		return false;
};// Check the if the channel has passed its timeout

channel_object.prototype.setTimeout = function(limit){
	this._isTimeoutEnabled = 1;
	this.timeLimit = limit;//Time limit in seconds
};// Set a time Limit for the Channels existence

channel_object.prototype.removeTimeout = function(){
	this.timeLimit = 0;
	this._isTimeoutEnabled = 0;
};// Remove the timeout Limit

Object.freeze(channels_obj);
module.exports.channels_obj = channels_obj;


