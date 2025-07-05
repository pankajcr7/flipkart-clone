const express = require('express');
const { 
    processPayment, 
    paytmResponse, 
    getPaymentStatus, 
    createRazorpayOrder, 
    verifyRazorpayPayment, 
    getRazorpayKey 
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

// Common routes
router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;
