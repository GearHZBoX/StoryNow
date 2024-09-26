const stripe = require('stripe')('sk_test_51Q2xHaK0pp9uOY0tiiJWg0SjgmZM08Tyt55eSHV9RERgTZPPj8ZaDPJQJUkKixDBqjFOe5NJS7nBKt2S9rV6VoD100zslm8hf8');

const create = async (params, order) => {
	const charge = await stripe.charges.create({
	  source: params.id,
	  currency: order.currency_code,
	  amount: (order.amount * 100).toFixed(),
	  capture: false,
	});

	return charge;
};

const capture = async (params) => {
	const charge = await stripe.charges.capture(params.id);
	return charge
}

module.exports = {
	create,
	capture,
}