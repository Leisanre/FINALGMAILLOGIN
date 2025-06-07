const mongoose = require('mongoose');

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    genre: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

async function debugProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://emanuelnicholasnm:emanuelnicholasnm@cluster0.s8pfxat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB connected");
    
    // Find all products with "Dune" in title
    console.log('\n1. Searching for products with "Dune" in title...');
    const duneProducts = await Product.find({ title: /Dune/i });
    console.log(`Found ${duneProducts.length} products with "Dune" in title:`);
    duneProducts.forEach(product => {
      console.log(`- ${product.title} by ${product.brand || 'Unknown'} (${product.genre || 'No genre'})`);
    });
    
    // Test the exact regex pattern used in autocomplete
    console.log('\n2. Testing exact regex pattern from autocomplete...');
    const keyword = "Dune";
    const regEx = new RegExp(keyword, "i");
    
    const suggestions = await Product.find(
      {
        $or: [
          { title: regEx },
          { brand: regEx },
          { genre: regEx },
          { category: regEx },
        ],
      },
      { title: 1, brand: 1, genre: 1, category: 1, _id: 1 }
    ).limit(8);
    
    console.log(`Autocomplete query found ${suggestions.length} products:`);
    suggestions.forEach(product => {
      console.log(`- ${product.title} by ${product.brand || 'Unknown'} (${product.genre || 'No genre'})`);
    });
    
    // Test partial matches
    console.log('\n3. Testing partial matches...');
    const partialSuggestions = await Product.find(
      {
        $or: [
          { title: /.*Dune.*/i },
          { brand: /.*Dune.*/i },
          { genre: /.*Dune.*/i },
          { category: /.*Dune.*/i },
        ],
      }
    );
    
    console.log(`Partial match found ${partialSuggestions.length} products:`);
    partialSuggestions.forEach(product => {
      console.log(`- ${product.title} by ${product.brand || 'Unknown'} (${product.genre || 'No genre'})`);
    });
    
    // List a few sample products to see what's in the database
    console.log('\n4. Sample products in database:');
    const sampleProducts = await Product.find({}).limit(5);
    sampleProducts.forEach(product => {
      console.log(`- ${product.title} by ${product.brand || 'Unknown'} (${product.genre || 'No genre'})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

debugProducts();