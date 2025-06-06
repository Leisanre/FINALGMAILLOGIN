const Order = require("../../models/Order");
const Product = require("../../models/Product");

const getTopSellingProducts = async (req, res) => {
  try {
    // Get delivered orders to calculate product statistics
    const deliveredOrders = await Order.find({ orderStatus: 'delivered' });
    
    const productStats = {};

    // Calculate product sales from actual orders
    deliveredOrders.forEach(order => {
      order.cartItems?.forEach(item => {
        const productId = item.productId;
        const quantity = item.quantity || 0;
        if (productId) {
          productStats[productId] = (productStats[productId] || 0) + quantity;
        }
      });
    });

    // Get top 5 product IDs by sales
    const topProductIds = Object.entries(productStats)
      .map(([productId, sales]) => ({ productId, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(item => item.productId);

    // Fetch full product details for top selling products
    const topProducts = await Product.find({ 
      _id: { $in: topProductIds } 
    });

    // Sort products by sales ranking and include sales count
    const rankedProducts = topProductIds.map(id => {
      const product = topProducts.find(p => p._id.toString() === id);
      const sales = productStats[id];
      return product ? { ...product.toObject(), salesCount: sales } : null;
    }).filter(Boolean);

    res.status(200).json({ 
      success: true, 
      data: rankedProducts 
    });
  } catch (e) {
    console.error('Error fetching top selling products:', e);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching top selling products" 
    });
  }
};

module.exports = { getTopSellingProducts };