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
    
    // Count total book orders (quantity of books, not just order transactions)
    const totalBookOrders = deliveredOrders.reduce((totalBooks, order) => {
      // Sum up all quantities from cart items in each order
      const orderBookCount = order.cartItems?.reduce((bookSum, item) => {
        return bookSum + (item.quantity || 0);
      }, 0) || 0;
      return totalBooks + orderBookCount;
    }, 0);
    
    // Count active products
    const activeItems = productList?.length || 0;
    
    // Get customer visits (should be tracked on customer-facing pages, not admin)
    const customerVisits = parseInt(localStorage.getItem('customerVisits') || '0');
    
    return {
      totalSales,
      totalBookOrders,
      activeItems,
      visits: customerVisits,
    };
  };

  const summaryStats = calculateStats();

  // Generate dynamic chart data based on actual orders
  const generateChartData = () => {
    const deliveredOrders = orderList?.filter(order => order.orderStatus === 'delivered') || [];
    
    // Get last 6 months
    const months = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        name: monthNames[date.getMonth()],
        year: date.getFullYear(),
        month: date.getMonth()
      });
    }

    // Calculate monthly revenue and orders
    const monthlyRevenue = months.map(month => {
      return deliveredOrders
        .filter(order => {
          const orderDate = new Date(order.orderDate || order.createdAt);
          return orderDate.getMonth() === month.month && orderDate.getFullYear() === month.year;
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    });

    const monthlyOrderCounts = months.map(month => {
      return deliveredOrders
        .filter(order => {
          const orderDate = new Date(order.orderDate || order.createdAt);
          return orderDate.getMonth() === month.month && orderDate.getFullYear() === month.year;
        })
        .reduce((totalBooks, order) => {
          const orderBookCount = order.cartItems?.reduce((bookSum, item) => {
            return bookSum + (item.quantity || 0);
          }, 0) || 0;
          return totalBooks + orderBookCount;
        }, 0);
    });

    return { months: months.map(m => m.name), monthlyRevenue, monthlyOrderCounts };
  };

  // Generate genre sales data from actual orders
  const generateGenreSales = () => {
    const deliveredOrders = orderList?.filter(order => order.orderStatus === 'delivered') || [];
    const genreStats = {};

    deliveredOrders.forEach(order => {
      order.cartItems?.forEach(item => {
        const genre = item.genre || 'Unknown';
        const quantity = item.quantity || 0;
        genreStats[genre] = (genreStats[genre] || 0) + quantity;
      });
    });

    const labels = Object.keys(genreStats);
    const data = Object.values(genreStats);
    const colors = ["#3b82f6", "#60a5fa", "#93c5fd", "#1e40af", "#bfdbfe", "#2563eb", "#1d4ed8"];

    return { labels, data, colors: colors.slice(0, labels.length) };
  };

  // Generate top selling books from actual orders
  const generateTopSellingBooks = () => {
    const deliveredOrders = orderList?.filter(order => order.orderStatus === 'delivered') || [];
    const bookStats = {};

    deliveredOrders.forEach(order => {
      order.cartItems?.forEach(item => {
        const title = item.title || 'Unknown Book';
        const quantity = item.quantity || 0;
        bookStats[title] = (bookStats[title] || 0) + quantity;
      });
    });

    return Object.entries(bookStats)
      .map(([title, sales]) => ({ title, sales }))
      .sort((a, b) => b.sales - a.sales);
  };

  // Generate low inventory items from product list
  const generateLowInventory = () => {
    return (productList || [])
      .filter(product => (product.totalStock || 0) <= 5)
      .map(product => ({
        title: product.title,
        quantity: product.totalStock || 0
      }))
      .sort((a, b) => a.quantity - b.quantity);
  };

  const chartData = generateChartData();
  const genreSalesData = generateGenreSales();
  const allTopSellingBooks = generateTopSellingBooks();
  const allLowInventory = generateLowInventory();
  const topSellingBooks = allTopSellingBooks.slice(0, 5);
  const lowInventory = allLowInventory.slice(0, 5);

  const monthlyRevenue = {
    labels: chartData.months,
    datasets: [
      {
        label: "Revenue ($)",
        data: chartData.monthlyRevenue,
        fill: false,
        tension: 0.3,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const monthlyOrders = {
    labels: chartData.months,
    datasets: [
      {
        label: "Books Sold",
        data: chartData.monthlyOrderCounts,
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const genreSales = {
    labels: genreSalesData.labels,
    datasets: [
      {
        label: "Books Sold",
        data: genreSalesData.data,
        backgroundColor: genreSalesData.colors,
        borderWidth: 1,
      },
    ],
  };

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [viewMoreDialog, setViewMoreDialog] = useState({ open: false, type: '', data: [] });
  const { toast } = useToast();

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
        <SummaryCard title="Total Book Orders" value={summaryStats.totalBookOrders} />
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
            <div className="flex justify-between items-center">
              <CardTitle className="text-base sm:text-lg lg:text-xl">Top Selling Books</CardTitle>
              {allTopSellingBooks.length > 5 && (
                <span className="text-xs text-muted-foreground">
                  Showing top 5 of {allTopSellingBooks.length} books
                </span>
              )}
            </div>
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
            {allTopSellingBooks.length > 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMoreDialog({
                    open: true,
                    type: 'Top Selling Books',
                    data: allTopSellingBooks
                  })}
                  className="text-xs"
                >
                  View More ({allTopSellingBooks.length - 5} more)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-red-600 text-base sm:text-lg lg:text-xl">Low Inventory Alerts</CardTitle>
              {allLowInventory.length > 5 && (
                <span className="text-xs text-muted-foreground">
                  Showing top 5 of {allLowInventory.length} items
                </span>
              )}
            </div>
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
            {allLowInventory.length > 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMoreDialog({
                    open: true,
                    type: 'Low Inventory Alerts',
                    data: allLowInventory
                  })}
                  className="text-xs text-red-600 border-red-600 hover:bg-red-50"
                >
                  View More ({allLowInventory.length - 5} more)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

      {/* View More Dialog */}
      <Dialog open={viewMoreDialog.open} onOpenChange={(open) => setViewMoreDialog({ ...viewMoreDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewMoreDialog.type}</DialogTitle>
            <DialogDescription>
              Showing all {viewMoreDialog.data?.length || 0} items
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-2">
              {viewMoreDialog.data?.map((item, index) => (
                <li key={item.title || index} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                  <span className="text-sm flex-1 truncate pr-2">{item.title}</span>
                  <span className={`text-sm font-medium whitespace-nowrap ${
                    viewMoreDialog.type === 'Low Inventory Alerts' ? 'text-red-600' : ''
                  }`}>
                    {viewMoreDialog.type === 'Top Selling Books' ? `${item.sales} sold` : `${item.quantity} left`}
                  </span>
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
