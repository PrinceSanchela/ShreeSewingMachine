// Firebase config (replace with your config)
const firebaseConfig = {
    apiKey: "AIzaSyDawJavJHcwdqzHHYviEHukvaIkTRjrYv4",
    authDomain: "shreesewingmachine-bf4e6.firebaseapp.com",
    projectId: "shreesewingmachine-bf4e6",
    storageBucket: "shreesewingmachine-bf4e6.firebasestorage.app",
    messagingSenderId: "1055706324681",
    appId: "1:1055706324681:web:03eff083e6c124d1f7b718",
    measurementId: "G-2NCP9KK3V1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Switch forms
const showSignInBtn = document.getElementById('showSignIn');
const showSignUpBtn = document.getElementById('showSignUp');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');

showSignInBtn.onclick = () => {
    signinForm.style.display = 'block';
    signupForm.style.display = 'none';
    showSignInBtn.classList.add('active');
    showSignUpBtn.classList.remove('active');
};

showSignUpBtn.onclick = () => {
    signinForm.style.display = 'none';
    signupForm.style.display = 'block';
    showSignUpBtn.classList.add('active');
    showSignInBtn.classList.remove('active');
};

// Password toggle
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Validation
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
}

// Password strength meter
document.getElementById('signupPassword').addEventListener('input', e => {
    const val = e.target.value;
    const bar = document.getElementById('strengthBar');
    const strength = checkPasswordStrength(val);
    switch (strength) {
        case 0: bar.style.width = '0%'; bar.style.background = 'red'; break;
        case 1: bar.style.width = '25%'; bar.style.background = 'red'; break;
        case 2: bar.style.width = '50%'; bar.style.background = 'orange'; break;
        case 3: bar.style.width = '75%'; bar.style.background = 'yellowgreen'; break;
        case 4: bar.style.width = '100%'; bar.style.background = 'green'; break;
    }
});

// Real-time email availability
let emailCheckTimeout;
document.getElementById('signupEmail').addEventListener('input', e => {
    clearTimeout(emailCheckTimeout);
    const email = e.target.value.trim();
    const feedback = document.getElementById('signupEmailFeedback');
    feedback.innerText = '';
    if (!validateEmail(email)) { feedback.innerText = 'Invalid email format'; return; }
    emailCheckTimeout = setTimeout(() => {
        auth.fetchSignInMethodsForEmail(email)
            .then(methods => {
                if (methods.length > 0) {
                    feedback.innerText = 'Email already registered';
                    feedback.style.color = 'red';
                } else {
                    feedback.innerText = 'Email available';
                    feedback.style.color = 'green';
                }
            }).catch(() => { feedback.innerText = ''; });
    }, 500);
});

// Sign Up
function signup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const emailFeedback = document.getElementById('signupEmailFeedback');
    const passwordFeedback = document.getElementById('signupPasswordFeedback');

    emailFeedback.style.color = 'red';
    emailFeedback.innerText = '';
    passwordFeedback.innerText = '';

    if (!validateEmail(email)) { emailFeedback.innerText = 'Invalid email'; return; }
    if (password.length < 6) { passwordFeedback.innerText = 'Password min 6 chars'; return; }

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => { window.location.href = 'home.html'; })
        .catch(error => alert(error.message));
}

// Sign In
function signin() {
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value.trim();
    const emailFeedback = document.getElementById('signinEmailFeedback');
    emailFeedback.innerText = '';

    if (!validateEmail(email)) { emailFeedback.innerText = 'Invalid email'; return; }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => { window.location.href = 'home.html'; })
        .catch(error => alert(error.message));
}

// Google Sign In
document.getElementById('googleSignInBtn').addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then(() => { window.location.href = 'home.html'; })
        .catch(error => alert(error.message));
});

// Google Sign Up
document.getElementById('googleSignUpBtn').addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then(() => { window.location.href = 'home.html'; })
        .catch(error => alert(error.message));
});

// Guest login
document.getElementById('guestBtn').addEventListener('click', () => {
    auth.signInAnonymously()
        .then(() => { window.location.href = 'home.html'; })
        .catch(error => alert(error.message));
});