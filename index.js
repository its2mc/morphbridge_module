/* Morph Bridge Application module. 
Created By: Phillip Ochola Mak'Anyengo,
Email: its2uraps@gmail.com, 
Github: https://github.com/its2mc,
License: ISC

*/
// require('./_utils');
// require('./logger');
// require('./channels');
// require('./comms');
// require('./');

//"use strict"; 

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


//ZMQ interproc Communication Handler
var zmq = require('zmq'),
publisher = zmq.socket('pub'),
subscriber = zmq.socket('sub'),
pubListener = 'tcp://127.0.0.1:10001',
subListener = 'tcp://127.0.0.1:10002',
monitor = "",
handle_function = "",
hwm = 1000,
verbose = 0,
restartAttempts = 1,
comms = Object.create(null),
exec = require('child_process').exec;

comms.init = function(handle_func){
	handle_function = handle_func;
	this.pub_broker_init(this.pub_init);
	this.sub_init(handle_func);
};// Initialization function

comms.pub_broker_init = function(handle_func){
	exec('node node_modules/morphbridge/_proxy.js', function(err, stdout, stderr) {
		// the command exited or the launching failed
		if (err) {
			// we had an error launching the process
			logger.logErr('child process exited with error code', err);
			return;
		}
		logger.logStat('Successfully Restarted Thread');
	});
	setTimeout(function() {
   		console.log('Communication started');
		handle_func();
	}, 500);
	
};// Initialize xpub/xsub broker

comms.pub_init = function(){
	publisher.connect(pubListener,function(err){
		if(err)
			logger.logErr(err);
	});
	comms.monitor();
	logger.logStat("Enabled Publisher");
};// Initializes Publisher Socket

comms.sub_init = function(handle_func){
	subscriber.connect(subListener, function(err){
		logger.logErr(err);
	});
	subscriber.subscribe("");
	subscriber.on("message",handle_func);
	logger.logStat("Enabled Subscriber");
	logger.logStat("Subscribed to empty channel");
};// Subscribes to socket, the subscriber message handling will be defined 
	
comms.monitor = function(){
	var count = 0;
	publisher.monitor(500,0);
	console.log("Enabled Monitor");
	publisher.on('close', function(fd, ep) {
		if(count < restartAttempts){
			console.log("Restarting communciations.");
			exec('node node_modules/morphbridge/_proxy.js', function(err, stdout, stderr) {
				// the command exited or the launching failed
				if (err) {
					// we had an error launching the process
					logger.logErr('child process exited with error code', err);
					return;
				}
				logger.logStat('Successfully Restarted Thread');
			});
			console.log("communications restarted");
			count++;
		}
	});
};// Monitor the Infrastructure to Restart incase of Exit by one node	

comms.transmit = function(msg){
	publisher.send(msg);
	return 1;
};// Transmits messages to all nodes

comms.close = function(){
	publisher.unmonitor();
	publisher.close();
	subscriber.close();
};//Closes all sockets and connections in case of SIGINT

Object.freeze(comms);
module.exports.comms = comms;


//Log Handler: This will manage custom error messages for platform errors.
//The messages are coded to make it lighter for smaller devics
var winston = require('winston'),
logger = Object.create(null);

var log_object;

logger.init = function(){
	log_object = new (winston.Logger)({
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

logger.logStat = function(tmp){
	//log_object.info(tmp);
};

logger.logErr = function(tmp){
	log_object.error(tmp);
};

logger.logDebug = function(tmp){
	log_object.debug(tmp);
};

Object.freeze(logger);
module.exports.logger = logger;
