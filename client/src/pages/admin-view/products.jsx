import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import {
  addGenre,
  getGenres,
  deleteGenre,
  addCategory,
  getCategories,
  deleteCategory,
  addBrand,
  getBrands,
  deleteBrand,
} from "@/store/common-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  genre: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [newGenre, setNewGenre] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showItemDeleteDialog, setShowItemDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewMoreDialog, setViewMoreDialog] = useState({ open: false, type: '', list: [], deleteAction: null, getAction: null });

  const { productList } = useSelector((state) => state.adminProducts);
  // Make sure the slice name here matches your store setup (commonSlice or commonFeature)
  const { genreList, categoryList, brandList } = useSelector(
    (state) => state.commonFeature
  );
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
        }
      });
    } else {
      dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({ title: "Product added successfully" });
          }
        }
      );
    }
  }

  function handleDeleteClick(getCurrentProductId) {
    setProductToDelete(getCurrentProductId);
    setShowDeleteDialog(true);
  }

  function handleConfirmDelete() {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          toast({
            title: "Product deleted successfully!",
          });
        } else {
          toast({
            title: "Failed to delete product. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
    setShowDeleteDialog(false);
    setProductToDelete(null);
  }

  function handleCancelDelete() {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  }

  function handleItemDeleteClick(item, deleteAction, getAction, label) {
    setItemToDelete({ item, deleteAction, getAction, label });
    setShowItemDeleteDialog(true);
  }

  function handleConfirmItemDelete() {
    if (itemToDelete) {
      const { item, deleteAction, getAction, label } = itemToDelete;
      // Determine the correct ID to pass
      const itemId = typeof item === 'object' && item._id ? item._id : item;
      
      console.log('Deleting item:', { item, itemId, label });
      
      dispatch(deleteAction(itemId)).then((data) => {
        console.log('Delete response:', data);
        if (data?.payload?.success) {
          toast({ title: `${label} deleted successfully` });
          dispatch(getAction());
        } else {
          console.error('Delete failed:', data?.payload || data);
          toast({
            title: `Failed to delete ${label}`,
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error('Delete error:', error);
        toast({
          title: `Failed to delete ${label}`,
          variant: "destructive",
        });
      });
    }
    setShowItemDeleteDialog(false);
    setItemToDelete(null);
  }

  function handleCancelItemDelete() {
    setShowItemDeleteDialog(false);
    setItemToDelete(null);
  }

  function isFormValid() {
    const isFormDataValid = Object.keys(formData)
      .filter((key) => key !== "averageReview" && key !== "salePrice")
      .every((key) => formData[key] !== "");
    
    // For new products, require an uploaded image. For edits, image is optional
    const isImageValid = currentEditedId !== null || (imageFile && uploadedImageUrl);
    
    return isFormDataValid && isImageValid;
  }

  function handleAddItem(e, value, setter, action, getAction, name) {
    e.preventDefault();
    if (!value.trim()) return;

    dispatch(action(value)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `${name} added successfully` });
        setter("");
        dispatch(getAction());
      } else {
        toast({ title: `Failed to add ${name}`, variant: "destructive" });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getGenres());
    dispatch(getCategories());
    dispatch(getBrands());
  }, [dispatch]);

  const modifiedFormControls = addProductFormElements.map((field) => {
    if (["genre", "category", "brand"].includes(field.name)) {
      const list =
        field.name === "genre"
          ? genreList
          : field.name === "category"
          ? categoryList
          : brandList;
      
      // For genre, we need to store the ID that matches genreOptionsMap
      // For other fields, store the name
      if (field.name === "genre") {
        return {
          ...field,
          type: "select",
          options: list.map((item) => {
            const genreName = item.name || item;
            // Convert genre name to ID that matches genreOptionsMap
            const genreId = genreName.toLowerCase().replace(/\s+/g, '-');
            return {
              id: genreId,
              label: genreName,
            };
          }),
        };
      } else {
        return {
          ...field,
          type: "select",
          options: list.map((item) => ({
            id: item.name || item,
            label: item.name || item,
          })),
        };
      }
    }
    return field;
  });

  return (
    <Fragment>
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-20 p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button onClick={() => setOpenCreateProductsDialog(true)}>
            Add New Product
          </Button>
        </div>
      </div>

      {/* Management Sections */}
      <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: "Genre",
            value: newGenre,
            setter: setNewGenre,
            action: addGenre,
            getAction: getGenres,
            list: genreList,
            deleteAction: deleteGenre,
          },
          {
            label: "Category",
            value: newCategory,
            setter: setNewCategory,
            action: addCategory,
            getAction: getCategories,
            list: categoryList,
            deleteAction: deleteCategory,
          },
          {
            label: "Type",
            value: newBrand,
            setter: setNewBrand,
            action: addBrand,
            getAction: getBrands,
            list: brandList,
            deleteAction: deleteBrand,
          },
        ].map(
          ({
            label,
            value,
            setter,
            action,
            getAction,
            list,
            deleteAction,
          }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Manage {label}s
              </h2>
              <form
                onSubmit={(e) =>
                  handleAddItem(e, value, setter, action, getAction, label)
                }
                className="flex gap-2 mb-4"
              >
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Enter new ${label.toLowerCase()}`}
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                  required
                />
                <Button type="submit">Add</Button>
              </form>
              {list?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">
                      {list.length > 3 ? `Showing 3 of ${list.length} items` : `${list.length} item${list.length !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    {list.slice(0, 3).map((item) => (
                      <li key={item._id || item} className="flex justify-between items-center">
                        <span>{item.name || item}</span>
                        <button
                          onClick={() => handleItemDeleteClick(item, deleteAction, getAction, label)}
                          className="ml-2 text-red-600 hover:underline"
                          type="button"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                  {list.length > 3 && (
                    <div className="mt-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMoreDialog({
                          open: true,
                          type: label,
                          list: list,
                          deleteAction: deleteAction,
                          getAction: getAction
                        })}
                        className="text-xs"
                      >
                        View More ({list.length - 3} more)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
        {productList &&
          productList.length > 0 &&
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem.id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDeleteClick}
            />
          ))}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={modifiedFormControls}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Delete Confirmation Dialog */}
      <Dialog open={showItemDeleteDialog} onOpenChange={setShowItemDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {itemToDelete?.label}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {itemToDelete?.label?.toLowerCase()}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelItemDelete}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmItemDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View More Dialog */}
      <Dialog open={viewMoreDialog.open} onOpenChange={(open) => setViewMoreDialog({ ...viewMoreDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>All {viewMoreDialog.type}s</DialogTitle>
            <DialogDescription>
              Showing all {viewMoreDialog.list?.length || 0} {viewMoreDialog.type?.toLowerCase()}s
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-2">
              {viewMoreDialog.list?.map((item) => (
                <li key={item._id || item} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                  <span className="text-sm">{item.name || item}</span>
                  <button
                    onClick={() => {
                      handleItemDeleteClick(item, viewMoreDialog.deleteAction, viewMoreDialog.getAction, viewMoreDialog.type);
                      setViewMoreDialog({ ...viewMoreDialog, open: false });
                    }}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewMoreDialog({ ...viewMoreDialog, open: false })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default AdminProducts;
