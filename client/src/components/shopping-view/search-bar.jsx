import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function SearchBar({ variant = "header" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const queryTerm = searchTerm.trim();
    
    if (queryTerm) {
      navigate(`/shop/search?q=${encodeURIComponent(queryTerm)}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search for books, authors, genres..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-4 pr-16 py-2 text-gray-900 bg-white rounded-md focus:ring-2 ${
            variant === "page"
              ? "border-2 border-gray-300 focus:border-[#126c1b] focus:ring-[#126c1b]/20"
              : "border-0 focus:ring-white/50"
          }`}
        />
        
        {/* Clear button */}
        {searchTerm && (
          <Button
            type="button"
            onClick={clearSearch}
            size="sm"
            className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-100/20 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {/* Search button */}
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-100/20 text-gray-600 hover:text-gray-800"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;