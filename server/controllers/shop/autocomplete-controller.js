const Product = require("../../models/Product");

const getAutocompleteResults = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log('🔍 Autocomplete request received for keyword:', keyword);
    
    if (!keyword || typeof keyword !== "string" || keyword.trim().length < 2) {
      console.log('❌ Keyword too short or invalid:', keyword);
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const regEx = new RegExp(keyword, "i");
    console.log('🔍 Using regex pattern:', regEx);
    
    // Get suggestions based on title, brand, and genre with limited results
    const suggestions = await Product.find(
      {
        $or: [
          { title: regEx },
          { brand: regEx },
          { genre: regEx },
          { category: regEx },
        ],
      },
      { title: 1, brand: 1, genre: 1, category: 1, _id: 1 } // Only select needed fields
    ).limit(8); // Limit to 8 suggestions

    console.log('📊 Database query found', suggestions.length, 'products');
    suggestions.forEach(product => {
      console.log('- Found:', product.title, 'by', product.brand);
    });

    // Create unique suggestions array
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

    console.log('✅ Returning', uniqueSuggestions.length, 'unique suggestions');
    res.status(200).json({
      success: true,
      data: uniqueSuggestions,
    });
  } catch (error) {
    console.log('❌ Autocomplete error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching autocomplete suggestions",
    });
  }
};

module.exports = { getAutocompleteResults };