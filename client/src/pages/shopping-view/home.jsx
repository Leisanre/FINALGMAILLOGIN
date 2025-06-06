import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages, getTopGenres, getTopProducts } from "@/store/common-slice";

const genreIcons = [
  ShirtIcon,
  CloudLightning,
  BabyIcon,
  WatchIcon,
  UmbrellaIcon,
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList, topGenres, topProducts } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.name || getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);


  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getTopGenres());
    dispatch(getTopProducts());
  }, [dispatch]);

  // Create dynamic genres with icons
  const dynamicGenres = topGenres.map((genre, index) => ({
    id: genre.name.toLowerCase(),
    name: genre.name,
    label: genre.name,
    sales: genre.sales,
    icon: genreIcons[index % genreIcons.length] // Cycle through available icons
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section with Responsive Design matching other content */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-[180px] xs:h-[220px] sm:h-[280px] md:h-[350px] lg:h-[420px] xl:h-[480px] 2xl:h-[540px]">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((slide, index) => (
                <img
                  src={slide?.image}
                  key={index}
                  className={`${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                  alt={`Banner slide ${index + 1}`}
                />
              ))
            : null}
          
          {/* Left Navigation Button with responsive sizing */}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) =>
                  (prevSlide - 1 + featureImageList.length) %
                  featureImageList.length
              )
            }
            className="absolute top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200 left-1 xs:left-2 sm:left-4 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </Button>
          
          {/* Right Navigation Button with responsive sizing */}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) => (prevSlide + 1) % featureImageList.length
              )
            }
            className="absolute top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200 right-1 xs:right-2 sm:right-4 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </Button>
          
          {/* Slide Indicators with responsive sizing */}
          <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 xs:space-x-1.5 sm:space-x-2">
            {featureImageList && featureImageList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-200 w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 ${
                  index === currentSlide
                    ? 'bg-white scale-110 shadow-lg ring-1 ring-white/30'
                    : 'bg-white/50 hover:bg-white/75 hover:scale-105'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Shop by Genre Section */}
      <section className="py-6 xs:py-8 sm:py-10 md:py-12 bg-gray-50">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 xs:mb-6 sm:mb-8">
            Shop by Genre
          </h2>
          {dynamicGenres.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
              {dynamicGenres.map((genreItem) => (
                <Card
                  key={genreItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(genreItem, "genre")
                  }
                  className="cursor-pointer hover:shadow-lg transition-shadow responsive-card"
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6">
                    <genreItem.icon className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 xs:mb-3 sm:mb-4 text-primary" />
                    <span className="font-bold text-xs xs:text-sm sm:text-base text-center">{genreItem.label}</span>
                    <span className="text-xs text-gray-500 mt-1">{genreItem.sales} sold</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No genre statistics available yet. Genres will appear as orders are processed.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-6 xs:py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 xs:mb-6 sm:mb-8">
            Top Selling Books
          </h2>
          {topProducts && topProducts.length > 0 ? (
            <div className="product-tile-grid">
              {topProducts.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No top selling books available yet. Books will appear as orders are processed.</p>
            </div>
          )}
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
