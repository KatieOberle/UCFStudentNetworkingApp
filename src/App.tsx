import { useState } from "react";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";

function App() {
  const [page, setPage] = useState("login");

  if (page === "signup") {
    return <SignupPage onLoginClick={() => setPage("login")} />;
  }

  if (page === "home") {
    return (
      <HomePage
        onSearchClick={() => setPage("search")}
        onCommunitiesClick={() => setPage("communities")}
        onProfileClick={() => setPage("profile")}
      />
    );
  }

if (page === "search") {
  return (
    <SearchPage
      onHomeClick={() => setPage("home")}
      onCommunitiesClick={() => setPage("communities")}
      onProfileClick={() => setPage("profile")}
    />
  );
}

return (
  <LoginPage
    onSignupClick={() => setPage("signup")}
    onLoginClick={() => setPage("home")}
  />
);

}

export default App;
