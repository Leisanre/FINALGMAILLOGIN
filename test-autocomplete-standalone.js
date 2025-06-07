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

async function testAutocomplete() {
  try {
    await mongoose.connect("mongodb+srv://emanuelnicholasnm:emanuelnicholasnm@cluster0.s8pfxat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ Connected to MongoDB");
    
    const keyword = "Dune";
    console.log(`\n🔍 Testing autocomplete for: "${keyword}"`);
    
    // Replicate exact autocomplete logic
    const regEx = new RegExp(keyword, "i");
    console.log("📝 Regex pattern:", regEx);
    
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
    
    console.log(`\n📊 Raw database results: ${suggestions.length} products found`);
    suggestions.forEach((product, index) => {
      console.log(`${index + 1}. "${product.title}" by ${product.brand || 'Unknown'} (${product.genre || 'No genre'}) [${product.category || 'No category'}]`);
    });
    
    // Process into unique suggestions like the controller does
    const uniqueSuggestions = [];
    const seenTitles = new Set();
    
    suggestions.forEach(product => {
      if (!seenTitles.has(product.title.toLowerCase())) {
        uniqueSuggestions.push({
          id: product._id,
          title: product.title,
          brand: product.brand,
          genre: product.genre,
          category: product.category,
        });
        seenTitles.add(product.title.toLowerCase());
      }
    });
    
    console.log(`\n✨ Final unique suggestions: ${uniqueSuggestions.length} items`);
    uniqueSuggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. "${suggestion.title}" by ${suggestion.brand || 'Unknown'}`);
    });
    
    // Also test a broader search
    console.log(`\n🔍 Testing broader search patterns...`);
    
    const titleMatches = await Product.find({ title: /Dune/i });
    console.log(`📚 Title matches: ${titleMatches.length} books`);
    titleMatches.forEach(book => {
      console.log(`- "${book.title}" by ${book.brand || 'Unknown'}`);
    });
    
    if (titleMatches.length === 0) {
      console.log("\n❗ No books found with 'Dune' in title. Let's check what books exist:");
      const sampleBooks = await Product.find({}).limit(10);
      console.log(`📖 Sample books in database (${sampleBooks.length} shown):`);
      sampleBooks.forEach(book => {
        console.log(`- "${book.title}" by ${book.brand || 'Unknown'}`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

testAutocomplete();