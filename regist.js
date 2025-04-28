document.getElementById('registrationForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const patientData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    ward: document.getElementById('ward').value,
    room: document.getElementById('room').value,
    doctor: document.getElementById('doctor').value,
    diagnosis: document.getElementById('diagnosis').value
  };

  try {
    console.log("Sending data:", patientData); // Log what's being sent
    
    const response = await fetch('http://localhost:5001/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });

    const result = await response.json();
    console.log("Server response:", result); // Log server response

    if (!response.ok) {
      throw new Error(result.error || "Server returned an error");
    }

    alert('✅ Patient registered successfully!');
    document.getElementById('registrationForm').reset();
    
  } catch (error) {
    console.error("Full error details:", error);
    alert(`❌ Error: ${error.message}`);
  }
});