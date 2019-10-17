const urlBuilder = require('../services/url-builder');
const apiRequest = require("../services/request-builder");
const treeBuilder  = require("../services/tree-builder");
const categoryService = require('./categoryService');
const productService = require('../products/productService');

module.exports = {
    list: function(request, response) {

        var categoryUrl= urlBuilder.magento.category({
            field: "is_active",
            value: 1,
            condition: "eq"
        });
        var result = {};

        apiRequest.magento(categoryUrl)
        .then(function(body) {
            result.categories = body.items;
            result.categoryIds = categoryService.extractIds(body.items);
            return result;
        })
        .then(function(result) {

            return productService.getProductCountByCategoryIds(result.categoryIds).then(function(productCount){
                // inject product count
                result.categories.forEach(function(cat) {
                    cat.product_count = productCount[cat.id];
                    cat.name = request.i18n_texts[cat.name] || cat.name;
                });
                result.productCount = productCount;

                return response.json(
                    treeBuilder.fromMagento.category(result.categories)
                );
            });

        });
    }
}
