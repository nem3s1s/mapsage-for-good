module.exports = function(app) {
	var customersController = require('../controllers/customersController')

	app.route('/customers/register')
		.post(customersController.handleRegisterRequest)

	app.route('/customers/profile')
		.get(customersController.readCustomerByJwt)
};
