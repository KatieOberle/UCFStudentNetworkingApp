import { useState } from "react";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import HomePage from "./pages/HomePage";
import CheckEmailPage from "./pages/CheckEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";



function App() {
  const [page, setPage] = useState("login");

  if (page === "signup") {
    return (
      <SignupPage
        onLoginClick={() => setPage("login")}
        onRegistered={() => setPage("check-email")}
      />
    );
  }
 if (page === "check-email") {
  return (
    <CheckEmailPage
      onLoginClick={() => setPage("login")}
    />
  );
}

if (page === "forgot-password") {
  return (
    <ForgotPasswordPage
      onLoginClick={() => setPage("login")}
    />
  );
}

if (page === "reset-password") {
  return (
    <ResetPasswordPage
      onLoginClick={() => setPage("login")}
    />
  );
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
    onForgotPasswordClick={() => setPage("forgot-password")}
  />
);

}

export default App;
