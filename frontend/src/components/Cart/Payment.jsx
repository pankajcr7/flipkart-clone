import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
import { clearErrors, newOrder } from '../../actions/orderAction';
import { emptyCart } from '../../actions/cartAction';
import { createStripePaymentIntent, getStripePublishableKey, clearStripeErrors } from '../../actions/stripeAction';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import MetaData from '../Layouts/MetaData';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe Promise
let stripePromise = null;

// Mock Stripe Payment Form Component (works without real Stripe keys)
const StripePaymentForm = ({ totalPrice, shippingInfo, cartItems, onPaymentSuccess }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [processing, setProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [inputError, setInputError] = useState('');

    // Mock card validation
    const validateMockCard = () => {
        setInputError('');
        
        if (!cardNumber.trim()) {
            setInputError('Please enter card number');
            return false;
        }
        
        // Remove spaces and check if it's all numbers
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(cleanCardNumber)) {
            setInputError('Please enter a valid card number (13-19 digits)');
            return false;
        }
        
        if (!cardExpiry.trim()) {
            setInputError('Please enter expiry date');
            return false;
        }
        
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry)) {
            setInputError('Please enter expiry in MM/YY format');
            return false;
        }
        
        if (!cardCvv.trim()) {
            setInputError('Please enter CVV');
            return false;
        }
        
        if (!/^\d{3,4}$/.test(cardCvv)) {
            setInputError('Please enter a valid CVV (3-4 digits)');
            return false;
        }
        
        if (!cardName.trim()) {
            setInputError('Please enter cardholder name');
            return false;
        }
        
        return true;
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        // Remove all non-digits
        const cleanValue = value.replace(/\D/g, '');
        // Add spaces every 4 digits
        const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formattedValue;
    };

    // Format expiry date
    const formatExpiry = (value) => {
        // Remove all non-digits
        const cleanValue = value.replace(/\D/g, '');
        // Add slash after 2 digits
        if (cleanValue.length >= 2) {
            return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
        }
        return cleanValue;
    };

    const handleMockStripePayment = async (e) => {
        e.preventDefault();
        
        if (!validateMockCard()) {
            return;
        }

        setProcessing(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check for specific test card numbers that should fail
            const cleanCardNumber = cardNumber.replace(/\s/g, '');
            
            // Simulate different card responses
            if (cleanCardNumber === '4000000000000002') {
                throw new Error('Your card was declined.');
            }
            if (cleanCardNumber === '4000000000009995') {
                throw new Error('Your card has insufficient funds.');
            }
            if (cleanCardNumber === '4000000000000119') {
                throw new Error('An error occurred while processing your card.');
            }
            
            // All other cards succeed
            enqueueSnackbar('Payment successful!', { variant: 'success' });
            onPaymentSuccess({
                id: `stripe_mock_${Date.now()}`,
                status: 'succeeded',
                method: 'Stripe (Mock)',
                cardLast4: cleanCardNumber.slice(-4),
                cardBrand: getCardBrand(cleanCardNumber)
            });
            
        } catch (error) {
            enqueueSnackbar(error.message || 'Payment failed', { variant: 'error' });
            setProcessing(false);
        }
    };

    // Detect card brand based on card number
    const getCardBrand = (cardNumber) => {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        if (/^4/.test(cleanNumber)) return 'Visa';
        if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
        if (/^3[47]/.test(cleanNumber)) return 'American Express';
        if (/^6/.test(cleanNumber)) return 'Discover';
        return 'Unknown';
    };

    return (
        <form onSubmit={handleMockStripePayment} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 my-4">
                <label className="text-sm font-medium text-gray-700">Card Details</label>
                
                {/* Card Number */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">Card Number</label>
                    <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            if (formatted.replace(/\s/g, '').length <= 19) {
                                setCardNumber(formatted);
                            }
                        }}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                        maxLength="23"
                    />
                </div>

                {/* Card Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">Cardholder Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                    />
                </div>

                {/* Expiry and CVV */}
                <div className="flex gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => {
                                const formatted = formatExpiry(e.target.value);
                                setCardExpiry(formatted);
                            }}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                            maxLength="5"
                        />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-medium text-gray-600">CVV</label>
                        <input
                            type="text"
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) {
                                    setCardCvv(value);
                                }
                            }}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                            maxLength="4"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {inputError && (
                    <div className="text-red-500 text-sm">
                        {inputError}
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
                    <p className="font-medium mb-1">Test Cards (Mock Mode):</p>
                    <p>• 4242424242424242 - Success</p>
                    <p>• 4000000000000002 - Card Declined</p>
                    <p>• 4000000000009995 - Insufficient Funds</p>
                    <p>• Any other number - Success</p>
                    <p className="mt-1 text-xs">Use any future expiry date and any CVV</p>
                </div>
                
                <p className="text-xs text-gray-500">This is a mock payment form for testing purposes.</p>
            </div>
            
            <button
                type="submit"
                disabled={processing}
                className={`${
                    processing
                        ? "bg-primary-grey cursor-not-allowed"
                        : "bg-primary-orange cursor-pointer hover:shadow-lg"
                } w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow rounded-sm uppercase outline-none`}
            >
                {processing ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString()}`}
            </button>
        </form>
    );
};

const Payment = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [payDisable, setPayDisable] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('paytm');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [inputError, setInputError] = useState('');
    const [stripeLoaded, setStripeLoaded] = useState(false);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);
    const { publishableKey } = useSelector((state) => state.stripeKey);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Mock Stripe is always "loaded"
    useEffect(() => {
        setStripeLoaded(true);
    }, []);

    // Handle payment success
    const handlePaymentSuccess = (paymentInfo) => {
        // Create order object
        const order = {
            shippingInfo,
            orderItems: cartItems,
            totalPrice,
            paymentInfo
        };
        
        // Dispatch actions to create order and clear cart
        dispatch(newOrder(order));
        dispatch(emptyCart());
        
        // Navigate to order success page
        navigate('/order/success');
        
        setPayDisable(false);
    };

    // Validation function
    const validatePaymentDetails = () => {
        setInputError('');
        
        if (paymentMethod === 'upi') {
            if (!upiId.trim()) {
                setInputError('Please enter UPI ID');
                return false;
            }
            if (!upiId.includes('@')) {
                setInputError('Please enter a valid UPI ID (e.g., user@paytm)');
                return false;
            }
        } else if (paymentMethod === 'card') {
            if (!cardNumber.trim()) {
                setInputError('Please enter card number');
                return false;
            }
            if (cardNumber.length < 16) {
                setInputError('Card number must be at least 16 digits');
                return false;
            }
            if (!cardExpiry.trim()) {
                setInputError('Please enter card expiry date');
                return false;
            }
            if (!cardCvv.trim()) {
                setInputError('Please enter CVV');
                return false;
            }
            if (!cardHolderName.trim()) {
                setInputError('Please enter card holder name');
                return false;
            }
        }
        return true;
    };

    // Simulated payment success function for non-Stripe payments
    const handleNonStripePaymentSuccess = () => {
        // Simulate a brief delay to mimic real payment processing
        setTimeout(() => {
            enqueueSnackbar('Payment successful!', { variant: 'success' });
            
            // Create order object with simulated payment info
            const order = {
                shippingInfo,
                orderItems: cartItems,
                totalPrice,
                paymentInfo: {
                    id: `simulated_${paymentMethod}_${Date.now()}`,
                    status: 'succeeded',
                    method: paymentMethod === 'razorpay' ? 'Razorpay' : 'Paytm'
                }
            };
            
            // Dispatch actions to create order and clear cart
            dispatch(newOrder(order));
            dispatch(emptyCart());
            
            // Navigate to order success page
            navigate('/order/success');
            
            setPayDisable(false);
        }, 1500); // 1.5 second delay to simulate processing
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Don't handle Stripe payments here - they have their own form
        if (paymentMethod === 'stripe') {
            return;
        }
        
        setPayDisable(true);

        // Validate payment details for non-Stripe methods
        if (!validatePaymentDetails()) {
            setPayDisable(false);
            enqueueSnackbar(inputError, { variant: 'error' });
            return;
        }

        // Simulate payment processing for non-Stripe payment methods
        handleNonStripePaymentSuccess();
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);


    return (
        <>
            <MetaData title="Flipkart: Secure Payment | Paytm & Razorpay" />

            <main className="w-full mt-20">

                {/* <!-- row --> */}
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">

                    {/* <!-- cart column --> */}
                    <div className="flex-1">

                        <Stepper activeStep={3}>
                            <div className="w-full bg-white">

                                <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            name="payment-radio-button"
                                        >
                                            <FormControlLabel
                                                value="paytm"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://rukminim1.flixcart.com/www/96/96/promos/01/09/2020/a07396d4-0543-4b19-8406-b9fcbf5fd735.png" alt="Paytm Logo" />
                                                        <span>Paytm</span>
                                                    </div>
                                                }
                                            />
                                            <FormControlLabel
                                                value="razorpay"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay Logo" />
                                                        <span>Razorpay</span>
                                                    </div>
                                                }
                                            />
                                            <FormControlLabel
                                                value="upi"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI Logo" />
                                                        <span>UPI</span>
                                                    </div>
                                                }
                                            />
                                            <FormControlLabel
                                                value="card"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Card Logo" />
                                                        <span>Credit/Debit Card</span>
                                                    </div>
                                                }
                                            />
                                            <FormControlLabel
                                                value="stripe"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe Logo" />
                                                        <span>Stripe Payment</span>
                                                    </div>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    {/* UPI Input Field */}
                                    {paymentMethod === "upi" && (
                                        <div className="flex flex-col gap-2 my-4">
                                            <label className="text-sm font-medium text-gray-700">Enter UPI ID</label>
                                            <input
                                                type="text"
                                                placeholder="example@upi"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Card Input Fields */}
                                    {paymentMethod === "card" && (
                                        <div className="flex flex-col gap-3 my-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-700">Card Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={cardHolderName}
                                                    onChange={(e) => setCardHolderName(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(e.target.value)}
                                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <label className="text-sm font-medium text-gray-700">CVV</label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        value={cardCvv}
                                                        onChange={(e) => setCardCvv(e.target.value)}
                                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Display error message if any */}
                                    {inputError && (
                                        <div className="text-red-500 text-sm my-2">
                                            {inputError}
                                        </div>
                                    )}

                                    {/* Only show pay button for non-Stripe payment methods */}
                                    {paymentMethod !== "stripe" && (
                                        <input type="submit" value={`Pay ₹${totalPrice.toLocaleString()}`} disabled={payDisable ? true : false} className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`} />
                                    )}

                                </form>

                                {/* Stripe Payment Form (Mock) */}
                                {paymentMethod === "stripe" && stripeLoaded && (
                                    <div className="mx-8 my-4">
                                        <StripePaymentForm
                                            totalPrice={totalPrice}
                                            shippingInfo={shippingInfo}
                                            cartItems={cartItems}
                                            onPaymentSuccess={handlePaymentSuccess}
                                        />
                                    </div>
                                )}

                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;