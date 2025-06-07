// Simple debug endpoint to check product structure
// Add this to your server routes for debugging

const Product = require('../models/Product');

const debugProducts = async (req, res) => {
  try {
    // Get a few sample products
    const products = await Product.find({}).limit(5);
    
    console.log('Sample products found:', products.length);
    
    const productInfo = products.map(product => ({
      id: product._id,
      title: product.title,
      category: product.category,
      categoryType: typeof product.category,
      brand: product.brand,
      brandType: typeof product.brand,
      genre: product.genre,
      genreType: typeof product.genre,
    }));
    
    res.json({
      success: true,
      data: productInfo,
      message: 'Debug info for products'
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: error.message
    });
  }
};

module.exports = { debugProducts };

// To use this, add to your routes:
// router.get('/debug', debugProducts);