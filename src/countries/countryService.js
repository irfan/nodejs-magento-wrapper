const urlBuilder = require('../services/url-builder');
const createRequest = require("../services/request-builder");

module.exports = {
    list: function() {

        var url = urlBuilder.magento.countries();

        return createRequest.magento(url).then(function(body) {
            return body;
        });

    }
}
