import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Searchbar = () => {

    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full px-2 sm:px-4 py-1.5 flex justify-between items-center shadow-md bg-white rounded-sm overflow-hidden">
            <input 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                className="text-xs sm:text-sm flex-1 outline-none border-none placeholder-gray-500 min-w-0" 
                type="text" 
                placeholder="Search for products, brands and more" 
            />
            <button type="submit" className="text-primary-blue flex-shrink-0 ml-1">
                <SearchIcon sx={{ fontSize: { xs: "18px", sm: "24px" } }} />
            </button>
        </form>
    );
};

export default Searchbar;
