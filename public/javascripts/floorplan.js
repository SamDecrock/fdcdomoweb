window.App = {
	start: function(){
		//Backbone Collection:
		App.devices = new App.Devices();

		//Backbone Views initialiseren:
		App.floorPlanView = new App.FloorPlanView();

		//fetchen van devices en events:
		App.devices.fetch();

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
App.FloorPlanView = Backbone.View.extend({
	el: "#floorplan",
	
	initialize: function(){
		App.devices.bind("add", this.renderItem, this);
		App.devices.bind("reset", this.renderAll, this);
	},

	renderItem: function(model){
		//kijken als er zo'n element bestaat in de html:

		var elementId = "#" + model.id;

		if($(elementId).length != 0){
			var deviceView = new App.DeviceView({model: model});
			deviceView.setElement($(elementId)[0]);
			deviceView.render();
		}
		
	},
	
	renderAll: function(collection){
		collection.forEach(this.renderItem, this);
	}
});

App.DeviceView = Backbone.View.extend({
	tagName: "img",

	initialize: function(){
		this.model.on('change', this.render, this); //als model veranderd
	},
	
	render: function(){
		var imagesource = $(this.el).attr("src");
		imagesource = imagesource.replace(/_off.svg|_on.svg/i, "_" + this.model.get("state") + ".svg");
		$(this.el).attr("src", imagesource);
		
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





$(App.start);

