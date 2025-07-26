document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    // Retrieve input values
    const email = document.querySelector('.input-field[type="email"]').value.trim();
    const password = document.querySelector('.input-field[type="password"]').value;

    // Predefined list of users
    const users = {
        "ramesh@gmail.com": "123",
        "john.doe@example.com": "password123",
        "jane.doe@example.com": "securePass456",
        "example.user@example.com": "test789"
    };

    // Check if email exists and password matches
    if (users[email] && users[email] === password) {
        alert(`Welcome back, ${email}!`);
    } else {
        alert("Invalid email or password. Please try again.");
    }
});