export function validateAuth({ mode, username, email, password, repeatPassword }) {
  let errors = [];

  // Email validation
  if (!email) {
    errors.push("Email is required");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push("Invalid email format");
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  // Signup-only validation
  if (mode === "signup") {
    if (!username) {
      errors.push("Name is required");
    }

    if (!repeatPassword) {
      errors.push("Repeat password is required");
    }

    if (password !== repeatPassword) {
      errors.push("Passwords do not match");
    }
  }

  return errors;
}