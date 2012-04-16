var net = require('net');

var devices = {
	'993038': {
		type: "door",
		name: "carport",
		0: "open",
		1: "closed"
	},

	
};

devices['993038'] = {
	type: "door",
	name: "carport",
	0: "open",
	1: "closed"
}

devices['993037'] = {
	type: "door",
	name: "keuken",
	0: "open",
	1: "closed"
}

devices['993020'] = {
	type: "door",
	name: "living",
	0: "closed",
	1: "open"
}

devices['993026'] = {
	type: "door",
	name: "voordeur",
	0: "open",
	1: "closed"
}




var HOST = '192.168.240.27';
var PORT = 9200;


var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
	sendCommand("TN1001");

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    
    //console.log('DATA: ' + data);
    // Close the client socket completely
    //client.destroy();

    parseResponse(data);
    
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});


function sendCommand(commandString){
	commandString = "C" + commandString; //C van 'client' voor plakken
	var buf = new Buffer(commandString.length + 2); //buffer aanmaken die 2 bytes groter is dan string

	buf[0] = 2; //begin met een 2
	buf[buf.length-1] = 3; //eindig met een 3

	//String ertussen steken:
	for (var i = 0; i < commandString.length ; i++) {
		buf[i+1] = commandString.charCodeAt(i);
	}

	console.log("Sending command: " + commandString + " encoded as " + buf.toString());
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

		var device = devices[devicenr];
		if (device){
			console.log(device['name'] + " is " + device[rawstate]);
		}else{
			console.log("device " + devicenr + " has state " + rawstate);
		}
	}else{
		console.log(commandString);
	}

}
