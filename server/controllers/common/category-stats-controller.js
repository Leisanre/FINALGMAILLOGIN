const Order = require("../../models/Order");
const Product = require("../../models/Product");

const getTopCategoriesByStats = async (req, res) => {
  try {
    console.log('Fetching delivered orders for category stats...');
    
    // Get delivered orders to calculate category statistics
    const deliveredOrders = await Order.find({ orderStatus: 'delivered' });
    console.log(`Found ${deliveredOrders.length} delivered orders`);
    
    if (deliveredOrders.length === 0) {
      console.log('No delivered orders found');
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const categoryStats = {};
    const productCache = new Map(); // Cache products to avoid repeated queries

    // Calculate category sales from actual orders
    for (const order of deliveredOrders) {
      console.log(`Processing order ${order._id} with ${order.cartItems?.length || 0} items`);
      
      for (const item of order.cartItems || []) {
        if (!item.productId) {
          console.log('Cart item missing productId, skipping...');
          continue;
        }

        let category = null;
        
        // Check cache first
        if (productCache.has(item.productId)) {
          category = productCache.get(item.productId);
          console.log(`Found category in cache for product ${item.productId}: ${category}`);
        } else {
          // Fetch from database
          try {
            console.log(`Fetching product ${item.productId} for category`);
            const product = await Product.findById(item.productId).select('category title');
            
            if (product) {
              category = product.category || 'Unknown';
              productCache.set(item.productId, category);
              console.log(`Product "${product.title}" (${item.productId}) has category: ${category}`);
            } else {
              console.log(`Product ${item.productId} not found in database`);
              productCache.set(item.productId, 'Unknown');
              category = 'Unknown';
            }
          } catch (error) {
            console.log(`Error fetching product ${item.productId}:`, error.message);
            productCache.set(item.productId, 'Unknown');
            category = 'Unknown';
          }
        }
        
        const quantity = item.quantity || 0;
        console.log(`Adding ${quantity} items to category: ${category}`);
        categoryStats[category] = (categoryStats[category] || 0) + quantity;
      }
    }

    console.log('Final category stats:', categoryStats);

    // Convert to array and sort by sales
    const sortedCategories = Object.entries(categoryStats)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Get top 5

    console.log('Sorted categories:', sortedCategories);

    res.status(200).json({
      success: true,
      data: sortedCategories
    });
  } catch (e) {
    console.error('Error fetching top categories:', e);
    res.status(500).json({
      success: false,
      message: "Error fetching top categories by statistics"
    });
  }
};

module.exports = { getTopCategoriesByStats };