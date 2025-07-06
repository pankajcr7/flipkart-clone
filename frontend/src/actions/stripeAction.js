import axios from "axios";

// Action types
export const STRIPE_PAYMENT_REQUEST = "STRIPE_PAYMENT_REQUEST";
export const STRIPE_PAYMENT_SUCCESS = "STRIPE_PAYMENT_SUCCESS";
export const STRIPE_PAYMENT_FAIL = "STRIPE_PAYMENT_FAIL";
export const STRIPE_KEY_REQUEST = "STRIPE_KEY_REQUEST";
export const STRIPE_KEY_SUCCESS = "STRIPE_KEY_SUCCESS";
export const STRIPE_KEY_FAIL = "STRIPE_KEY_FAIL";
export const CLEAR_STRIPE_ERRORS = "CLEAR_STRIPE_ERRORS";

// Create Stripe Payment Intent
export const createStripePaymentIntent = (amount, currency = "inr") => async (dispatch) => {
    try {
        dispatch({ type: STRIPE_PAYMENT_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post('/api/v1/stripe/payment-intent', { amount, currency }, config);

        dispatch({
            type: STRIPE_PAYMENT_SUCCESS,
            payload: data,
        });

        return data;

    } catch (error) {
        dispatch({
            type: STRIPE_PAYMENT_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        throw error;
    }
};

// Confirm Stripe Payment
export const confirmStripePayment = (payment_intent_id, payment_method_id) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post('/api/v1/stripe/confirm-payment', { 
            payment_intent_id, 
            payment_method_id 
        }, config);

        return data;

    } catch (error) {
        dispatch({
            type: STRIPE_PAYMENT_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        throw error;
    }
};

// Get Stripe Publishable Key
export const getStripePublishableKey = () => async (dispatch) => {
    try {
        dispatch({ type: STRIPE_KEY_REQUEST });

        const { data } = await axios.get('/api/v1/stripe/publishable-key');

        dispatch({
            type: STRIPE_KEY_SUCCESS,
            payload: data.publishableKey,
        });

        return data.publishableKey;

    } catch (error) {
        dispatch({
            type: STRIPE_KEY_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        throw error;
    }
};

// Clear Errors
export const clearStripeErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_STRIPE_ERRORS });
};
