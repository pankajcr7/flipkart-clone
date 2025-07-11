import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import PriceSidebar from './PriceSidebar';
import SaveForLaterItem from './SaveForLaterItem';

const Cart = () => {

    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { saveForLaterItems } = useSelector((state) => state.saveForLater);

    const placeOrderHandler = () => {
        navigate('/login?redirect=shipping');
    }

    return (
        <>
            <MetaData title="Shopping Cart | Flipkart" />
            <main className="w-full mt-16 sm:mt-20">

                {/* <!-- row --> */}
                <div className="flex flex-col lg:flex-row gap-2 sm:gap-3.5 w-full sm:w-11/12 mt-2 sm:mt-4 m-auto px-2 sm:px-0 sm:mb-7">

                    {/* <!-- cart column --> */}
                    <div className="flex-1">

                        {/* <!-- cart items container --> */}
                        <div className="flex flex-col shadow bg-white rounded-sm">
                            <span className="font-medium text-base sm:text-lg px-3 sm:px-8 py-3 sm:py-4 border-b">My Cart ({cartItems.length})</span>

                            {cartItems && cartItems.length === 0 && (
                                <EmptyCart />
                            )}

                            {cartItems && cartItems.map((item) => (
                                <CartItem {...item} inCart={true} />
                            )
                            )}

                            {/* <!-- place order btn --> */}
                            <div className="flex justify-end">
                                <button onClick={placeOrderHandler} disabled={cartItems.length < 1 ? true : false} className={`${cartItems.length < 1 ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange"} w-full sm:w-1/3 mx-3 sm:mx-6 my-3 sm:my-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white shadow hover:shadow-lg rounded-sm`}>PLACE ORDER</button>
                            </div>
                            {/* <!-- place order btn --> */}

                        </div>
                        {/* <!-- cart items container --> */}

                        {/* <!-- saved for later items container --> */}
                        <div className="flex flex-col mt-3 sm:mt-5 shadow bg-white rounded-sm">
                            <span className="font-medium text-base sm:text-lg px-3 sm:px-8 py-3 sm:py-4 border-b">Saved For Later ({saveForLaterItems.length})</span>
                            {saveForLaterItems && saveForLaterItems.map((item) => (
                                <SaveForLaterItem {...item} />
                            )
                            )}
                        </div>
                        {/* <!-- saved for later container --> */}

                    </div>
                    {/* <!-- cart column --> */}

                    <PriceSidebar cartItems={cartItems} />

                </div>
                {/* <!-- row --> */}

            </main>
        </>
    );
};

export default Cart;
