const apiRequest = require('../services/request-builder');
const urlBuilder = require('../services/url-builder');
const productService = require('../products/productService');

module.exports = {

    list: function() {
        let url = urlBuilder.magento.category({
            field: "is_active",
            value: 1,
            condition: "eq"
        });

        return apiRequest.magento(url);
    },

    extractIds: function(categories) {
        var category_ids = [];

        categories.map(function(e){
            category_ids.push(e.id);
        });

        return category_ids;
    }

}
