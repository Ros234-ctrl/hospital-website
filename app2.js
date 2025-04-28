let authToken = null;
let patientsTable;

$(document).ready(function() {
    // Show login modal first
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();

    // Initialize DataTable with all patient fields from your DB schema
    patientsTable = $('#patientsTable').DataTable({
        columns: [
            { data: 'patientId', title: 'ID' },
            { data: 'fullName', title: 'Full Name' },
            { data: 'age', title: 'Age' },
            { data: 'gender', title: 'Gender' },
            { data: 'contact', title: 'Contact' },
            { data: 'bloodGroup', title: 'Blood Group' },
            { 
                data: 'status',
                title: 'Status',
                render: function(data, type, row) {
                    let badgeClass = 'bg-secondary';
                    if (data === 'Active') badgeClass = 'bg-success';
                    if (data === 'Emergency') badgeClass = 'bg-danger';
                    return `<span class="badge ${badgeClass}">${data}</span>`;
                }
            },
            {
                data: null,
                title: 'Actions',
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${row.patientId}">
                            <i class="bi bi-pencil-square"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn ms-2" data-id="${row.patientId}">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `;
                },
                orderable: false
            }
        ],
        responsive: true
    });
    $("#loginBtn").click(async function() {
        const username = $("#username").val();
        const password = $("#password").val();
    
        try {
            const response = await fetch('http://localhost:5002/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
    
            const data = await response.json();
            
            if (data.success) {
                // Login successful
                localStorage.setItem('authToken', data.token);
                window.location.href = "/dashboard.html"; // Redirect to dashboard
            } else {
                // Login failed
                alert("Error: " + data.error);
            }
        } catch (error) {
            // Connection failed
            alert("Cannot connect to server. Please:\n1. Make sure backend is running\n2. Check your internet connection");
            console.error("Connection error:", error);
        }
    });
    // Login functionality
    $("#loginBtn").click(async () => {
        try {
          const res = await fetch('http://localhost:5002/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: $("#username").val(),
              password: $("#password").val()
            })
          });
          
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const data = await res.json();
          localStorage.setItem('authToken', data.token);
          window.location.href = "/dashboard.html"; // FORCE reload
          
        } catch (err) {
          alert(`CRITICAL ERROR: ${err.message}\n\nDO THIS NOW:\n1. Open Command Prompt\n2. Run "node server.js"`);
          console.error("FULL ERROR:", err);
        }
      });
    // Load patients data from correct endpoint
    function loadPatients() {
        $.ajax({
            url: 'http://localhost:5002/api/patients',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            success: function(response) {
                if (response.success) {
                    patientsTable.clear().rows.add(response.data).draw();
                    updatePatientStats(response.stats); // Update stats if available
                } else {
                    alert('Failed to load patients: ' + response.error);
                }
            },
            error: function(xhr, status, error) {
                handleAjaxError(xhr, status, error);
            }
        });
    }

    // Error handling function
    function handleAjaxError(xhr, status, error) {
        let errorMessage = "Error connecting to server";
        
        if (xhr.status === 0) {
            errorMessage = "Network error - server may be down";
        } else if (xhr.status === 401) {
            errorMessage = "Session expired - please login again";
            $('#loginModal').modal('show');
        } else if (xhr.responseText) {
            try {
                const errResponse = JSON.parse(xhr.responseText);
                errorMessage = errResponse.message || errorMessage;
            } catch (e) {
                errorMessage = xhr.responseText || errorMessage;
            }
        }
        
        console.error("AJAX Error:", status, error, xhr);
        alert(errorMessage);
    }

    // Update UI for admin users
    function updateUIForAdmin() {
        $('.admin-only').show();
        $('#logoutBtn').show();
        $('#loginBtn').hide();
    }

    // Logout functionality
    $('#logoutBtn').click(function() {
        authToken = null;
        localStorage.removeItem('authToken');
        patientsTable.clear().draw();
        $('.admin-only').hide();
        $('#loginModal').modal('show');
    });

    // Check for existing session on page load
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        authToken = storedToken;
        $('#loginModal').modal('hide');
        loadPatients();
        updateUIForAdmin();
    }

    // Add event listeners for edit/delete buttons
    $('#patientsTable').on('click', '.edit-btn', function() {
        const patientId = $(this).data('id');
        editPatient(patientId);
    });

    $('#patientsTable').on('click', '.delete-btn', function() {
        const patientId = $(this).data('id');
        deletePatient(patientId);
    });

    // Add new patient
    $('#addPatientBtn').click(function() {
        $('#patientForm')[0].reset();
        $('#patientModal').modal('show');
    });

    // Save patient (add/edit)
    $('#savePatientBtn').click(function() {
        const formData = {
            fullName: $('#fullName').val(),
            age: $('#age').val(),
            gender: $('#gender').val(),
            contact: $('#contact').val(),
            bloodGroup: $('#bloodGroup').val(),
            status: $('#status').val()
        };

        const patientId = $('#patientId').val();
        const method = patientId ? 'PUT' : 'POST';
        const url = patientId ? `http://localhost:5002/api/patients/${patientId}` : 'http://localhost:5002/api/patients';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            data: JSON.stringify(formData),
            success: function(response) {
                if (response.success) {
                    $('#patientModal').modal('hide');
                    loadPatients();
                } else {
                    alert('Operation failed: ' + response.error);
                }
            },
            error: handleAjaxError
        });
    });
});

// Edit patient function
function editPatient(patientId) {
    $.ajax({
        url: `http://localhost:5002/api/patients/${patientId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        },
        success: function(response) {
            if (response.success) {
                const patient = response.data;
                $('#patientId').val(patient.patientId);
                $('#fullName').val(patient.fullName);
                $('#age').val(patient.age);
                $('#gender').val(patient.gender);
                $('#contact').val(patient.contact);
                $('#bloodGroup').val(patient.bloodGroup);
                $('#status').val(patient.status);
                $('#patientModal').modal('show');
            } else {
                alert('Failed to load patient: ' + response.error);
            }
        },
        error: handleAjaxError
    });
}

// Delete patient function
function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient?')) {
        $.ajax({
            url: `http://localhost:5002/api/patients/${patientId}`,
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            success: function(response) {
                if (response.success) {
                    loadPatients();
                } else {
                    alert('Delete failed: ' + response.error);
                }
            },
            error: handleAjaxError
        });
    }
}