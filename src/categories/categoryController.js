const buildUrl = require('../services/url-builder');
const createRequest = require("../services/request-builder");

module.exports = {

    list: function(request, response) {
        var url = buildUrl.magento.category({
            field: "is_active",
            value: 1,
            condition: "eq"
        });

        createRequest.magento(url, function(er, result, body){
            response.json(body);
        });

    }
}

