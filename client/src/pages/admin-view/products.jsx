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

  function isFormValid() {
    const isFormDataValid = Object.keys(formData)
      .filter((key) => key !== "averageReview")
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
      return {
        ...field,
        type: "select",
        options: list.map((item) => ({
          label: item.name || item,
          value: item.name || item,
        })),
      };
    }
    return field;
  });

  return (
    <Fragment>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
            label: "Brand",
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
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 max-h-40 overflow-auto">
                  {list.map((item) => (
                    <li key={item._id || item} className="flex justify-between items-center">
                      <span>{item.name || item}</span>
                      <button
                        onClick={() => {
                          dispatch(deleteAction(item._id || item)).then((data) => {
                            if (data?.payload?.success) {
                              toast({ title: `${label} deleted successfully` });
                              dispatch(getAction());
                            } else {
                              toast({
                                title: `Failed to delete ${label}`,
                                variant: "destructive",
                              });
                            }
                          });
                        }}
                        className="ml-2 text-red-600 hover:underline"
                        type="button"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        )}
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
    </Fragment>
  );
}

export default AdminProducts;
