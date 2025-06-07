import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all"); // New state for filtering
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  // Sort orders by date (latest first) and filter based on selected status
  const sortedOrders = orderList?.slice().sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  
  const filteredOrders = selectedStatus === "all"
    ? sortedOrders?.filter(order => order.orderStatus !== "delivered") // Exclude delivered from "All Orders"
    : sortedOrders?.filter(order => order.orderStatus === selectedStatus);

  // Handle status filter click
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  // Clear filter and show all orders
  const handleShowAll = () => {
    setSelectedStatus("all");
  };

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6">
      {/* Summary Cards - Order Status Counts (Clickable Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <SummaryCard
          title="Pending"
          value={orderList?.filter(order => order.orderStatus === "pending").length || 0}
          color="text-gray-600"
          isActive={selectedStatus === "pending"}
          onClick={() => handleStatusFilter("pending")}
        />
        <SummaryCard
          title="In Process"
          value={orderList?.filter(order => order.orderStatus === "inProcess").length || 0}
          color="text-blue-600"
          isActive={selectedStatus === "inProcess"}
          onClick={() => handleStatusFilter("inProcess")}
        />
        <SummaryCard
          title="In Shipping"
          value={orderList?.filter(order => order.orderStatus === "inShipping").length || 0}
          color="text-orange-600"
          isActive={selectedStatus === "inShipping"}
          onClick={() => handleStatusFilter("inShipping")}
        />
        <SummaryCard
          title="Delivered"
          value={orderList?.filter(order => order.orderStatus === "delivered").length || 0}
          color="text-green-600"
          isActive={selectedStatus === "delivered"}
          onClick={() => handleStatusFilter("delivered")}
        />
      </div>

      {/* Filter Status Display and Clear Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {selectedStatus === "all" ? "Showing all orders" : `Showing ${selectedStatus} orders`}
          </p>
          {selectedStatus !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowAll}
              className="text-xs"
            >
              Show All
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredOrders?.length || 0} orders
        </p>
      </div>

      {/* Orders Table - Responsive Design */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg lg:text-xl">
            {selectedStatus === "all"
              ? "All Orders"
              : selectedStatus === "inProcess"
              ? "In Process Orders"
              : selectedStatus === "inShipping"
              ? "In Shipping Orders"
              : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Orders`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm lg:text-base">Order ID</TableHead>
                  <TableHead className="text-xs sm:text-sm lg:text-base">Order Date</TableHead>
                  <TableHead className="text-xs sm:text-sm lg:text-base">Order Status</TableHead>
                  <TableHead className="text-xs sm:text-sm lg:text-base">Order Price</TableHead>
                  <TableHead className="text-xs sm:text-sm lg:text-base">
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders && filteredOrders.length > 0
                  ? filteredOrders.map((orderItem) => (
                      <TableRow key={orderItem?._id} className="hover:bg-muted/50">
                        <TableCell className="text-xs sm:text-sm lg:text-base font-mono">
                          {orderItem?._id.slice(-8)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm lg:text-base">
                          {orderItem?.orderDate.split("T")[0]}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`py-1 px-2 sm:py-1 sm:px-3 text-xs sm:text-sm text-white w-[85px] sm:w-[95px] text-center whitespace-nowrap flex items-center justify-center ${
                              orderItem?.orderStatus === "delivered"
                                ? "bg-[#66BB6A] hover:bg-[#5CAD60]"
                                : orderItem?.orderStatus === "rejected"
                                ? "bg-[#EF5350] hover:bg-[#E53E3E]"
                                : orderItem?.orderStatus === "inShipping"
                                ? "bg-[#FFA726] hover:bg-[#FB8C00]"
                                : orderItem?.orderStatus === "inProcess"
                                ? "bg-[#42A5F5] hover:bg-[#2196F3]"
                                : "bg-[#B0BEC5] hover:bg-[#90A4AE]"
                            }`}
                          >
                            {orderItem?.orderStatus === "delivered"
                              ? "Delivered"
                              : orderItem?.orderStatus === "rejected"
                              ? "Rejected"
                              : orderItem?.orderStatus === "inShipping"
                              ? "In Shipping"
                              : orderItem?.orderStatus === "inProcess"
                              ? "In Process"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm lg:text-base font-semibold">
                          ₱{orderItem?.totalAmount}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {selectedStatus === "all" ? "No orders found" : `No ${selectedStatus} orders found`}
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((orderItem) => (
                <Card key={orderItem?._id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      {/* Order ID and Date */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted-foreground">Order ID</p>
                          <p className="text-sm font-mono font-medium">
                            {orderItem?._id.slice(-8)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm font-medium">
                            {orderItem?.orderDate.split("T")[0]}
                          </p>
                        </div>
                      </div>

                      {/* Status and Price */}
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`py-1 px-2 text-xs text-white w-[85px] text-center whitespace-nowrap flex items-center justify-center ${
                            orderItem?.orderStatus === "delivered"
                              ? "bg-[#66BB6A] hover:bg-[#5CAD60]"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-[#EF5350] hover:bg-[#E53E3E]"
                              : orderItem?.orderStatus === "inShipping"
                              ? "bg-[#FFA726] hover:bg-[#FB8C00]"
                              : orderItem?.orderStatus === "inProcess"
                              ? "bg-[#42A5F5] hover:bg-[#2196F3]"
                              : "bg-[#B0BEC5] hover:bg-[#90A4AE]"
                          }`}
                        >
                          {orderItem?.orderStatus === "delivered"
                            ? "Delivered"
                            : orderItem?.orderStatus === "rejected"
                            ? "Rejected"
                            : orderItem?.orderStatus === "inShipping"
                            ? "In Shipping"
                            : orderItem?.orderStatus === "inProcess"
                            ? "In Process"
                            : "Pending"}
                        </Badge>
                        <p className="text-lg font-bold text-primary">
                          ₱{orderItem?.totalAmount}
                        </p>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="w-full text-sm py-2"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    {selectedStatus === "all" ? "No orders found" : `No ${selectedStatus} orders found`}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <AdminOrderDetailsView
          orderDetails={orderDetails}
          onClose={() => {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
          }}
        />
      </Dialog>
    </div>
  );
}

function SummaryCard({ title, value, color, isActive, onClick }) {
  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isActive ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <p className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
