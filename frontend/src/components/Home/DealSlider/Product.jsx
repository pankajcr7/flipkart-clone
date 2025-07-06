import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';

const Product = ({ _id, image, name, offer, tag, originalPrice, discount, rating, reviews }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/150x150/f1f1f1/999999?text=Product+Image';
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="group relative">
            <Link to={`/product/${_id}`} className="block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-4 relative overflow-hidden">
                    {/* Wishlist Heart Icon */}
                    <button 
                        onClick={toggleWishlist}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {isWishlisted ? (
                            <FavoriteIcon className="text-red-500" sx={{ fontSize: '18px' }} />
                        ) : (
                            <FavoriteBorderIcon className="text-gray-400 hover:text-red-500" sx={{ fontSize: '18px' }} />
                        )}
                    </button>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
                            {discount}% OFF
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="w-full h-48 flex items-center justify-center mb-4 bg-gray-50 rounded-lg overflow-hidden">
                        <img 
                            draggable="false" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                            src={image} 
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
                        {rating && (
                            <div className="flex items-center gap-1">
                                <div className="flex items-center bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                                    <span>{rating}</span>
                                    <span className="ml-0.5">★</span>
                                </div>
                                <span className="text-xs text-gray-500">({reviews?.toLocaleString() || '0'})</span>
                            </div>
                        )}

                        {/* Price Section */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">{offer}</span>
                                {originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                                )}
                            </div>
                            {tag && (
                                <span className="inline-block text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Product;
