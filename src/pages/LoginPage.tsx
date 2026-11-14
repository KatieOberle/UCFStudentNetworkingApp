import { useState } from "react";
import type { FormEvent } from "react";

interface LoginPageProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
  onForgotPasswordClick: () => void;
}

function LoginPage({
  onSignupClick,
  onLoginClick,
  onForgotPasswordClick,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // The backend returns HTTP 200 with { error } when login fails,
      // so check the body, not just the status code.
      const data = await response.json();
      if (!response.ok || data.error || !data.accessToken) {
        throw new Error(data.error || "Login failed.");
      }

      localStorage.setItem("token", data.accessToken);
      onLoginClick();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>KnightLink</h1>
        <h2>UCF Student Networking</h2>

        <form onSubmit={handleLogin}>
          <label>
            UCF Email
            <input
              type="email"
              name="email"
              placeholder="name@ucf.edu"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {loginError && (
            <p role="alert" className="form-error">
              {loginError}
            </p>
          )}

          <button type="submit">Log In</button>
        </form>

        <button
          type="button"
          className="link-button"
          onClick={onForgotPasswordClick}
        >
          Forgot password?
        </button>

        <p>
          Don't have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={onSignupClick}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
