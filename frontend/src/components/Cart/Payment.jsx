import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
import { clearErrors, newOrder } from '../../actions/orderAction';
import { emptyCart } from '../../actions/cartAction';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import MetaData from '../Layouts/MetaData';

const Payment = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    // const stripe = useStripe();
    // const elements = useElements();
    // const paymentBtn = useRef(null);

    const [payDisable, setPayDisable] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('paytm');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [inputError, setInputError] = useState('');

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

    // Simulated payment success function
    const handlePaymentSuccess = () => {
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
        setPayDisable(true);

        // Simulate payment processing for both payment methods
        handlePaymentSuccess();
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

                                    <input type="submit" value={`Pay ₹${totalPrice.toLocaleString()}`} disabled={payDisable ? true : false} className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`} />

                                </form>

                                {/* stripe form */}
                                {/* <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-8 my-4">
                                <div>
                                    <CardNumberElement />
                                </div>
                                <div>
                                    <CardExpiryElement />
                                </div>
                                <div>
                                    <CardCvcElement />
                                </div>
                                <input ref={paymentBtn} type="submit" value="Pay" className="bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none cursor-pointer" />
                            </form> */}
                                {/* stripe form */}

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