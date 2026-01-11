/* ============================================
   COLLEGE AUTHENTICATION SYSTEM - JAVASCRIPT
   ============================================ */

// ============================================
// DOM ELEMENTS
// ============================================

const tabButtons = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const togglePasswordIcons = document.querySelectorAll('.toggle-password');
const fileUpload = document.getElementById('idCard');
const fileUploadArea = document.querySelector('.file-upload-area');
const filePreview = document.getElementById('filePreview');
const toast = document.getElementById('toast');
const APIBASE = "http://127.0.0.1:4000/api";

function saveSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("currentUser", JSON.stringify(data.user));
}

function getToken() {
  return localStorage.getItem("token");
}

// ============================================
// TAB SWITCHING
// ============================================

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// Also handle switching from switch-tab buttons inside forms
document.querySelectorAll('.switch-tab').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = button.getAttribute('data-tab');
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Hide all forms
    authForms.forEach(form => form.classList.remove('active'));
    
    // Remove active class from all tab buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected form
    const selectedForm = document.getElementById(tabName);
    if (selectedForm) {
        selectedForm.classList.add('active');
    }
    
    // Add active class to clicked tab button
    const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        
        if (input.type === 'password') {
            input.type = 'text';
            this.textContent = '🙈';
        } else {
            input.type = 'password';
            this.textContent = '👁️';
        }
    });
});

// ============================================
// FILE UPLOAD HANDLING
// ============================================

// Click to upload
fileUploadArea.addEventListener('click', () => {
    fileUpload.click();
});

// File selected via input
fileUpload.addEventListener('change', (e) => {
    handleFileUpload(e.target.files[0]);
});

// Drag and drop
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

function handleFileUpload(file) {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showToast('Please upload a valid image file (JPEG, PNG, GIF, WebP)', 'error');
        return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showToast('File size must be less than 5MB', 'error');
        return;
    }
    
    // Read and display file preview
    const reader = new FileReader();
    reader.onload = (e) => {
        // Display preview
        filePreview.innerHTML = `
            <img src="${e.target.result}" alt="ID Card Preview">
            <p class="file-name">📄 ${file.name}</p>
        `;
        filePreview.classList.add('show');
        fileUploadArea.classList.add('dragover');
        showToast('ID Card uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

// ============================================
// LOGIN FORM VALIDATION & SUBMISSION
// ============================================

loginForm.addEventListener('submit',async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate college email
    if (!isValidCollegeEmail(email)) {
        showToast('Please use your official college email (e.g., name@nith.ac.in)', 'error');
        return;
    }
    
    // Validate password
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // If validation passes, simulate login
await realLogin(email, password);
});

function isValidCollegeEmail(email) {
    // Accept emails ending with @nith.ac.in or similar college domains
    const collegeDomains = ['nith.ac.in', 'student.nith.ac.in', 'college.edu.in'];
    return collegeDomains.some(domain => email.endsWith(domain)) || 
           (email.includes('@') && email.includes('.ac.in')); // Generic college email check
}

async function realLogin(email, password) {
  try {
    showToast("🔐 Logging in...", "success");

    const res = await fetch(`${APIBASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (!res.ok) {
      showToast(result.message || "Login failed", "error");
      return;
    }

    saveSession(result);
    showToast(`✅ Welcome back, ${result.user.firstName}!`, "success");
    loginForm.reset();

    // REDIRECT HERE
setTimeout(() => {
    window.location.href = 'mainpage.html'; 
}, 1000); // 1-second delay so they see the success message

    // optional
    // showDashboard(result.user);
    // window.location.href = 'mainpage.html';
  } catch (err) {
    console.error(err);
    showToast("Network error. Try again.", "error");
  }
}

// ============================================
// SIGNUP FORM VALIDATION & SUBMISSION
// ============================================

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        rollNo: document.getElementById('rollNo').value.trim(),
        branch: document.getElementById('branch').value,
        idCard: document.getElementById('idCard').files[0],
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        terms: document.querySelector('input[name="terms"]').checked
    };
    
    // Validate all fields
    if (!validateSignupForm(formData)) {
        return;
    }
    
   // Real signup (call backend)
  await realSignup(formData);
});

function validateSignupForm(data) {
    // Name validation
    if (data.firstName.length < 2) {
        showToast('First name must be at least 2 characters', 'error');
        return false;
    }
    
    if (data.lastName.length < 2) {
        showToast('Last name must be at least 2 characters', 'error');
        return false;
    }
    
    // Email validation
    if (!isValidCollegeEmail(data.email)) {
        showToast('Please use your official college email (e.g., name@nith.ac.in)', 'error');
        return false;
    }
    
    // Roll number validation
    if (!data.rollNo || data.rollNo.length < 3) {
        showToast('Please enter a valid roll number', 'error');
        return false;
    }
    
    // Branch validation
    if (!data.branch) {
        showToast('Please select your branch', 'error');
        return false;
    }
    
    // ID Card validation
    if (!data.idCard) {
        showToast('Please upload your ID card photo', 'error');
        return false;
    }
    
    // Password validation
    if (data.password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return false;
    }
    
    // Check for uppercase and number in password
    if (!/[A-Z]/.test(data.password) || !/[0-9]/.test(data.password)) {
        showToast('Password must contain at least one uppercase letter and one number', 'error');
        return false;
    }
    
    // Confirm password match
    if (data.password !== data.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return false;
    }
    
    // Terms acceptance
    if (!data.terms) {
        showToast('You must accept the Terms & Conditions', 'error');
        return false;
    }
    
    return true;
}

async function realSignup(data) {
  try {
    showToast("📝 Creating your account...", "success");

    const fd = new FormData();
    fd.append("firstName", data.firstName);
    fd.append("lastName", data.lastName);
    fd.append("email", data.email);
    fd.append("rollNo", data.rollNo);
    fd.append("branch", data.branch);
    fd.append("password", data.password);
    fd.append("confirmPassword", data.confirmPassword);
    fd.append("terms", data.terms ? "on" : "");
    fd.append("idCard", data.idCard);

    const res = await fetch(`${APIBASE}/auth/signup`, {
      method: "POST",
      body: fd
    });

    const result = await res.json();

    if (!res.ok) {
      showToast(result.message || "Signup failed", "error");
      return;
    }

    saveSession(result);
    showToast(`🎉 Welcome, ${result.user.firstName}! Account created!`, "success");

    // REDIRECT HERE
setTimeout(() => {
    window.location.href = 'mainpage.html';
}, 1500); // Slightly longer delay for signup

    signupForm.reset();
    filePreview.classList.remove("show");
    filePreview.innerHTML = "";

    // optional
    // showDashboard(result.user);
    // switchTab('login');
  } catch (err) {
    console.error(err);
    showToast("Network error. Try again.", "error");
  }
}


// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// REAL-TIME FORM VALIDATION
// ============================================

// Email validation while typing
document.getElementById('loginEmail').addEventListener('blur', function() {
    if (this.value && !isValidCollegeEmail(this.value)) {
        this.classList.add('error');
    } else {
        this.classList.remove('error');
    }
});

document.getElementById('signupEmail').addEventListener('blur', function() {
    if (this.value && !isValidCollegeEmail(this.value)) {
        this.classList.add('error');
    } else {
        this.classList.remove('error');
    }
});

// Password strength indicator
document.getElementById('signupPassword').addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // You can add a visual strength indicator here
    console.log('Password strength:', strength);
});

// Confirm password real-time check
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
        this.classList.add('error');
    } else {
        this.classList.remove('error');
    }
});

// ============================================
// FORGOT PASSWORD
// ============================================

document.querySelector('.forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    
    if (!email) {
        showToast('Please enter your email first', 'warning');
        return;
    }
    
    if (!isValidCollegeEmail(email)) {
        showToast('Please use your official college email', 'error');
        return;
    }
    
    showToast(`✉️ Reset link sent to ${email}`, 'success');
});

// ============================================
// SOCIAL LOGIN HANDLERS
// ============================================

document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = e.target.textContent.trim();
        showToast(`🔗 Connecting with ${provider}...`, 'success');
        
        // Simulate OAuth flow
        setTimeout(() => {
            showToast(`✅ Logged in with ${provider}!`, 'success');
        }, 1500);
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Check if email exists (simulate API call)
async function checkEmailExists(email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate API response
            const existingEmails = ['existing@nith.ac.in', 'test@nith.ac.in'];
            resolve(existingEmails.includes(email));
        }, 500);
    });
}

// Format roll number
function formatRollNumber(rollNo) {
    return rollNo.toUpperCase();
}

// Get branch full name
function getBranchFullName(branchCode) {
    const branches = {
        'cse': 'Computer Science Engineering',
        'ece': 'Electronics and Communication Engineering',
        'me': 'Mechanical Engineering',
        'ce': 'Civil Engineering',
        'ee': 'Electrical Engineering',
        'mfg': 'Manufacturing Engineering',
        'bt': 'Biotechnology'
    };
    return branches[branchCode] || branchCode;
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

// Save user data locally (for demo)
function saveUserData(data) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(data);
    localStorage.setItem('users', JSON.stringify(users));
}

// Retrieve user data locally (for demo)
function getUserData(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email === email);
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    console.log('🎓 College Authentication System Initialized');
    
    // Add any initialization code here
    // e.g., check if user is already logged in, load saved data, etc.
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
    showToast('An error occurred. Please try again.', 'error');
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    // Tab between elements is handled by browser automatically
    
    // Alt + L for Login tab
    if (e.altKey && e.key === 'l') {
        switchTab('login');
    }
    
    // Alt + S for Signup tab
    if (e.altKey && e.key === 's') {
        switchTab('signup');
    }
});

// ============================================
// RESPONSIVE HANDLING
// ============================================

// Handle window resize events if needed
window.addEventListener('resize', () => {
    // Any responsive adjustments can be made here
    // CSS media queries handle most of this automatically
});

// ============================================
// EXPORT FUNCTIONS (for testing)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidCollegeEmail,
        validateSignupForm,
        getBranchFullName,
        formatRollNumber,
        showToast,
        switchTab
    };
}

function redirectToDashboard(userData) {
    window.location.href = 'mainpage.html';
}
function showDashboard(user) {
  const authContainer = document.querySelector(".auth-container");
  if (authContainer) authContainer.style.display = "none";

  const dashboard = document.getElementById("dashboard");
  if (dashboard) dashboard.style.display = "block";

  document.getElementById("studentName").textContent = user.firstName || "Student";
  document.getElementById("displayEmail").textContent = user.email || "";
  document.getElementById("displayRollNo").textContent = user.rollNo || "";
  document.getElementById("displayBranch").textContent = user.branch || "";
  document.getElementById("displayIDStatus").textContent = user.idCardUrl ? "Uploaded" : "Not uploaded";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  location.reload();
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// Auto-show dashboard if already logged in
(function autoLogin() {
  const userRaw = localStorage.getItem("currentUser");
  if (!userRaw) return;
  try {
    showDashboard(JSON.parse(userRaw));
  } catch {}
})();
