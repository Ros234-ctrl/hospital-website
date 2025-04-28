// Appointment Form Submission
document.querySelector('#Appointment').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value
  };

  try {
    const response = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Booking failed!');
    }

    alert(result.message || "Booked successfully! 🎉");
    e.target.reset();
  } catch (error) {
    alert(`Booking failed! ❌ ${error.message}`);
    console.error("Error:", error);
  }
});

// Patient Registration Form Submission
document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const patientData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    ward: document.getElementById("ward").value,
    room: document.getElementById("room").value,
    doctor: document.getElementById("doctor").value,
    diagnosis: document.getElementById("diagnosis").value
  };

  try {
    const response = await fetch("http://localhost:5000/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to submit");
    }

    alert(result.message || "✅ Admission successful!");
    e.target.reset();
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
    console.error("Error:", error);
  }
});