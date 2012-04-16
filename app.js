/**
 * Settings
 */
var terminalSettings = {
	host: '192.168.240.27',
	port: 9200,
	terminalNumber: 1001
}

var devices = {
	'9903038': {
		type: "door",
		name: "carport",
		0: "open",
		1: "closed",
		default: "closed"
	},

	'9903038': {
		type: "door",
		name: "carport",
		0: "open",
		1: "closed",
		default: "closed"
	},

	'9903037': {
		type: "door",
		name: "keuken",
		0: "open",
		1: "closed",
		default: "closed"
	},

	'9903020': {
		type: "door",
		name: "living",
		0: "closed",
		1: "open",
		default: "closed"
	},

	'9903026': {
		type: "door",
		name: "voordeur",
		0: "open",
		1: "closed",
		default: "closed"
	},

	'9903023': {
		type: "motionsensor",
		name: "gang",
		0: "movement",
		1: "nothing",
		default: "nothing"
	},

	'9903024': {
		type: "motionsensor",
		name: "living",
		0: "movement",
		1: "nothing",
		default: "nothing"
	},

	'9903025': {
		type: "motionsensor",
		name: "luifel straat",
		0: "nothing",
		1: "movement",
		default: "nothing"
	},

	'9904014': {
		type: "light",
		name: "zitbank tuin",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904031': {
		type: "light",
		name: "gang beneden",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904017': {
		type: "light",
		name: "lampen bij lindebomen",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904015': {
		type: "light",
		name: "padlampjes",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904026': {
		type: "light",
		name: "tuin vooraan",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904018': {
		type: "light",
		name: "tuinhuis",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904054': {
		type: "light",
		name: "keuken",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904056': {
		type: "light",
		name: "keuken tuin",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904059': {
		type: "light",
		name: "living",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904062': {
		type: "light",
		name: "luifel tuin",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904072': {
		type: "light",
		name: "salon",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904044': {
		type: "light",
		name: "keuken aanrecht",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904081': {
		type: "light",
		name: "uplight living",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904006': {
		type: "socket",
		name: "netstekker 4",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904004': {
		type: "device",
		name: "pc",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904005': {
		type: "device",
		name: "printer",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904016': {
		type: "device",
		name: "vijver",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904013': {
		type: "waterpump",
		name: "grondwater",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904012': {
		type: "waterpump",
		name: "regenwater",
		0: "off",
		1: "on",
		default: "off"
	},

	'9904019': {
		type: "waterpump",
		name: "vijver",
		0: "off",
		1: "on",
		default: "off"
	}
};

var events = {
	'EV14,4079': {
		type: "light",
		name: "lichten tuinhuis"
	},

	'EV14,3013': {
		type: "light",
		name: "lichten salon"
	},

	'EV14,3016': {
		type: "light",
		name: "lichten salon harder"
	},

	'EV14,3018': {
		type: "light",
		name: "lichten salon zachter"
	},

	'EV14,3017': {
		type: "device",
		name: "printer aansteken"
	}
}

var translatedDevices = {};
buildTranslatedDevices();
pushUpdate();
console.log(events);


/**
 * Start Logic
 */
var net = require('net');


//Socket die met domotica verbindt:
var client = new net.Socket();
client.connect(terminalSettings.port, terminalSettings.host, function() {

    console.log('CONNECTED TO: ' + terminalSettings.host + ':' + terminalSettings.port);
    
    //Terminualnumber doorsturen:
	sendCommand("TN" + terminalSettings.terminalNumber);
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
		console.log(commandString);
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
			name: device.name
		}

		//state is afhankelijk van wat er in z'n rawstate zit:
		if(device.rawstate){
			translatedDevices[devicenr].state = device[device.rawstate];
		}else{
			translatedDevices[devicenr].state = device.default;
		}
	}

	return translatedDevices;
}

function updateDevice(devicenr, rawstate){
	var device = devices['devicenr'];

	if(device){
		//als de rawstate veranderd is of er was nog geen:
		if(device.rawstate != rawstate || !device.rawstate){
			device.rawstate = rawstate;

			translatedDevices[devicenr].state = device[device.rawstate];
			pushUpdate();
		}
	}
}

function pushUpdate(){
	console.log(translatedDevices);
}