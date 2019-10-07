/* for language options see https://github.com/i18next/i18next-express-middleware */

module.exports = {
    "api": {
        "host": "",
        "map":{
            "countries": "directory/countries",
            "categories": "categories",
            "products": "products"
        }
    },
    "consumer_key": "",
    "consumer_secret": "",
    "access_token": "",
    "acccess_token_secret": "",
    "language_options": {
        "order": ["header" /*, "cookie", "querystring", "path", "session" */],
        "lookupHeader": "accept-language",
        "caches": false
    }
}
