
import { useState, type FormEvent } from "react";

interface SignupPageProps {
  onLoginClick: () => void;
  registrationError?: string;
}

function SignupPage({ onLoginClick, registrationError, }: SignupPageProps) {
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);

    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!/^[^\s@]+@ucf\.edu$/i.test(email)) {
      setError("You must register using a valid @ucf.edu email.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // API registration will be connected by the functionality developer.
    setError("Registration is not connected to the server yet.");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>
        <h2>Join KnightLink</h2>

        <form onSubmit={handleSubmit}>
          <label>
            First Name
            <input
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
            />
          </label>

          <label>
            Last Name
            <input
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
            />
          </label>

          <label>
            UCF Email
            <input
              name="email"
              type="email"
              placeholder="name@ucf.edu"
              autoComplete="email"
              required
            />
          </label>
          <small>Only @ucf.edu email addresses are allowed.</small>

          <label>
            Password
            <input
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </label>
          <small>Minimum 8 characters.</small>

          <label>
            Confirm Password
            <input
              name="confirmPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </label>

          {(error || registrationError) && (
  <p role="alert" className="form-error">
    {error || registrationError}
  </p>
)}

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={onLoginClick}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

