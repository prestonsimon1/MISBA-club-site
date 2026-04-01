// Sticky Navbar Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scroll for RSVP buttons
function scrollToContact(subjectText) {
    const contactSection = document.getElementById('contact');
    const subjectDropdown = document.getElementById('subject');
    
    // Auto-fill the subject for the user
    subjectDropdown.value = "RSVP";
    
    contactSection.scrollIntoView({ behavior: 'smooth' });
}

// Form Validation and Submission Logic
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    const emailInput = document.getElementById('email').value;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!emailInput.match(emailPattern)) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        return;
    }

    // Optional: Add custom success message logic here if not using Formspree's redirect
    console.log("Form is valid. Sending to DuluthMISBA@gmail.com...");
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('nav-active');
    });
});