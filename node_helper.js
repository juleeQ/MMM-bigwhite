var NodeHelper = require("node_helper");

const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = NodeHelper.create({
    config: false,

    socketNotificationReceived: function(notification, payload) {
        console.log("Node helper big white received");

        if (notification === "CONFIG" && !this.started) {
            this.started = true;
            this.config = payload;

            console.log("Node helper big white started");

            this.updateData();

            // periodically calls update() from now on
            var self = this; 
            setInterval(function() {
                self.updateData();
            }, this.config.updateInterval);
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