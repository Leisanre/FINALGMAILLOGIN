import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortAsc, SortDesc, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/shopping-view/search-bar";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("relevance");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);

  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    if (searchQuery) {
      setCurrentSearchTerm(searchQuery);
      dispatch(getSearchResults(searchQuery));
    } else {
      dispatch(resetSearchResults());
    }

    return () => {
      // Clean up when component unmounts
      dispatch(resetSearchResults());
    };
  }, [searchQuery, dispatch]);

  const handleProductClick = (productId) => {
    dispatch(fetchProductDetails(productId));
    setOpenDetailsDialog(true);
  };

  const handleAddToCart = (productId, totalStock) => {
    let getCartItems = [];

    if (searchResults && searchResults.length > 0) {
      getCartItems = searchResults;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
        });
      }
    });
  };

  const sortedResults = [...(searchResults || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case "price-high":
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case "name-a-z":
        return a.title.localeCompare(b.title);
      case "name-z-a":
        return b.title.localeCompare(a.title);
      case "rating":
        return (b.averageReview || 0) - (a.averageReview || 0);
      default:
        return 0; // relevance - keep original order
    }
  });

  const handleNewSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <SearchBar variant="page" />
            </div>
          </div>

          {searchQuery && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">
                  Search results for "{searchQuery}"
                </h1>
                {!isLoading && (
                  <Badge variant="secondary" className="text-sm">
                    {searchResults?.length || 0} results
                  </Badge>
                )}
              </div>

              {searchResults && searchResults.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                      <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {!searchQuery ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Search for books
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a book title, author, or genre to find what you're looking for
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-[#126c1b] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg">Searching...</span>
            </div>
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedResults.map((product) => (
              <ProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleProductClick}
                handleAddtoCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h2>
              <p className="text-gray-600 mb-4">
                We couldn't find any books matching "{searchQuery}"
              </p>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">Search suggestions:</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Check your spelling</li>
                  <li>• Try different keywords</li>
                  <li>• Use more general terms</li>
                  <li>• Try searching by author or genre</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchPage;
