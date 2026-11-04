
interface LoginPageProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
  onForgotPasswordClick: () => void;
  loginError?: string;
}

function LoginPage({
  onSignupClick,
  onForgotPasswordClick,
  loginError,
}: LoginPageProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>KnightLink</h1>
        <h2>UCF Student Networking</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            // TODO: Connect to the login API.
            // Navigate to Home only after authentication succeeds.
          }}
        >
          <label>
            UCF Email
            <input
              type="email"
              name="email"
              placeholder="name@ucf.edu"
              autoComplete="email"
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
