// Replace your form action with this JavaScript
document.querySelector('#Appointment form').addEventListener('submit', async (e) => {
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
       alert(result.message);
       e.target.reset(); // Clear form
     } catch (error) {
       alert('Error booking appointment');
       console.error('Error:', error);
     }
   });