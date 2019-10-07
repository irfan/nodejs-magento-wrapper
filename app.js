const express = require('express');
const config = require('./config');
const app = express();
const router = require('./router');
const bodyParser = require('body-parser');

const port = 3000;

/* const i18next = require("i18next");
const i18n = require("i18next-express-middleware");


i18next.use(i18n.LanguageDetector).init({
  preload: ["en", "tr", "ar"],
  detection: config.language_options
});
*/

module.exports = function(cluster) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
/*
    app.use(
        i18n.handle(i18next,{
            removeLngFromUrl: false
        })
    );
*/
    require('./router')(app);

    app.listen(port, function () {
        console.log(`Wrapper server started on port ${port}`);
    });
}
