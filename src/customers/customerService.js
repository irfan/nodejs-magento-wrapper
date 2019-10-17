const urlBuilder = require('../services/url-builder');
const createRequest = require("../services/request-builder");
const treeBuilder  = require("../services/tree-builder");

module.exports = {

    createCustomer: function(data) {
        const url = urlBuilder.magento.customer();

        return createRequest.post.magento(url, data);
    }
}
