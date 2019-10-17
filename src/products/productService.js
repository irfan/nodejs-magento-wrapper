const buildUrl = require('../services/url-builder');
const createRequest = require("../services/request-builder");
const treeBuilder  = require("../services/tree-builder");

module.exports = {

    getProductsByCategoryIds: function(categories) {

        var url = buildUrl.magento.productSearch({
            field: "category_id",
            value: categories.join(','),
            condition: "in"
        });

        return createRequest.magento(url).then(function(body){
            return body;
        });
    },

    getProductCountByCategoryIds: function(categories) {

        return this.getProductsByCategoryIds(categories).then(function(body){
            var result = {};
            body.items.forEach(function(product){
                product.extension_attributes.category_links.forEach(function(e){
                    if(result[e.category_id] !== undefined) {
                        result[e.category_id] += 1;
                    }
                    else {
                        result[e.category_id] = 1;
                    }
                });
            });

            return result;
        });
    }
}
