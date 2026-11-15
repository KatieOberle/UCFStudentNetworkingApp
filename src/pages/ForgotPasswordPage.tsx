
import { useState, type FormEvent } from "react";

interface ForgotPasswordPageProps {
  onLoginClick: () => void;
}

function ForgotPasswordPage({
  onLoginClick,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@ucf\.edu$/i.test(normalizedEmail)) {
      setIsError(true);
      setMessage("Please enter a valid @ucf.edu email address.");
      return;
    }

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to request password reset."
        );
      }

      setIsError(false);
      setMessage(
        "If an account exists for that email, a password reset link has been sent. Check your inbox."
      );
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
            <p
              role={isError ? "alert" : "status"}
              className={isError ? "form-error" : undefined}
            >
              {message}
            </p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Sending Request..."
              : "Request Password Reset"}
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

