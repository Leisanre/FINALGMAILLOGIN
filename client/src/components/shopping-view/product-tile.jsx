import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto responsive-card">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-1 left-1 xs:top-2 xs:left-2 bg-red-500 hover:bg-red-600 text-xs xs:text-sm">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-1 left-1 xs:top-2 xs:left-2 bg-red-500 hover:bg-red-600 text-xs xs:text-sm">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-1 left-1 xs:top-2 xs:left-2 bg-red-500 hover:bg-red-600 text-xs xs:text-sm">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-2 xs:p-3 sm:p-4">
          <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold mb-1 xs:mb-2 line-clamp-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">
            <span className="text-muted-foreground truncate">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-muted-foreground truncate">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-1 xs:mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-sm xs:text-base sm:text-lg font-semibold text-primary`}
            >
              ₱{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-sm xs:text-base sm:text-lg font-semibold text-primary">
                ₱{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-2 xs:p-3 sm:p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed text-xs xs:text-sm sm:text-base h-8 xs:h-9 sm:h-10">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full text-xs xs:text-sm sm:text-base h-8 xs:h-9 sm:h-10"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
