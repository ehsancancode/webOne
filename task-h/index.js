// index.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const tableBody = document.getElementById("submissionsTableBody");
    const timestampInput = document.getElementById("timestamp");

    // Helper to show custom error text
    function showError(id, msg) {
        document.getElementById(id).textContent = msg;
    }

    // Helper to clear all errors
    function clearErrors() {
        document.querySelectorAll(".error").forEach(e => e.textContent = "");
    }

    // Custom validation logic
    function validateForm() {
        clearErrors();
        let valid = true;

        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const birth = form.birthDate.value;
        const terms = form.terms.checked;

        // Full name: must contain at least 2 words, each ≥ 2 chars
        const nameParts = fullName.split(/\s+/);
        if (nameParts.length < 2 || nameParts.some(w => w.length < 2)) {
            showError("nameError", "Please enter your full name (first and last).");
            valid = false;
        }

        // Email: simple format check
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailPattern.test(email)) {
            showError("emailError", "Please enter a valid email address.");
            valid = false;
        }

        // Phone: Finnish format rule (+358 followed by 7–10 digits)
        const phonePattern = /^\+358\d{7,10}$/;
        if (!phonePattern.test(phone)) {
            showError("phoneError", "Phone must start with +358 and contain 7–10 more digits.");
            valid = false;
        }

        // Birth date: not in the future, min age 13
        if (!birth) {
            showError("dateError", "Please select your birth date.");
            valid = false;
        } else {
            const birthDate = new Date(birth);
            const today = new Date();
            const minAgeDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

            if (birthDate > today) {
                showError("dateError", "Birth date cannot be in the future.");
                valid = false;
            } else if (birthDate > minAgeDate) {
                showError("dateError", "You must be at least 13 years old.");
                valid = false;
            }
        }

        // Terms must be checked
        if (!terms) {
            showError("termsError", "You must accept the terms before submitting.");
            valid = false;
        }

        return valid;
    }

    // Handle form submission
    form.addEventListener("submit", e => {
        e.preventDefault();

        if (!validateForm()) return;

        // Fill timestamp automatically
        const now = new Date();
        const timestamp = now.toLocaleString();
        timestampInput.value = timestamp;

        // Append data as new table row
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${timestamp}</td>
      <td>${form.fullName.value}</td>
      <td>${form.email.value}</td>
      <td>${form.phone.value}</td>
      <td>${form.birthDate.value}</td>
    `;
        tableBody.appendChild(row);

        // Clear form after successful submission
        form.reset();
    });
});
