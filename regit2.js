// Configuration
const API_BASE_URL = 'http://localhost:4644';
const FALLBACK_URLS = [
  'http://127.0.0.1:4644',
  'http://0.0.0.0:4644'
];

// Utility functions
function showError(message) {
  console.error('Error:', message);
  alert(`Error: ${message}\n\nCheck console for details.`);
}

async function tryFetch(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Request to ${url} failed:`, error);
    throw error;
  }
}

// Login function with multiple URL fallbacks
async function handleLogin() {
  const username = $('#username').val().trim();
  const password = $('#password').val().trim();

  if (!username || !password) {
    showError('Please enter both username and password');
    return;
  }

  const payload = { username, password };
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  };

  // Try primary URL first
  try {
    const data = await tryFetch(`${API_BASE_URL}/api/login`, options);
    
    if (data.success) {
      localStorage.setItem('authToken', data.token);
      $('#loginModal').modal('hide');
      loadDashboard();
      return;
    }
    showError(data.error || 'Login failed');
    
  } catch (primaryError) {
    console.log('Primary URL failed, trying fallbacks...');
    
    // Try fallback URLs
    for (const url of FALLBACK_URLS) {
      try {
        const data = await tryFetch(`${url}/api/login`, options);
        
        if (data.success) {
          localStorage.setItem('authToken', data.token);
          $('#loginModal').modal('hide');
          loadDashboard();
          return;
        }
      } catch (fallbackError) {
        console.log(`Fallback ${url} failed:`, fallbackError);
      }
    }
    
    showError(`Cannot connect to server. Please ensure:
1. Backend is running (node server3.js)
2. MongoDB is running (mongod)
3. No firewall blocking port 4644`);
  }
}

// Initialize
$(document).ready(function() {
  // Check existing session
  const token = localStorage.getItem('authToken');
  if (token) {
    loadDashboard();
  } else {
    const loginModal = new bootstrap.Modal('#loginModal', {
      backdrop: 'static',
      keyboard: false
    });
    loginModal.show();
  }

  // Event handlers
  $('#loginBtn').click(handleLogin);
  $('#logout-btn').click(() => {
    localStorage.removeItem('authToken');
    window.location.reload();
  });

  // Test connection button
  $('#test-connection').click(async () => {
    try {
      const response = await tryFetch(`${API_BASE_URL}/api/test`);
      alert(`Connection successful!\n\nServer response: ${JSON.stringify(response)}`);
    } catch (error) {
      showError('Connection test failed');
    }
  });
});

function loadDashboard() {
  console.log('Loading dashboard...');
  // Your dashboard initialization code here
}