import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

const categories = [
    "Electronics",
    "TVs & Appliances",
    "Men",
    "Women",
    "Baby & Kids",
    "Home & Furniture",
    "Sports, Books & More",
    "Flights",
    "Offer Zone",
    "Grocery",
]

const MinCategory = () => {
    return (
        <>
            {/* Desktop MinCategory */}
            <section className="hidden sm:block bg-white w-full px-2 sm:px-12 overflow-hidden border-b mt-14">
                <div className="flex items-center justify-between p-0.5">
                    {categories.map((el, i) => (
                        <Link to="/products" key={i} className="text-sm p-2 text-gray-800 font-medium hover:text-primary-blue flex items-center gap-0.5 group">
                            {el} 
                            <span className="text-gray-400 group-hover:text-primary-blue">
                                <ExpandMoreIcon sx={{ fontSize: "16px" }} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Mobile MinCategory - Horizontal Scroll */}
            <section className="sm:hidden bg-white w-full px-2 overflow-x-auto border-b mt-16">
                <div className="flex items-center gap-4 py-2" style={{ width: 'max-content' }}>
                    {categories.slice(0, 6).map((el, i) => (
                        <Link to="/products" key={i} className="text-xs p-1 text-gray-800 font-medium hover:text-primary-blue flex items-center gap-0.5 group whitespace-nowrap">
                            {el}
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
};

export default MinCategory;
