
import { useState, type FormEvent } from "react";

interface ResetPasswordPageProps {
  onLoginClick: () => void;
}

function ResetPasswordPage({
  onLoginClick,
}: ResetPasswordPageProps) {
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: Connect to the backend password-reset API.
    setError("Password reset is not connected to the server yet.");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Reset Password</h1>
        <h2>Create a new KnightLink password</h2>

        <p>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            New Password
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <small>Password must be at least 8 characters.</small>

          <label>
            Confirm New Password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          <button type="submit">
            Reset Password
          </button>
        </form>

        <p>
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

export default ResetPasswordPage;
