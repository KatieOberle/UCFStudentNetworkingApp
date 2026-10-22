import { useState } from "react";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import HomePage from "./pages/HomePage";

function App() {
  const [page, setPage] = useState("login");

  if (page === "signup") {
    return <SignupPage onLoginClick={() => setPage("login")} />;
  }

  if (page === "home") {
    return (
      <HomePage
        onDiscussionsClick={() => setPage("discussions")}
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
      onDiscussionsClick={() => setPage("discussions")}
      onCommunitiesClick={() => setPage("communities")}
      onProfileClick={() => setPage("profile")}
    />
  );
}

if (page === "profile") {
  return (
    <ProfilePage
      onHomeClick={() => setPage("home")}
      onDiscussionsClick={() => setPage("discussions")}
      onSearchClick={() => setPage("search")}
      onCommunitiesClick={() => setPage("communities")}
    />
  );
}

if (page === "communities") {
  return (
    <CommunitiesPage
      onHomeClick={() => setPage("home")}
      onDiscussionsClick={() => setPage("discussions")}
      onSearchClick={() => setPage("search")}
      onProfileClick={() => setPage("profile")}
    />
  );
}

if (page === "discussions") {
  return (
    <DiscussionsPage
      onHomeClick={() => setPage("home")}
      onSearchClick={() => setPage("search")}
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
