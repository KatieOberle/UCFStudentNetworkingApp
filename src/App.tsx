import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const [page, setPage] = useState("login");

  if (page === "signup") {
    return <SignupPage onLoginClick={() => setPage("login")} />;
  }

  return <LoginPage onSignupClick={() => setPage("signup")} />;
}

export default App;
