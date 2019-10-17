// list of the response services will be loaded here

const config = require('./config');
const categoryController = require('./src/categories/categoryController');
const countryController = require('./src/countries/countryController');
const productController = require('./src/products/productController');
const customerController = require('./src/customers/customerController');

module.exports = function(app) {


    app.all('*', function(req, res, next){
        res.header("Acess-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Method", "GET, POST, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Access-Token, Content-Type, X-Requested-With, Accept");

        if (res.method == 'OPTIONS') {
            res.status(200).end('');
            return;
        }
        next();
    });

    // list of restricted urls will be added
    app.all(['/list-of-restricted'], function(req, res){
        res.status(401).end("Restricted API");
    });

    app.get('/', function(req, res){
        res.send('Welcome to the Magento Wrapper API');
    });

    app.get("/api/V1/categories", categoryController.list);
    app.get("/api/V1/countries", countryController.list);
    app.get("/api/V1/products", productController.list);
    app.post("/api/V1/customers", customerController.validateCreate(), customerController.create);

}
