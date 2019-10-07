// list of the response services will be loaded here

const config = require('./config');
const categoryController = require('./src/categories/categoryController');

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

}
