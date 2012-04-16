/**
 * Settings
 */
var config = require('./config');

var devices = config.devices;
var events = config.events;

var translatedDevices = {};
buildTranslatedDevices();
//console.log(convertToArray(translatedDevices));
//console.log(events);


/**
 * Start Logic
 */
var net = require('net');
var express = require('express');
var pubnub 	= require("pubnub");
var pubnubNetwork = pubnub.init(config.pubnub);

//Socket die met domotica verbindt:
var client = new net.Socket();
client.connect(config.terminalSettings.port, config.terminalSettings.host, function() {

    console.log('CONNECTED TO: ' + config.terminalSettings.host + ':' + config.terminalSettings.port);
    
    //Terminualnumber doorsturen:
	sendCommand("TN" + config.terminalSettings.terminalNumber);
});

//Binnenkomende data op socket:
client.on('data', function(data) {
    
    //console.log('DATA: ' + data);
    // Close the client socket completely
    //client.destroy();

    //inkomende data parsen:
    parseResponse(data);
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});


function sendCommand(commandString){
	commandString = "C" + commandString; //C van 'client' voor plakken
	var buf = new Buffer(commandString.length + 2); //buffer aanmaken die 2 bytes groter is dan string

	//Begin met 2:
	buf[0] = 2;
	
	//String:
	for (var i = 0; i < commandString.length ; i++) {
		buf[i+1] = commandString.charCodeAt(i);
	}

	//Eindig met 3:
	buf[buf.length-1] = 3;


	console.log("Sending command: " + commandString);
	client.write(buf);
}

function parseResponse(data){
	var buffer = new Buffer(data);
	var commandBytes = new Buffer(buffer.length);
	var r = 0;

	var recordBytes = false;

	for (var i = 0; i < buffer.length ; i++) {
		var aByte = buffer[i];

		if (aByte == 3){
			recordBytes = false;
			parseCommand(commandBytes.toString('ascii', 0, r));
			r = 0;
		}

		if (recordBytes){
			commandBytes[r] = aByte;
			r++;
		}

		if (aByte == 2){
			recordBytes = true;
		}
	}
}

function parseCommand(commandString){
	var isDeviceCommand = /[0-9]/i.test(commandString.substring(0,1));

	if(isDeviceCommand){
		var devicenr = commandString.substring(0,7);
		var rawstate = commandString.substring(7);
		updateDevice(devicenr, rawstate);
	}else{
		console.log("RESPONSE: " + commandString);
	}
}

/**
 * Vertaal devices met rawstate naar een leesbare state
 */
function buildTranslatedDevices(){
	for (var devicenr in devices)
	{
		var device = devices[devicenr];

		//type en name kopieren naar translatedDevices:
		translatedDevices[devicenr] = {
			type: device.type,
			name: device.name,
			id: devicenr,
			state: device.default
		}
	}
}

function updateDevice(devicenr, rawstate){
	var device = devices[devicenr];

	if(device){
		if(!device.rawstate){
			//als er nog geen rawstate was:
			device.rawstate = rawstate;
			translatedDevices[devicenr].state = device[rawstate];

			//als die verschillende is van de defaultstate, update doorsturen:
			if(translatedDevices[devicenr].state != device.default){
				pushUpdate(translatedDevices[devicenr]);
			}
		}else if(device.rawstate != rawstate){
			//als de rawstate veranderd is:
			device.rawstate = rawstate;

			translatedDevices[devicenr].state = device[device.rawstate];
			pushUpdate(translatedDevices[devicenr]);
		}
	}
}

function pushUpdate(device){
	console.log(device);

	pubnubNetwork.publish({
		channel: "deviceupdates",
		message: device
	});	
}

/**
 * Webserver stuff:
 */
 var webserver = module.exports = express.createServer();
 webserver.configure(function(){
	webserver.use(express.bodyParser());
	var oneYear = 31536000000; //1 year in ms
	webserver.use(express.static(__dirname + '/public', { maxAge : oneYear})); 
	webserver.use(express.cookieParser());
	webserver.use(express.session({cookie: { path: '/', httpOnly: false, maxAge: null }, secret:'fdcdomo'}));
	webserver.use(express.methodOverride());
	webserver.use(webserver.router);
});
webserver.configure('development', function(){
	webserver.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
webserver.configure('production', function(){
	webserver.use(express.errorHandler()); 
});
if (!module.parent) {
	webserver.listen(config.webserver.port || 3000);
	console.log("Express server listening on port %d", webserver.address().port);
}



/**
 * REST interfaces
 */
webserver.get('/rest/getdevices', function(req, res) {
	//items terugsturen naar de browser:
	res.writeHead(200, {'content-type': 'text/json' });
	res.write(JSON.stringify(convertToArray(translatedDevices))); 
	res.end('\n');
});

webserver.get('/rest/getevents', function(req, res) {
	//items terugsturen naar de browser:
	res.writeHead(200, {'content-type': 'text/json' });
	res.write(JSON.stringify(events)); 
	res.end('\n');
});

webserver.post('/rest/sendevent', function(req, res){
	var eventId = req.body.id;

	sendCommand(eventId);
});


function convertToArray(associativeArray){
	var array = [];

	for (var objectId in associativeArray)
	{
		array.push(associativeArray[objectId]);
	}
	return array;
}















