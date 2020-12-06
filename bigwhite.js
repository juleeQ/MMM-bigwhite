Module.register("bigwhite", {
	// Default module config.
	defaults: {
		updateInterval: 5 * 60 * 1000  // 5 minutes
	},

	snowData: {
	},

	// automatically called by MagicMirror at the start
	start: function() {
		Log.log("Connecting big white socket");
		var self = this;
		this.sendSocketNotification("CONFIG", this.config);
		// setTimeout(function() { self.sendSocketNotification("CONFIG", self.config);}, 2000);
	},

	getTemplate: function() {
		return "bigwhite.njk";
	},

	getTemplateData: function() {
		return this.snowData;
	},

	// Title on the magic mirror display
	getHeader: function() {
		return "Big White - New Powder";
	},

	socketNotificationReceived: function(notification, payload) {
        if (notification === "UPDATE") {
			Log.log("Update received: " + JSON.stringify(payload));
			this.snowData = payload;
			this.updateDom();
        }
    },
	
});
