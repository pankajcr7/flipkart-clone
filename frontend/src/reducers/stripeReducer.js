import {
    STRIPE_PAYMENT_REQUEST,
    STRIPE_PAYMENT_SUCCESS,
    STRIPE_PAYMENT_FAIL,
    STRIPE_KEY_REQUEST,
    STRIPE_KEY_SUCCESS,
    STRIPE_KEY_FAIL,
    CLEAR_STRIPE_ERRORS
} from "../actions/stripeAction";

// Stripe Payment Reducer
export const stripePaymentReducer = (state = {}, action) => {
    switch (action.type) {
        case STRIPE_PAYMENT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case STRIPE_PAYMENT_SUCCESS:
            return {
                loading: false,
                paymentIntent: action.payload,
            };
        case STRIPE_PAYMENT_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_STRIPE_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// Stripe Key Reducer
export const stripeKeyReducer = (state = {}, action) => {
    switch (action.type) {
        case STRIPE_KEY_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case STRIPE_KEY_SUCCESS:
            return {
                loading: false,
                publishableKey: action.payload,
            };
        case STRIPE_KEY_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_STRIPE_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
