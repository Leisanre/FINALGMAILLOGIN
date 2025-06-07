import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { brandOptionsMap, categoryOptionsMap, genreOptionsMap, getGenreDisplayName } from "@/config";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [dynamicFilters, setDynamicFilters] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  // Fetch dynamic filter data to get proper names
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [brandRes, categoryRes, genreRes] = await Promise.all([
          fetch("http://localhost:5000/api/brands").then(res => res.json()),
          fetch("http://localhost:5000/api/categories").then(res => res.json()),
          fetch("http://localhost:5000/api/genres").then(res => res.json()),
        ]);

        setDynamicFilters({
          brand: brandRes.data || [],
          category: categoryRes.data || [],
          genre: genreRes.data || [],
        });
      } catch (err) {
        console.error("Error fetching filter options:", err);
        // Fallback to static maps if API fails
        setDynamicFilters({});
      }
    };

    fetchFilterOptions();
  }, []);

  // Helper function to get display name
  const getDisplayName = (type, id) => {
    if (dynamicFilters[type]?.length > 0) {
      // First try to find by exact ID match
      let item = dynamicFilters[type].find(item => item._id === id);
      if (item) return item.name;
      
      // Also try to find by name (in case old data uses name instead of ID)
      item = dynamicFilters[type].find(item => item.name === id);
      if (item) return item.name;
    }
    
    // Fallback to static maps
    switch (type) {
      case 'brand':
        return brandOptionsMap[id] || id;
      case 'category':
        return categoryOptionsMap[id] || id;
      case 'genre':
        return getGenreDisplayName(id, dynamicFilters.genre || []);
      default:
        return id;
    }
  };

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="p-0 max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative overflow-hidden rounded-lg bg-white p-2 flex items-center justify-center min-h-80 md:min-h-96">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="max-w-full max-h-80 md:max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowImageZoom(true)}
            />
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              Click to enlarge
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{productDetails?.title}</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                {productDetails?.description}
              </p>
              
              {/* Category, Type, and Genre badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {productDetails?.category && (
                  <Badge variant="secondary" className="text-xs">
                    <span className="font-medium">Category:</span>&nbsp;
                    {getDisplayName('category', productDetails.category)}
                  </Badge>
                )}
                {productDetails?.brand && (
                  <Badge variant="outline" className="text-xs">
                    <span className="font-medium">Type:</span>&nbsp;
                    {getDisplayName('brand', productDetails.brand)}
                  </Badge>
                )}
                {productDetails?.genre && (
                  <Badge variant="default" className="text-xs">
                    <span className="font-medium">Genre:</span>&nbsp;
                    {getDisplayName('genre', productDetails.genre)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-xl sm:text-2xl font-bold text-primary ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                ₱{productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 ? (
                <p className="text-lg sm:text-xl font-bold text-muted-foreground">
                  ₱{productDetails?.salePrice}
                </p>
              ) : null}
            </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
            <div className="mt-4">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>
            <Separator className="my-4" />
            <div className="max-h-60 overflow-auto">
              <h2 className="text-lg font-bold mb-3">Reviews</h2>
              <div className="grid gap-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div key={reviewItem._id} className="flex gap-3">
                      <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No Reviews</p>
                )}
              </div>
              <div className="mt-6 flex-col flex gap-2">
                <Label className="text-sm">Write a review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Write a review..."
                  className="text-sm"
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                  size="sm"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Zoom Dialog */}
      <Dialog open={showImageZoom} onOpenChange={setShowImageZoom}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <div className="container mx-auto px-2 py-2">
            <div className="relative">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductDetailsDialog;
