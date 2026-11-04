
import { useState, type FormEvent } from "react";

interface ForgotPasswordPageProps {
  onLoginClick: () => void;
}

function ForgotPasswordPage({
  onLoginClick,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@ucf\.edu$/i.test(email.trim())) {
      setMessage("Please enter a valid @ucf.edu email address.");
      return;
    }

    // Password reset API will be connected here.
    setMessage(
      "Password reset is not connected to the server yet."
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Forgot Password?</h1>
        <h2>Reset your KnightLink password</h2>

        <p>
          Enter your UCF email address to request a
          password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            UCF Email
            <input
              type="email"
              placeholder="name@ucf.edu"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          {message && (
            <p role="status" className="form-error">
              {message}
            </p>
          )}

          <button type="submit">
            Request Password Reset
          </button>
        </form>

        <p>
          Remember your password?{" "}
          <button
            type="button"
            className="link-button"
            onClick={onLoginClick}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

