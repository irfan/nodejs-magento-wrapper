const request = require("request-promise");
const config = require('../../config');

const magentoToken = 'Bearer ' + config.access_token;

module.exports = {
    magento: function(url) {

        return request(url, {
            method: 'GET',
            headers: {
                'Authorization': magentoToken,
                'Content-Type': 'application/json'
            },
            json: true
        });
    },
    post: {
        magento: function(url, data) {
            return request(url, {
                method: 'POST',
                headers: {
                    'Authorization': magentoToken,
                    'Content-Type': 'application/json'
                },
                json: true,
                body: data
            });
        }
    },
    // TODO: deprecated, will be deleted
    elasticsearch: {
        post: function(url, data) {
            return request(url, {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                },
                json: true
            });
        }
    }
}
