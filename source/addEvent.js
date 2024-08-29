var request = require('request');
module.exports = function(RED) {
    "use strict";
    function startAutolearner(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.on('input', function(msg) {
            n.uid = msg.tittle ? msg.tittle : n.tittle
            const api = msg.api ? msg.api : 'http://127.0.0.1:8080'
            const token = msg.token ? msg.token : n.token
            var newObj = {
                summary: n.tittle,
                description: n.description,
                location: n.location,
                start: {dateTime: new Date(timeStart)},
                end: {dateTime: new Date(timeEnd)},
                attendees: arrAttend
            }
            
            var linkUrl = api + '/create'
            var opts = {
                method: "POST",
                url: linkUrl,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(newObj)
            };
            request(opts, function (error, response, body) {
                if (error) {
                    node.error(error,{});
                    node.status({fill:"red",shape:"ring",text:"autotrain.status.failed"});
                    return;
                }            
                if (JSON.parse(body).kind == "calendar#event") {
                    msg.payload = "Started training model:  " + n.uid
                } else {
                    msg.payload = "Fail"
                }
                
                node.send(msg);
            })        
        });
    }
    RED.nodes.registerType("startAutolearner", startAutolearner);

};
