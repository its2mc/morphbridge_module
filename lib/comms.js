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

module.exports.comms_lib = function(logger){
	//ZMQ interproc Communication Handler
	var zmq = require('zmq'),
	publisher = zmq.socket('pub'),
	subscriber = zmq.socket('sub'),
	//monitor = "",
	hwm = 1000,
	verbose = 0,
	restartAttempts = 1,
	comms = Object.create(null),
	exec = require('child_process').exec;

	if(['win32','win64'].indexOf(process.platform)!=-1){
		var pubListener = 'tcp://127.0.0.1:10001',
		subListener = 'tcp://127.0.0.1:10002';
	}
	else {
		var pubListener = 'ipc://proxyPubListener',
		subListener = 'ipc://proxySubListener';
	}

	comms.init = function(handle_func){
		this.pub_broker_init(this.pub_init);
		this.sub_init(handle_func);
	};// Initialization function

	comms.pub_broker_init = function(handle_func){
		exec('node node_modules/morphbridge/_proxy.js', function(err, stdout, stderr) {
			// the command exited or the launching failed
			if (err) {
				// we had an error launching the process
				logger.logErr('child process exited with error code:'+ err);
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
		logger.logStat("Enabled Monitor");
		publisher.on('close', function(fd, ep) {
			if(count < restartAttempts){
				logger.logStat("Restarting communciations.");
				exec('node node_modules/morphbridge/_proxy.js', function(err, stdout, stderr) {
					// the command exited or the launching failed
					if (err) {
						// we had an error launching the process
						logger.logErr('child process exited with error code', err);
						return;
					}
					logger.logStat('Successfully Restarted Thread');
				});
				console.log("communications restored");
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
	return comms;
}