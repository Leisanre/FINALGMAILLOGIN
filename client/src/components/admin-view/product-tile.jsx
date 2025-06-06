import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { useSelector } from "react-redux";
import { genreOptionsMap } from "@/config";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const { genreList } = useSelector((state) => state.commonFeature);

  // Helper function to get proper genre display name
  const getGenreDisplayName = (genre) => {
    if (!genre) return "No genre set";
    
    // First try to find by exact match in dynamic genre list
    if (genreList && genreList.length > 0) {
      const matchedGenre = genreList.find(g => g.name === genre || g._id === genre);
      if (matchedGenre) return matchedGenre.name;
      
      // Try to find by converted ID (name -> id conversion)
      const convertedId = genre.toLowerCase().replace(/\s+/g, '-');
      const matchedByConvertedId = genreList.find(g => {
        const genreId = g.name.toLowerCase().replace(/\s+/g, '-');
        return genreId === convertedId;
      });
      if (matchedByConvertedId) return matchedByConvertedId.name;
    }
    
    // Fallback to static genreOptionsMap
    if (genreOptionsMap[genre]) {
      return genreOptionsMap[genre];
    }
    
    // Check if it's a genre name that needs to be converted to ID for static map lookup
    const genreEntries = Object.entries(genreOptionsMap);
    const matchedEntry = genreEntries.find(([id, name]) => name === genre);
    if (matchedEntry) {
      return matchedEntry[1]; // Return the display name
    }
    
    // If not found in either, return as-is (fallback)
    return genre;
  };
  return (
    <Card className="w-full max-w-sm mx-auto h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[250px] object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowImageDialog(true)}
            title="Click to enlarge image"
          />
          {/* Stock Status Badge */}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
              Low Stock
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              On Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h2 className="text-lg font-bold mb-2 line-clamp-2">{product?.title}</h2>
          
          {/* Description */}
          {product?.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          
          {/* Category, Brand, Genre */}
          <div className="space-y-1 mb-3">
            {product?.category && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Category:</span>
                <span className="text-xs text-gray-700">{product.category}</span>
              </div>
            )}
            {product?.brand && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Type:</span>
                <span className="text-xs text-gray-700">{product.brand}</span>
              </div>
            )}
            {/* Always show Genre field to debug the issue */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Genre:</span>
              <span className="text-xs text-gray-700">
                {product?.genre ? getGenreDisplayName(product.genre) : <span className="text-red-500 italic">No genre set</span>}
              </span>
            </div>
          </div>

          {/* Stock Information */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-500">Stock:</span>
            <span className={`text-xs font-semibold ${
              product?.totalStock === 0 ? 'text-red-600' :
              product?.totalStock < 10 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {product?.totalStock} units
            </span>
          </div>
          
          {/* Price Information */}
          <div className="flex justify-between items-center mt-auto">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-500" : "text-primary"
              } text-lg font-semibold`}
            >
              ₱{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-primary">₱{product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-2 p-4 pt-0 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => handleDelete(product?._id)}
          >
            Delete
          </Button>
        </CardFooter>
      </div>

      {/* Image Enlargement Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-lg font-semibold">
              {product?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-4 pt-0">
            <img
              src={product?.image}
              alt={product?.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              onClick={() => setShowImageDialog(false)}
            />
          </div>
          <div className="p-4 pt-0 text-center">
            <p className="text-sm text-gray-500 mb-2">Click image or press ESC to close</p>
            <Button
              variant="outline"
              onClick={() => setShowImageDialog(false)}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminProductTile;
