import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap, genreOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-xs mx-auto responsive-card hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer flex-1 flex flex-col">
        <div className="relative overflow-hidden aspect-[4/3] bg-white">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full object-contain rounded-t-lg transition-transform duration-300 hover:scale-105"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-1 left-1 xs:top-2 xs:left-2 bg-red-500 hover:bg-red-600 text-xs">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-1 left-1 xs:top-2 xs:left-2 bg-red-500 hover:bg-red-600 text-xs">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-1 left-1 xs:top-2 xs:left-2 bg-red-500 hover:bg-red-600 text-xs">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-2 xs:p-3 flex-1 flex flex-col">
          <h2 className="text-sm xs:text-base font-semibold mb-1 truncate leading-tight">{product?.title}</h2>
          <div className="flex flex-wrap gap-1 mb-2 text-xs min-h-[20px]">
            {product?.category && (
              <Badge variant="secondary" className="text-[10px] px-1 py-0">
                {categoryOptionsMap[product?.category] || product?.category}
              </Badge>
            )}
            {product?.brand && (
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                {brandOptionsMap[product?.brand] || product?.brand}
              </Badge>
            )}
            {product?.genre && (
              <Badge variant="default" className="text-[10px] px-1 py-0">
                {genreOptionsMap[product?.genre] || product?.genre}
              </Badge>
            )}
          </div>
          <div className="flex justify-between items-center mt-auto">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
              } text-sm font-semibold`}
            >
              ₱{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-sm font-bold text-primary">
                ₱{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-2 xs:p-3 pt-0 mt-auto">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed text-xs h-8">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full text-xs h-8 hover:bg-primary/90 transition-colors"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
