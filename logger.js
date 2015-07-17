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

