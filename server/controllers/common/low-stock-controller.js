const Product = require("../../models/Product");

const getLowStockProducts = async (req, res) => {
  try {
    console.log('Fetching low stock products...');
    
    // Use the exact same logic as admin dashboard generateLowInventory()
    // Filter products with totalStock <= 5 and totalStock > 0
    const lowStockProducts = await Product.find({
      totalStock: { $lte: 5 },
      totalStock: { $gt: 0 } // Exclude out of stock items
    }).sort({ totalStock: 1 }); // Sort by stock ascending (lowest first)
    
    console.log(`Found ${lowStockProducts.length} low stock products`);

    // Return full product objects (like top-products-controller)
    res.status(200).json({
      success: true,
      data: lowStockProducts
    });
  } catch (e) {
    console.error('Error fetching low stock products:', e);
    res.status(500).json({
      success: false,
      message: "Error fetching low stock products"
    });
  }
};

module.exports = { getLowStockProducts };