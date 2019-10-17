#!/usr/bin/env node

// TODO: To prevent possible duplication would be good to
// implement a backup strategy and re-create index.
// Suggestion, create a products-backup and products-latest or create a diff.

const productService = require('./src/products/productService');
const categoryService = require('./src/categories/categoryService');
const config = require('./config');
const elasticsearch = require('@elastic/elasticsearch');

const client = new elasticsearch.Client({
    node: config.elasticsearch_host
});

const index = 'products';


/*
* @Description Creates a new index in the elasticsearch if not exists
*/
function createIndex(indexName, callback) {
    console.log(`Creating ${indexName} index..`);
    client.indices.create({
        index: indexName,
        body: {
            mappings: {
                properties: {
                    id: { type: 'integer' },
                    sku: { type: 'keyword' },
                    name: { type: 'text' },
                    price: {
                        type: 'scaled_float',
                        scaling_factor: 100
                    },
                    image: { type: 'keyword' },
                    description: { type: 'text' }
                }
            }
        }
    }, function(err, resp) {
        if (resp.statusCode === 200) {
            callback(resp);
        }
    });
}

/**
 * @Description Checks and deletes index if exists
 */
function checkIndex(indexName, callback) {

    client.indices.exists({index: indexName}, function(error, response) {
        if (response.statusCode === 404) {
            console.log(`Index ${indexName} not found`);
            createIndex(indexName, callback);
        }

        if (response.statusCode === 200) {

            console.log(`Index ${indexName} exists`);

            client.indices.delete({index: indexName}).then(function(resp){
                if (resp.statusCode === 200) {
                    console.log(`Index ${indexName} deleted`);
                    createIndex(indexName, callback);
                }
                else {
                    console.log(`Delete index ${indexName} failed, response is`, resp);
                }
            });
        }

    });
}

/**
 * @Description Fetch all products and prepare to push elasticsearch
 */
function fetchProducts(callback) {
    console.log('Fetching products..');

    var categoryIds,
        products = [];

    // fetch category ids
    categoryService.list().then(function(body) {
        categoryIds = categoryService.extractIds(body.items);

        // get all products belongs to these ids
        productService.getProductsByCategoryIds(categoryIds).then(function(response) {
            var image, description;

            response.items.forEach(function(p) {
                // prepare image
                image = p.media_gallery_entries.shift() || '';
                if (image !== '') {
                    image = image.file;
                }
                // prepare description
                if(undefined !== p.custom_attributes) {
                    description = '';
                    p.custom_attributes.forEach(function(attr){
                        if (attr.attribute_code === 'description') {
                            description = attr.value;
                        }
                    });
                }
                // push all product objects to the products array
                products.push({
                    index: {
                        _index: index
                    },
                    doc: {
                        id: p.id,
                        sku: p.sku,
                        name: p.name,
                        price: p.price,
                        image: image,
                        description: description
                    }
                });
            });

            callback(products);
        });
    });
}


/**
 * @Description Update whole products
 */
function main () {

    checkIndex(index, function(response) {
        if(response.statusCode === 200) {

            fetchProducts(function(products){
                client.bulk({
                    index: index,
                    refresh: true,
                    body: products
                }, function(err, resp){

                    if (resp.statusCode === 200) {
                        console.log(`${resp.body.items.length} products indexed, took ${resp.body.took}`);
                    }

                    if (resp.body.errors) {
                        const errors = [];

                        response.items.forEach(function(action, i){
                            const operation = Object.keys(action)[0];
                            if(action[operation].error) {
                                errors.push({
                                    status: action[operation].status,
                                    error: action[operation].error,
                                    operation: body[i * 2],
                                    document: body[i * 2 + 1]
                                });
                            }
                        });
                        console.log(errors);
                    }

                });
            });
        }
    });
}
main();

