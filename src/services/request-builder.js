const request = require("request");
const config = require('../../config');

module.exports = {
    magento: function(url, callback) {

        var token = 'Bearer ' + config.access_token;

        request(url, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            json: true
        }, function(err, result, body) {
            // TODO: implement better error handling
            if (err) { return console.log(err); }
            callback(err, result, body);
        });
    }
}
