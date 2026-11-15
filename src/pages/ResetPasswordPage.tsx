
import { useState, type FormEvent } from "react";

interface ResetPasswordPageProps {
  onLoginClick: () => void;
}

function ResetPasswordPage({
  onLoginClick,
}: ResetPasswordPageProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = new URLSearchParams(
    window.location.search
  ).get("token");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
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

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to reset password."
        );
      }

      formElement.reset();
      setSuccess(
        "Password reset successful! You can now log in."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Reset Password</h1>
        <h2>Create a new KnightLink password</h2>

        <p>Enter your new password below.</p>

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
              disabled={isLoading || !!success}
            />
          </label>

          <small>
            Password must be at least 8 characters.
          </small>

          <label>
            Confirm New Password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={isLoading || !!success}
            />
          </label>

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          {success && (
            <p role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !!success || !token}
          >
            {isLoading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>
        </form>

        {!token && (
          <p role="alert" className="form-error">
            This page requires a valid password reset link.
          </p>
        )}

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
