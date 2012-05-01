this.terminalSettings = {
	host: '192.168.240.27',
	port: 9200,
	terminalNumber: 1001
}

this.devices = {
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

this.events = [
	{
		id: "EV14,3030",
		type: "light",
		name: "keuken aanrecht"
	},
	{
		id: "EV14,3022",
		type: "light",
		name: "gang beneden"
	},
	{
		id: "EV14,3029",
		type: "light",
		name: "keuken"
	},
	{
		id: "EV14,3028",
		type: "light",
		name: "keuken tuin"
	},
	{
		id: "EV14,4046",
		type: "light",
		name: "bank tuin"
	},
	{
		id: "EV14,4058",
		type: "light",
		name: "lampen bij lindebomen"
	},
	{
		id: "EV14,4067",
		type: "light",
		name: "padlampjes"
	},
	{
		id: "EV14,4078",
		type: "light",
		name: "tuin vooraan"
	},
	{
		id: "EV14,4079",
		type: "light",
		name: "tuinhuis"
	},
	{
		id: "EV14,3014",
		type: "light",
		name: "living"
	},
	{
		id: "EV14,3031",
		type: "light",
		name: "luifel tuin"
	},
	{
		id: "EV14,3013",
		type: "light",
		name: "salon"
	},
	{
		id: "EV14,3016",
		type: "light",
		name: "salon harder"
	},
	{
		id: "EV14,3018",
		type: "light",
		name: "salon zachter"
	},
	{
		id: "EV14,3012",
		type: "light",
		name: "uplight living"
	},
	{
		id: "EV14,4064",
		type: "socket",
		name: "netstekker 4"
	},
	{
		id: "EV14,3015",
		type: "device",
		name: "pc aan"
	},
	{
		id: "EV14,3017",
		type: "device",
		name: "printer aan"
	}
]

this.pubnub = { 
	publish_key: "pub-d771bca5-7a5f-40e3-a002-878c188678be",
	subscribe_key: "sub-771b1c8a-429f-11e1-b189-69c52471178d",
	secret_key: "",
	ssl: false,
	origin: "pubsub.pubnub.com",
}

this.webserver = { 
	port: 3000
}