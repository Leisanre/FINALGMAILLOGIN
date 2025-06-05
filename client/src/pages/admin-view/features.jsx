import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getFeatureImages,
  addFeatureImage,
  deleteFeatureImage,
} from "@/store/common-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";

function AdminFeatures() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (uploadedImageUrl !== "") {
      dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setImageFile(null);
          setUploadedImageUrl("");
          toast({
            title: "Feature image added successfully",
          });
        }
      });
    } else {
      toast({
        title: "Please upload an image first",
        variant: "destructive",
      });
    }
  }

  function handleDeleteClick(image) {
    setImageToDelete(image);
    setShowDeleteDialog(true);
  }

  function handleConfirmDelete() {
    if (imageToDelete) {
      dispatch(deleteFeatureImage(imageToDelete._id)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Feature image deleted successfully",
          });
        } else {
          toast({
            title: "Failed to delete image",
            variant: "destructive",
          });
        }
      });
    }
    setShowDeleteDialog(false);
    setImageToDelete(null);
  }

  function handleCancelDelete() {
    setShowDeleteDialog(false);
    setImageToDelete(null);
  }

  return (
    <div className="w-full">
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={imageLoadingState || !imageFile || !uploadedImageUrl}
      >
        {imageLoadingState ? "Uploading..." : "Upload"}
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        <h1 className="text-2xl font-bold">Featured Images</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureItem) => (
                <div
                  key={featureItem._id}
                  className="relative group overflow-hidden rounded-lg border"
                >
                  <img
                    src={featureItem.image}
                    alt="Feature"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button
                      onClick={() => handleDeleteClick(featureItem)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            : <p className="text-muted-foreground">No feature images uploaded yet.</p>}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feature Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feature image? This action cannot be undone.
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
    </div>
  );
}

export default AdminFeatures;
