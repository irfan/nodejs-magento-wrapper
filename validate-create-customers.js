#!/usr/bin/env node

const csvReader = require('csvtojson');
const validator = require('validator');
const file = './csv2validate.csv';
const apiHost = 'http://localhost:3000/api/V1/customers';
const request = require('request-promise');

var customersArray;

/**
 * @Description check if any missing key
 */
function validateMissingKeys() {
    var i = 0, customer, keys, isValid = false,  mandatoryFields = ['email', 'firstname', 'lastname', 'password'];
    try {
        for (i; i < customersArray.length; i++) {
            customer = customersArray[i];
            keys = Object.keys(customer);

            mandatoryFields.forEach(function(key) {
                if (!customer.hasOwnProperty(key)) {
                    throw new Error(`${key} is not exist on line ${i + 2}`);
                }
            });
        }
    }
    catch (e) {
        console.error(e.message);
        return false;
    }
    return true;
}

/**
 * @Description validates strings
 */
function validateFields() {
    var i = 0, customer, isValid = [];
    try {
        for (i; i < customersArray.length; i++) {
            customer = customersArray[i];
            isValid = [];
            isValid.push(!validator.isEmpty(validator.trim(customer.firstname)));
            isValid.push(!validator.isEmpty(validator.trim(customer.lastname)));
            isValid.push(validator.isEmail(validator.trim(customer.email)));
            isValid.push(validator.isLength(validator.trim(customer.password), { min: 5 }));
            isValid.push(validator.matches(customer.password, /(?=.*[a-zA-Z])(?=.*\d)/));

            if (isValid.includes(false)) {
                console.log(isValid);
                throw new Error(`Invalid data, line number ${i + 2} in the csv file`);
            }
        }
    }
    catch (e) {
        console.error(e.message);
        return false;
    }
    console.log(`All fields valid`);
    return true;
}

/**
 * @Description A recursive function to create customers one by one
 */
function createCustomers() {
    console.log(`Customers creating.. ${customersArray.length} customer remaining`);
    var customer = customersArray.shift();

    request.post(apiHost, {
        json: customer
    }, function(err, resp, body) {
        if (resp.statusCode === 200) {
            if (customersArray.length > 0) {
                console.log(` -> Created: ${JSON.stringify(customer)}`);
                createCustomers();
            }
            else {
                console.log(`Completed! The last customer created is: ${JSON.stringify(customer)}`);
            }
        }
        else {
            throw new Error(resp.statusMessage);
        }
    })
}

function main() {
    csvReader().fromFile(file)
        .then(function(fileContext){
            customersArray = fileContext;
        }).then(function() {
            if (!validateMissingKeys()) {
                throw new Error('Missing keys found!');
            }
        })
        .then(function() {
            if (!validateFields()) {
                throw new Error('Invalid field data found!');
            }
        }).then(function() {
            createCustomers();
        });
}


main();
