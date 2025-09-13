const express = require('express');
const router = express.Router();
const scraperService = require('../services/scraper');
const llmService = require('../services/llm');

router.post('/search', async (req, res) => {
  try {
    const { query, userType = 'layperson' } = req.body;
    
    console.log(`🔍 Searching for: "${query}" (${userType})`);
    
    // Step 1: Scrape relevant documents
    const documents = await scraperService.searchGovernmentSites(query);
    
    // Step 2: Use LLM to extract relevant quotes
    const results = await llmService.extractQuotes(documents, query, userType);
    
    res.json({
      success: true,
      query,
      userType,
      results,
      documentCount: documents.length,
      searchTime: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Search API is working!' });
});

module.exports = router;