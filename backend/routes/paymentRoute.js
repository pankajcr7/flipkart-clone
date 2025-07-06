const express = require('express');
const { 
    processPayment, 
    paytmResponse, 
    getPaymentStatus, 
    createRazorpayOrder, 
    verifyRazorpayPayment, 
    getRazorpayKey,
    createStripePaymentIntent,
    confirmStripePayment,
    getStripePublishableKey
} = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

// Paytm routes
router.route('/payment/process').post(processPayment);
router.route('/callback').post(paytmResponse);

// Razorpay routes
router.route('/razorpay/order').post(isAuthenticatedUser, createRazorpayOrder);
router.route('/razorpay/verify').post(isAuthenticatedUser, verifyRazorpayPayment);
router.route('/razorpay/key').get(isAuthenticatedUser, getRazorpayKey);

// Stripe routes
router.route('/stripe/payment-intent').post(isAuthenticatedUser, createStripePaymentIntent);
router.route('/stripe/confirm-payment').post(isAuthenticatedUser, confirmStripePayment);
router.route('/stripe/publishable-key').get(isAuthenticatedUser, getStripePublishableKey);

// Common routes
router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;
