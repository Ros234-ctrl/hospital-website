document.querySelector('#Appointment')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value
  };
  
  try {
    const response = await fetch('http://localhost:27017/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const result = await response.json();
    alert(result.message || 'Booking successful!');
    e.target.reset();
  } catch (error) {
    console.error('Booking failed:', error);
    alert(`Booking failed: ${error.message}`);
  }
});