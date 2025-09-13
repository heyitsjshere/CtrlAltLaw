const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

// Simplified CORS - allow all origins for development
app.use(cors());

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', require('./routes/search'));

// Test endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Legal Research API is running!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Test at: http://localhost:${PORT}`);
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}/api`);
});