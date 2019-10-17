# nodejs-magento-wrapper

## Installation
- Clone the repository
- Add your host, consumer and access keys to config.js
- Run `npm install`
- Run `node index.js`

### Features

#### Listing The Countries
- Visit `http://localhost:3000/api/V1/countries` to get the list of countries that fetched from Magento backend
- Localization is possible by "Accept-Language" header in this endpoint

#### Listing The Categories
- Visit `http://localhost:3000/api/V1/categories` to get the list of categories that fetched from Magento backend
- Localization is possible by "Accept-Language" header in this endpoint

#### Command line script to feed elasticsearch server
- Install docker
- Execute `docker pull docker.elastic.co/elasticsearch/elasticsearch:7.4.0`
- Execute `docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.4.0`
- Execute `node update-elasticsearch.js`
Then you should see an output like:
```
Index products not found
Creating products index..
Fetching products..
1020 products indexed, took 1139
```
- By this you created an index called products and filled the index by your products information for your search endpoints
- Make a `http://localhost:3000/api/V1/products?q=search_keyword&limit=20&offset=0` to get first 20 products from your elasticsearch search engine.

#### Create a customer 
```
curl -X POST http://localhost:3000/api/V1/customers -H "Content-Type:application/json" -d '{
    "email": "myemail@mydomain.com",
    "firstname": "Irfan",
    "lastname": "Durmus",
    "password": "my1Secret1Password"
}'
```
- If you make a request like above you create a customer.
- All customer data validated
- On success you will get 201, on validation errors 400 and magento errors presented by 400.
- Localization is possible by "Accept-Language" header in this endpoint

#### Import customer from a CSV file
- Execute `node validate-create-customers.js`
- Reads data from `csv2validate.csv` file
- Makes data validation
- Converts all rows to customer by making request to Magento backend
- If any of them not valid throws and exception and does not makes any request.
- If all data valid, then makes request without asking you


Note: This is just an example app to show how to wrap magento API to create wrapper service
