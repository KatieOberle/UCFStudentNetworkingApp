interface SignupPageProps {
  onLoginClick: () => void;
}

function SignupPage({ onLoginClick }: SignupPageProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>
        <h2>Join KnightLink</h2>

        <form>
          <label>
            First Name
            <input type="text" placeholder="Enter first name" />
          </label>

          <label>
            Last Name
            <input type="text" placeholder="Enter last name" />
          </label>

          <label>
            UCF Email
            <input type="email" placeholder="name@ucf.edu" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Create password" />
          </label>

          <label>
            Confirm Password
            <input type="password" placeholder="Confirm password" />
          </label>

          <button type="submit">Sign Up</button>
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


