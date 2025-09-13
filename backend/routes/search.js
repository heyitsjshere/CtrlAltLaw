const express = require('express');
const router = express.Router();
const scraperService = require('../services/scraper');
const llmService = require('../services/llm');

router.post('/search', async (req, res) => {
    try {
      const { query, userType = 'layperson', includeCrossVerification = true } = req.body;
      
      console.log(`🔍 Searching for: "${query}" (${userType})`);
      
      // Step 1: Scrape relevant documents
      const documents = await scraperService.searchGovernmentSites(query);
      
      // Step 2: Use enhanced LLM processing with cross-verification
      let results;
      if (includeCrossVerification) {
        results = await llmService.processWithCrossVerification(documents, query, userType);
      } else {
        results = await llmService.extractQuotes(documents, query, userType);
      }
      
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

module.exports = router;