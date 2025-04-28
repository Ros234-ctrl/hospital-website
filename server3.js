const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// MongoDB connection with better error handling
mongoose.connect('mongodb://localhost:27017/hospital_admin_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

// Admin model
const Admin = mongoose.model('Admin', {
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Create default admin with error handling
async function initializeAdmin() {
  try {
    const adminExists = await Admin.exists({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10)
      });
      console.log('🔑 Default admin created (username: admin, password: admin123)');
    }
  } catch (err) {
    console.error('Failed to create admin:', err);
  }
}
initializeAdmin();

// Enhanced login endpoint
app.post('/api/login', async (req, res) => {
  console.log('Login attempt:', req.body); // Log incoming requests
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(password, admin.password);
    
    if (!passwordValid) {
      console.log('Login failed: Incorrect password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username: admin.username },
      'hospital_secret_key',
      { expiresIn: '1h' }
    );

    console.log('Login successful for:', username);
    res.json({ 
      success: true,
      token,
      username: admin.username
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ 
    status: 'API working',
    timestamp: new Date().toISOString()
  });
});

// Start server with better logging
const PORT = 4644;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on:
  - http://localhost:${PORT}
  - http://127.0.0.1:${PORT}`);
  
  console.log('\nTry these test URLs in your browser:');
  console.log(`- API Test: http://localhost:${PORT}/api/test`);
  console.log('- MongoDB: Check connection in shell with `mongo hospital_db`');
});