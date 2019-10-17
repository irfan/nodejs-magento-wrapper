const elasticsearch = require('@elastic/elasticsearch');
const config = require('../../config');

const index = 'products';
const client = new elasticsearch.Client({
    node: config.elasticsearch_host
});

module.exports = {
    list: function(request, response) {

        var limit = request.query.limit || 20,
            offset = request.query.offset || 0,
            q = request.query.q || '';

        client.search({
            index: index,
            from: offset,
            size: limit,
            body: {
                query: {
                    multi_match: {
                        fields: ['doc.description','doc.name'],
                        query: q
                    }
                }
            }
        }).then(function(resp) {
            let total = resp.body.hits.total.value;
            let result = {
                items: [],
                search_params: [],
                limit: 20,
                offset: 0,
                total: total
            };

            if(q) {
                result.search_params.push(q);
            }

            resp.body.hits.hits.forEach(function(product) {
                result.items.push(product._source.doc);
            });
            console.log(`Got search request, limit ${limit}, offset ${offset}, query "${q}". Total ${total} objects found`);
            response.json(result)
        });
    }
}
