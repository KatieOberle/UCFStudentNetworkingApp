function LoginPage() {
  return (
    <div>
      <h1>KnightLink</h1>
      <h2>UCF Student Networking</h2>

      <form>
        <label>
          UCF Email
          <input type="email" placeholder="name@ucf.edu" />
        </label>

        <br />

        <label>
          Password
          <input type="password" placeholder="Enter password" />
        </label>

        <br />

        <button type="submit">Log In</button>
      </form>

      <p>Don't have an account? Sign up</p>
    </div>
  );
}

export default LoginPage;
