const axios = require('axios');

async function testAutocomplete() {
  try {
    console.log('Testing autocomplete endpoint...');
    
    // Test the autocomplete endpoint
    const response = await axios.get('http://localhost:5000/api/shop/autocomplete/Dune');
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data.length > 0) {
      console.log('✅ Autocomplete working! Found', response.data.data.length, 'suggestions');
    } else {
      console.log('❌ No suggestions found');
    }
    
  } catch (error) {
    console.error('❌ Error testing autocomplete:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Also test if we can find products directly
async function testDirectSearch() {
  try {
    console.log('\nTesting direct search endpoint...');
    
    const response = await axios.get('http://localhost:5000/api/shop/search/Dune');
    
    console.log('Search response status:', response.status);
    console.log('Search response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data.length > 0) {
      console.log('✅ Direct search working! Found', response.data.data.length, 'results');
      response.data.data.forEach(product => {
        console.log('- Product:', product.title, 'by', product.brand);
      });
    } else {
      console.log('❌ No search results found');
    }
    
  } catch (error) {
    console.error('❌ Error testing direct search:', error.message);
  }
}

// Run tests
testAutocomplete();
testDirectSearch();