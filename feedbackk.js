// Replace your feedback form action with this
document.querySelector('.foot form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const feedbackContent = e.target.fdlist.value;

  try {
    const response = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: feedbackContent })
    });

    const result = await response.json();
    alert(result.message);
    e.target.reset(); // Clear form
  } catch (error) {
    alert('Error submitting feedback');
    console.error('Error:', error);
  }
});