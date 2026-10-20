function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>KnightLink</h1>
        <h2>UCF Student Networking</h2>

        <form>
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

        <p>Don't have an account? Sign up</p>
      </div>
    </div>
  );
}

export default LoginPage;
