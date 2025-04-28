const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Initialize Express app
const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hospitalDB')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 4. Patient Schema
const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  ward: String,
  room: String,
  doctor: String,
  diagnosis: String
});

const Patient = mongoose.model('Patient', patientSchema);

// 5. POST Endpoint
app.post('/api/patients', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json({ message: 'Patient saved!', data: newPatient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Start Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});