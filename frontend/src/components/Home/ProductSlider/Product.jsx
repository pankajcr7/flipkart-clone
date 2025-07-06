import { getDiscount } from '../../../utils/functions';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../actions/wishlistAction';
import { useSnackbar } from 'notistack';

const Product = (props) => {
    const { _id, name, images, ratings, numOfReviews, price, cuttedPrice } = props;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);
    
    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const addToWishlistHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/150x150/f1f1f1/999999?text=Product+Image';
    };

    const discountPercentage = getDiscount(price, cuttedPrice);

    return (
        <div className="group relative">
            <Link to={`/product/${_id}`} className="block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-4 relative overflow-hidden">
                    {/* Wishlist Heart Icon */}
                    <button 
                        onClick={addToWishlistHandler}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {itemInWishlist ? (
                            <FavoriteIcon className="text-red-500" sx={{ fontSize: '18px' }} />
                        ) : (
                            <FavoriteBorderIcon className="text-gray-400 hover:text-red-500" sx={{ fontSize: '18px' }} />
                        )}
                    </button>

                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
                            {discountPercentage}% OFF
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="w-full h-48 flex items-center justify-center mb-4 bg-gray-50 rounded-lg overflow-hidden">
                        <img 
                            draggable="false" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                            src={images[0]?.url} 
                            alt={name}
                            onError={handleImageError}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                        {/* Product Name */}
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                            {name.length > 45 ? `${name.substring(0, 45)}...` : name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <div className="flex items-center bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                                <span>{ratings.toFixed(1)}</span>
                                <StarIcon sx={{ fontSize: '12px', marginLeft: '2px' }} />
                            </div>
                            <span className="text-xs text-gray-500">({numOfReviews.toLocaleString()})</span>
                        </div>

                        {/* Price Section */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">₹{price.toLocaleString()}</span>
                                <span className="text-sm text-gray-500 line-through">₹{cuttedPrice.toLocaleString()}</span>
                            </div>
                            <span className="inline-block text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                {discountPercentage}% off
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Product;
