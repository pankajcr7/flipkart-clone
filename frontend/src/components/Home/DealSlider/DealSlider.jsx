import Product from './Product';
import Slider from 'react-slick';
import { NextBtn, PreviousBtn } from '../Banner/Banner';
import { Link } from 'react-router-dom';
import { getRandomProducts } from '../../../utils/functions';
import { useSelector } from 'react-redux';

export const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    swipe: false,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const DealSlider = ({ title }) => {
    const { products, loading } = useSelector((state) => state.products);

    return (
        <section className="bg-white w-full shadow overflow-hidden">
            {/* <!-- header --> */}
            <div className="flex px-6 py-3 justify-between items-center">
                <h1 className="text-xl font-medium">{title}</h1>
                <Link to="/products" className="bg-primary-blue text-xs font-medium text-white px-5 py-2.5 rounded-sm shadow-lg">VIEW ALL</Link>
            </div>
            <hr />
            {/* <!-- header --> */}

            {!loading && products && products.length > 0 && (
                <div className="px-4 py-2">
                    <Slider {...settings}>
                        {getRandomProducts(products, 12).map((product, i) => (
                            <div key={product._id || i} className="px-2">
                                <Product 
                                    _id={product._id}
                                    image={product.images && product.images[0] ? product.images[0].url : ''}
                                    name={product.name}
                                    offer={`₹${product.price?.toLocaleString()}`}
                                    tag="Featured"
                                    originalPrice={product.cuttedPrice}
                                    discount={product.cuttedPrice ? Math.round(((product.cuttedPrice - product.price) / product.cuttedPrice) * 100) : 0}
                                    rating={product.ratings || 4.0}
                                    reviews={`(${product.numOfReviews || 0})`}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

        </section>
    );
};

export default DealSlider;
