const config = require("../../config");

module.exports = {
    magento: {
        category: function(opt) {
            // TODO: needs maintain, too complex
            return config.api.host + `categories/list?searchCriteria[filter_groups][0][filters][0][field]=${opt.field}&searchCriteria[filter_groups][0][filters][0][value]=${opt.value}&searchCriteria[filter_groups][0][filters][0][condition_type]=${opt.condition}`;
        }
    }
}
