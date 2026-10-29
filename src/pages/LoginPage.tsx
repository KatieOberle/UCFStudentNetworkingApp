interface LoginPageProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

function LoginPage({ onSignupClick, onLoginClick }: LoginPageProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>KnightLink</h1>
        <h2>UCF Student Networking</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onLoginClick();
          }}
        >
          <label>
            UCF Email
            <input type="email" placeholder="name@ucf.edu" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Enter password" />
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


