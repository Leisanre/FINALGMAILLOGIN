import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  // Get data from Redux store
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.adminOrder);
  const { productList } = useSelector((state) => state.adminProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  
  // Calculate dynamic statistics
  const calculateStats = () => {
    // Calculate total sales from delivered orders
    const deliveredOrders = orderList?.filter(order => order.orderStatus === 'delivered') || [];
    const totalSales = deliveredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Count total delivered orders
    const totalOrders = deliveredOrders.length;
    
    // Count active products
    const activeItems = productList?.length || 0;
    
    // Get customer visits (should be tracked on customer-facing pages, not admin)
    const customerVisits = parseInt(localStorage.getItem('customerVisits') || '0');
    
    return {
      totalSales,
      totalOrders,
      activeItems,
      visits: customerVisits,
    };
  };

  const summaryStats = calculateStats();

  const monthlyRevenue = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12500, 9800, 13900, 11200, 14500, 13350],
        fill: false,
        tension: 0.3,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const monthlyOrders = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Orders",
        data: [320, 410, 510, 380, 450, 620],
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const genreSales = {
    labels: ["Fiction", "Non‑fiction", "Sci‑Fi", "Romance", "Children"],
    datasets: [
      {
        label: "Books Sold",
        data: [320, 240, 180, 150, 200],
        backgroundColor: [
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#1e40af",
          "#bfdbfe",
        ],
        borderWidth: 1,
      },
    ],
  };

  const topSellingBooks = [
    { title: "The Silent Patient", sales: 150 },
    { title: "Atomic Habits", sales: 130 },
    { title: "1984", sales: 120 },
    { title: "The Alchemist", sales: 115 },
    { title: "To Kill a Mockingbird", sales: 100 },
  ];

  const lowInventory = [
    { title: "Dune", quantity: 3 },
    { title: "The Hobbit", quantity: 5 },
    { title: "Sapiens", quantity: 2 },
  ];

  const [itemType, setItemType] = useState("category");
  const [itemName, setItemName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const { toast } = useToast();

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addFeatureImage(itemName));
      toast({
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} added successfully!`,
      });
      setItemName("");
    } catch (err) {
      console.error(err);
      toast({
        title: `Error adding ${itemType}`,
        variant: "destructive",
      });
    }
  };

  const handleUploadFeatureImage = () => {
    if (uploadedImageUrl && uploadedImageUrl.trim() !== "") {
      dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setImageFile(null);
          setUploadedImageUrl("");
          toast({
            title: "Feature image uploaded successfully!",
          });
        } else {
          toast({
            title: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
        }
      });
    } else {
      toast({
        title: "Please select and upload an image first!",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (image) => {
    console.log("Image to delete:", image); // Debug log
    setImageToDelete(image);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (imageToDelete) {
      dispatch(deleteFeatureImage(imageToDelete._id)).then((data) => {
        console.log("Delete response:", data); // Debug log
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          toast({
            title: "Feature image deleted successfully!",
          });
        } else {
          console.error("Delete failed:", data); // Debug log
          toast({
            title: `Failed to delete image: ${data?.payload?.message || 'Please try again.'}`,
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error("Delete error:", error); // Debug log
        toast({
          title: "Network error occurred while deleting image.",
          variant: "destructive",
        });
      });
    }
    setShowDeleteDialog(false);
    setImageToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setImageToDelete(null);
  };

  useEffect(() => {
    // Fetch all necessary data on component mount
    dispatch(getFeatureImages());
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllProducts());
    
    // Initialize customer visits counter (read-only for admin)
    // This should be incremented on customer-facing pages only
    const customerVisits = localStorage.getItem('customerVisits');
    if (!customerVisits) {
      localStorage.setItem('customerVisits', '0');
    }
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 min-layout-protection">
      {/* Summary Cards - Same pattern as product page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <SummaryCard title="Total Sales" value={`$${summaryStats.totalSales.toLocaleString()}`} />
        <SummaryCard title="Total Orders" value={summaryStats.totalOrders} />
        <SummaryCard title="Active Items" value={summaryStats.activeItems} />
        <SummaryCard title="Visits" value={summaryStats.visits.toLocaleString()} />
      </div>

      {/* Charts Section - Responsive like product grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="h-48 sm:h-64 lg:h-80">
              <Line
                data={monthlyRevenue}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { font: { size: 11 } }
                    },
                    x: {
                      ticks: { font: { size: 11 } }
                    }
                  },
                  plugins: {
                    legend: {
                      position: "top",
                      labels: { font: { size: 12 }, usePointStyle: true, padding: 15 }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sales by Genre Chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Sales by Genre</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="h-48 sm:h-64 lg:h-80">
              <Doughnut
                data={genreSales}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { font: { size: 11 }, padding: 15, usePointStyle: true }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Orders Chart - Full Width */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Monthly Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          <div className="h-48 sm:h-64 lg:h-80">
            <Bar
              data={monthlyOrders}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { font: { size: 11 } }
                  },
                  x: {
                    ticks: { font: { size: 11 } }
                  }
                },
                plugins: {
                  legend: {
                    position: "top",
                    labels: { font: { size: 12 }, usePointStyle: true, padding: 15 }
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Tables - Same as product listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Top Selling Books</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <ul className="divide-y divide-muted-foreground/20">
              {topSellingBooks.map((book) => (
                <li key={book.title} className="flex items-center justify-between py-2 sm:py-3 text-xs sm:text-sm lg:text-base">
                  <span className="truncate pr-2 flex-1">{book.title}</span>
                  <span className="font-medium whitespace-nowrap">{book.sales} sold</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-red-600 text-base sm:text-lg lg:text-xl">Low Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <ul className="divide-y divide-muted-foreground/20">
              {lowInventory.map((item) => (
                <li key={item.title} className="flex items-center justify-between py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-red-600">
                  <span className="truncate pr-2 flex-1">{item.title}</span>
                  <span className="font-medium whitespace-nowrap">{item.quantity} left</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Add Item Form */}
      <Card className="bg-blue-600 text-white">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Add Category, Brand, or Genre</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="p-2 sm:p-3 rounded-md text-black w-full sm:w-32 md:w-40 focus:outline-none text-sm sm:text-base"
            >
              <option value="category">Category</option>
              <option value="brand">Brand</option>
              <option value="genre">Genre</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${itemType} name`}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="flex-1 p-2 sm:p-3 rounded-md text-black focus:outline-none text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-100 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              Add
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Feature Images</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-4 sm:space-y-6">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling
          />
          <Button
            onClick={handleUploadFeatureImage}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 sm:py-3 text-sm sm:text-base"
            disabled={imageLoadingState || !imageFile || !uploadedImageUrl}
          >
            {imageLoadingState ? "Uploading..." : "Upload Feature Image"}
          </Button>
        </CardContent>
      </Card>

      {/* Feature Images Grid - Same as product grid */}
      {featureImageList?.length > 0 && (
        <Card>
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Current Feature Images</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {featureImageList.map((featureImgItem) => (
                <div key={featureImgItem.id || featureImgItem.image} className="relative group">
                  <img
                    src={featureImgItem.image}
                    alt="Feature"
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-lg">
                    <Button
                      onClick={() => handleDeleteClick(featureImgItem)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

function SummaryCard({ title, value }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}
