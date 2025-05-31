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
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useDispatch, useSelector } from "react-redux";

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
  const summaryStats = {
    totalSales: 75250,
    totalOrders: 1890,
    activeItems: 540,
    customers: 1320,
  };

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
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addFeatureImage(itemName));
      alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} added!`);
      setItemName("");
    } catch (err) {
      console.error(err);
      alert(`Error adding ${itemType}`);
    }
  };

  const handleUploadFeatureImage = () => {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  };

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 bg-white text-gray-900 transition-colors duration-300">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Sales" value={`$${summaryStats.totalSales.toLocaleString()}`} />
        <SummaryCard title="Total Orders" value={summaryStats.totalOrders} />
        <SummaryCard title="Active Items" value={summaryStats.activeItems} />
        <SummaryCard title="Customers" value={summaryStats.customers} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={monthlyRevenue} options={{ responsive: true }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={genreSales} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={monthlyOrders} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Books</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-muted-foreground/20">
              {topSellingBooks.map((book) => (
                <li key={book.title} className="flex items-center justify-between py-3 text-sm">
                  <span>{book.title}</span>
                  <span className="font-medium">{book.sales} sold</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Low Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-muted-foreground/20">
              {lowInventory.map((item) => (
                <li key={item.title} className="flex items-center justify-between py-3 text-sm text-red-600">
                  <span>{item.title}</span>
                  <span className="font-medium">{item.quantity} left</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-600 text-white">
        <CardHeader>
          <CardTitle>Add Category, Brand, or Genre</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4">
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="p-3 rounded-md text-black w-full sm:w-40 focus:outline-none"
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
              className="flex-1 p-3 rounded-md text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-blue-100 transition-colors"
            >
              Add
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling
        />
        <Button onClick={handleUploadFeatureImage} className="w-full bg-blue-600 hover:bg-blue-700">
          Upload
        </Button>
        {featureImageList?.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureImageList.map((featureImgItem) => (
              <div key={featureImgItem.id || featureImgItem.image} className="relative group">
                <img
                  src={featureImgItem.image}
                  alt="Feature"
                  className="w-full h-72 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button
                    onClick={() => alert("Delete functionality coming soon")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
