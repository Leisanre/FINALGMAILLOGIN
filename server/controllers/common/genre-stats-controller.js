const Order = require("../../models/Order");

const getTopGenresByStats = async (req, res) => {
  try {
    // Get delivered orders to calculate genre statistics
    const deliveredOrders = await Order.find({ orderStatus: 'delivered' }).populate({
      path: 'cartItems.productId',
      select: 'genre'
    });
    
    const genreStats = {};

    // Calculate genre sales from actual orders
    deliveredOrders.forEach(order => {
      order.cartItems?.forEach(item => {
        const genre = item.genre || 'Unknown';
        const quantity = item.quantity || 0;
        genreStats[genre] = (genreStats[genre] || 0) + quantity;
      });
    });

    // Convert to array and sort by sales
    const sortedGenres = Object.entries(genreStats)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Get top 5

    res.status(200).json({ 
      success: true, 
      data: sortedGenres 
    });
  } catch (e) {
    console.error('Error fetching top genres:', e);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching top genres by statistics" 
    });
  }
};

module.exports = { getTopGenresByStats };