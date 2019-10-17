const validationResult = require('express-validator').validationResult;
const check = require('express-validator').check;

const customerService = require('./customerService');

module.exports = {
    validateCreate: function() {
        return [
            check('email', 'Email is not valid').trim().isEmail(),
            check('password', 'Password is too short').isLength({min:5}).matches(/(?=.*[a-zA-Z])(?=.*\d)/),
            check('firstname', 'Firstname is required').trim().not().isEmpty(),
            check('lastname', 'Lastname is required').trim().not().isEmpty(),
        ];
    },
    create: function(request, response) {
        var validation = validationResult(request);
        var result = {};

        // validation error
        if(validation.errors.length > 0) {
            result.success = false,
            result.errors = {};

            validation.errors.forEach(function(e){
                result.errors[e.param] = request.i18n_texts[e.msg] || e.msg;
            });

            response.status(400).json(result);
        }

        // success in validation
        if (!validation.errors.length) {
            customerService.createCustomer({
                customer: {
                    email: request.body.email,
                    firstname: request.body.firstname,
                    lastname: request.body.lastname,
                    storeId: 1,
                    websiteId: 1
                },
                password: request.body.password
            }).then(function(resp) {
                result.success = true,
                result.id = resp.body.id;
                response.status(200).json(result);
            }).catch(function(resp) {
                console.error(`An error occur by create customer request. Server message:  ${resp.error.message}`);
                result.success = false,
                result.errors = {
                    backend: request.i18n_texts[resp.error.message] || resp.error.message
                };
                response.status(400).json(result);
            });
        }
    }
}
