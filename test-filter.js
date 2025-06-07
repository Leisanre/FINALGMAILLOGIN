// Quick test script to verify the filter endpoints are working
const axios = require('axios');

async function testFilterEndpoints() {
  try {
    console.log('Testing filter endpoints...\n');
    
    // Test brands endpoint
    const brandsRes = await axios.get('http://localhost:5000/api/brands');
    console.log('✓ Brands endpoint working:', brandsRes.data);
    
    // Test categories endpoint
    const categoriesRes = await axios.get('http://localhost:5000/api/categories');
    console.log('✓ Categories endpoint working:', categoriesRes.data);
    
    // Test genres endpoint
    const genresRes = await axios.get('http://localhost:5000/api/genres');
    console.log('✓ Genres endpoint working:', genresRes.data);
    
    // Test filtered products endpoint with all parameters
    const productsRes = await axios.get('http://localhost:5000/api/shop/products/get?category=test&brand=test&genre=test&sortBy=price-lowtohigh');
    console.log('✓ Filtered products endpoint working:', productsRes.data);
    
    console.log('\nAll endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Only run if axios is available
if (typeof require !== 'undefined') {
  testFilterEndpoints();
} else {
  console.log('This script requires Node.js and axios to run');
}