import { useState } from "react";
import type { FormEvent } from "react";

interface LoginPageProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

function LoginPage({ onSignupClick, onLoginClick }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Send login information to backend
    console.log("Login submitted:", email);
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
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit">Log In</button>
        </form>

        <p>
          Don't have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={onSignupClick}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;