const express = require('express');
const config = require('./config');
const app = express();
const router = require('./router');
const bodyParser = require('body-parser');
const path = require('path');
const i18n = require('i18n-express');

const port = 3000;


module.exports = function(cluster) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(i18n({
        translationsPath: path.join(__dirname, 'lang'),
        siteLangs: ['en', 'ar', 'tr'],
        browserEnable: true,
        defaultLang: 'en',
    }));

    require('./router')(app);

    app.listen(port, function () {
        console.log(`Wrapper server started on port ${port}`);
    });
}
