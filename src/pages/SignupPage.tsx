import { useState } from "react";
import type { FormEvent } from "react";

interface SignupPageProps {
  onLoginClick: () => void;
}

// Shape of the register response body. The backend currently replies with
// HTTP 200 + { error } on failure, but may later move to 400/409/201.
interface RegisterResponse {
  error?: string;
  message?: string;
}

const MIN_PASSWORD_LENGTH = 8;

function SignupPage({ onLoginClick }: SignupPageProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Returns an error message, or "" when the form is valid.
  const validate = (): string => {
    if (!firstName.trim() || !lastName.trim()) {
      return "First and last name are required.";
    }
    if (!email.trim().toLowerCase().endsWith("@ucf.edu")) {
      return "Please use your UCF email address (@ucf.edu).";
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      //                             api/auth/register is placeholder for the actual backend endpoint for registration, real name may differ based on backend implementation
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      // Always parse the body: the backend can return 200 with { error }.
      const data: RegisterResponse | null = await response
        .json()
        .catch(() => null);

      const serverError =
        typeof data?.error === "string" && data.error ? data.error : "";

      if (!response.ok || serverError) {
        setError(
          serverError ||
            (typeof data?.message === "string" && data.message) ||
            "Registration failed."
        );
        return;
      }

      setRegistered(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Almost there!</h1>
          <h2>Check your UCF email for a verification link</h2>

          <p role="status">
            We sent a verification link to {email.trim().toLowerCase()}. Verify
            your email, then log in.
          </p>

          <p>
            <button
              type="button"
              className="link-button"
              onClick={onLoginClick}
            >
              Go to login
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>
        <h2>Join KnightLink</h2>

        <form onSubmit={handleRegister} noValidate>
          <label>
            First Name
            <input
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </label>

          <label>
            Last Name
            <input
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </label>

          <label>
            UCF Email
            <input
              type="email"
              placeholder="name@ucf.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Create password (min 8 characters)"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
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
