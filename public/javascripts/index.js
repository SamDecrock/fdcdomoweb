window.App = {
	start: function(){
		//Backbone Collection:
		App.devices = new App.Devices();
		App.events = new App.Events();

		//Backbone Views initialiseren:
		App.devicesView = new App.DevicesView();
		App.eventsView = new App.EventsView();

		//fetchen van devices en events:
		App.devices.fetch();
		App.events.fetch();

		//luisteren naar veranderingen in devices:
		PUBNUB.subscribe({
			channel  : "deviceupdates",
			error    : function() {
				//console.log("Connection Lost. Will auto-reconnect when Online.")
			},
			callback : function(message) {
				var deviceModel = App.devices.get(message.id);
				deviceModel.set(message);
			}
		})

	}
};


/**
 * DEVICES:
 */
App.DevicesView = Backbone.View.extend({
	el: "#devices",
	
	initialize: function(){
		App.devices.bind("add", this.renderItem, this);
		App.devices.bind("reset", this.renderAll, this);
	},

	renderItem: function(model){
		var deviceView = new App.DeviceView({model: model});
		$(this.el).append(deviceView.render().el);	
	},
	
	renderAll: function(collection){
		$(this.el).empty();
		collection.forEach(this.renderItem, this);
	}
});

App.DeviceView = Backbone.View.extend({
	tagName: "li",
	
	className: "device",
	
	initialize: function(){
		this.model.on('change', this.render, this); //als model veranderd, deze view opnieuw renderen
	},
	
	render: function(){
		$(this.el).html(this.model.id + " | " + this.model.get("type") + ": " + this.model.get("name") + " is <span class='" + this.model.get("state") + "'>" + this.model.get("state") + "</span>");
		$(this.el).addClass(this.model.get("type"));
		return this;
	}
});


App.Device = Backbone.Model.extend({
	defaults:{
		id: -1,
		type: "no type",
		name: "no name",
		state: "no state"
	}
});

App.Devices = Backbone.Collection.extend({
	model: App.Device,
	url: '/rest/getdevices',
	comparator: function(device) {
	  	return device.get("type");
	}
});




/**
 * EVENTS:
 */
App.EventsView = Backbone.View.extend({
	el: "#events",
	
	initialize: function(){
		App.events.bind("add", this.renderItem, this);
		App.events.bind("reset", this.renderAll, this);
	},

	renderItem: function(model){
		var eventView = new App.EventView({model: model});
		$(this.el).append(eventView.render().el);	
	},
	
	renderAll: function(collection){
		$(this.el).empty();
		collection.forEach(this.renderItem, this);
	}
});


App.EventView = Backbone.View.extend({
	tagName: "li",
	
	className: "event",
	
	events:{
		'click': 'this_clickHandler'
	},
	
	initialize: function(){

	},
	
	render: function(){
		$(this.el).html(this.model.id + " | " + this.model.get("type") + ": " + this.model.get("name"));
		return this;
	},
	
	this_clickHandler: function(event){
		console.log(this.model.id);

		$.post("/rest/sendevent", {
				id: this.model.id
			},
			function(item) {
				//niets
			}
		);
	}
});


App.Event = Backbone.Model.extend({
	defaults:{
		id: -1,
		type: "no type",
		name: "no name"
	}
});

App.Events = Backbone.Collection.extend({
	model: App.Device,
	url: '/rest/getevents'
});








$(App.start);

