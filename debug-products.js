// Debug script to check product data structure
const mongoose = require('mongoose');

// Connect to MongoDB (adjust connection string as needed)
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mern-ecommerce'); // Update with your DB name
    console.log('Connected to MongoDB');
    
    // Get the Product model (adjust path as needed)
    const Product = require('./server/models/Product');
    
    // Fetch a few sample products
    const products = await Product.find({}).limit(5);
    
    console.log('\n=== SAMPLE PRODUCTS ===');
    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log('Title:', product.title);
      console.log('Category:', product.category, '(type:', typeof product.category, ')');
      console.log('Brand:', product.brand, '(type:', typeof product.brand, ')');
      console.log('Genre:', product.genre, '(type:', typeof product.genre, ')');
    });
    
    // Fetch categories, brands, and genres
    const Category = require('./server/models/Category');
    const Brand = require('./server/models/Brand');
    const Genre = require('./server/models/Genre');
    
    const categories = await Category.find({}).limit(5);
    const brands = await Brand.find({}).limit(5);
    const genres = await Genre.find({}).limit(5);
    
    console.log('\n=== SAMPLE CATEGORIES ===');
    categories.forEach(cat => console.log('ID:', cat._id.toString(), 'Name:', cat.name));
    
    console.log('\n=== SAMPLE BRANDS ===');
    brands.forEach(brand => console.log('ID:', brand._id.toString(), 'Name:', brand.name));
    
    console.log('\n=== SAMPLE GENRES ===');
    genres.forEach(genre => console.log('ID:', genre._id.toString(), 'Name:', genre.name));
    
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

connectDB();