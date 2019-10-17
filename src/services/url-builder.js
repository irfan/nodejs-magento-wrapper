const config = require("../../config");

// TODO: needs maintain, too messy
module.exports = {
    magento: {
        customer: function(){
            return config.api.host + `customers`;
        },
        category: function(opt) {
            return config.api.host + `categories/list?searchCriteria[filter_groups][0][filters][0][field]=${opt.field}&searchCriteria[filter_groups][0][filters][0][value]=${opt.value}&searchCriteria[filter_groups][0][filters][0][condition_type]=${opt.condition}`;
        },
        productSearch: function(opt) {
            return config.api.host + `products?searchCriteria[filter_groups][0][filters][0][field]=${opt.field}&searchCriteria[filter_groups][0][filters][0][value]=[${opt.value}]&searchCriteria[filter_groups][0][filters][0][condition_type]=${opt.condition}`;
        },
        countries: function() {
            return config.api.host + `directory/countries`;
        }
    }
}
