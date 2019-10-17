const countryService = require('./countryService');

module.exports = {
    list: function(request, response) {

        countryService.list().then(function(body){
            var result = [];
            body.forEach(function(item) {
                result.push({
                    "id": item.id,
                    "name": request.i18n_texts[item.full_name_english] || item.full_name_english
                });
            });
            return response.json(result);
        });
    }
}
