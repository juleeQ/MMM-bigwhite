var NodeHelper = require("node_helper");

const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = NodeHelper.create({
    started: false,

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.updateData();

            if (!this.started) {
                this.config = payload;
                this.started = true;
                console.log("Node helper big white started");

                // periodically calls update() from now on
                var self = this; 
                setInterval(function() {
                    self.updateData();
                }, this.config.updateInterval);
            }
        }
    },

    updateData: function() {
        var self = this;

        fetch("https://www.bigwhite.com/mountain-conditions/daily-snow-report")
            .then(res => res.text())
            .then(body => {
                const $ = cheerio.load(body);

                var info = {
                    timestamp: (new Date()).toLocaleString(),
                    temperature: parseInt($(".big-font").eq(0).text()),
                    newSnow: parseInt($(".big-font").eq(1).text()),
                    openLifts: parseInt($(".big-font").eq(2).text())
                };

                console.log("Sending big white update: " + JSON.stringify(info));

                self.sendSocketNotification("UPDATE", info);
            });
    }
});