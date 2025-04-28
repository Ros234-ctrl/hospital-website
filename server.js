const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hospitalDB')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors()); // Allow all origins for testing
app.use(express.json());

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  date: { type: String, required: true },
  time: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  ward: String,
  room: String,
  doctor: String,
  diagnosis: String
});

const Patient = mongoose.model('Patient', patientSchema);

// Routes
app.post('/api/appointments', async (req, res) => {
  try {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: "Appointment booked successfully!", 
      data: newAppointment 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: "Patient registered successfully!", 
      data: newPatient 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});