
import { useState } from "react";

import SearchPage from "./pages/SearchPage";
import type { Student } from "./pages/SearchPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import ReportUserPage from "./pages/ReportUserPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import HomePage from "./pages/HomePage";
import CheckEmailPage from "./pages/CheckEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateThreadPage from "./pages/CreateThreadPage";
import ThreadDetailPage from "./pages/ThreadDetailPage";

import type {
  Thread,
  ThreadReply,
} from "./pages/ThreadDetailPage";

function App() {
  const [page, setPage] = useState("login");

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [selectedThread, setSelectedThread] =
    useState<Thread | null>(null);

  const [logoutError, setLogoutError] = useState("");

  // These collections will be filled by the backend integration.
  const [threads] = useState<Thread[]>([]);
  const [replies] = useState<ThreadReply[]>([]);

  function navigate(destination: string) {
    setLogoutError("");
    setPage(destination);
  }

  function openThread(thread: Thread) {
    setSelectedThread(thread);
    navigate("thread-detail");
  }

  function openStudent(student: Student) {
    setSelectedStudent(student);
    navigate("student-profile");
  }

  function openReportPage(student: Student) {
    setSelectedStudent(student);
    navigate("report-user");
  }

  function handleLogout() {
    // Do not navigate away while the real auth session is active.
    // Kenny can replace this with the team's logout implementation.
    setLogoutError(
      "Logout is not connected to authentication yet."
    );
  }

  if (page === "signup") {
    return (
      <SignupPage
        onLoginClick={() => navigate("login")}
      />
    );
  }

  if (page === "check-email") {
    return (
      <CheckEmailPage
        onLoginClick={() => navigate("login")}
      />
    );
  }

  if (page === "forgot-password") {
    return (
      <ForgotPasswordPage
        onLoginClick={() => navigate("login")}
      />
    );
  }

  if (page === "reset-password") {
    return (
      <ResetPasswordPage
        onLoginClick={() => navigate("login")}
      />
    );
  }

  if (page === "home") {
    return (
      <HomePage
        onDiscussionsClick={() => navigate("discussions")}
        onSearchClick={() => navigate("search")}
        onCommunitiesClick={() => navigate("communities")}
        onProfileClick={() => navigate("profile")}
        onCreateThreadClick={() => navigate("create-thread")}
        onLogoutClick={handleLogout}
        logoutError={logoutError}
      />
    );
  }

  if (page === "search") {
    return (
      <SearchPage
        onHomeClick={() => navigate("home")}
        onDiscussionsClick={() => navigate("discussions")}
        onCommunitiesClick={() => navigate("communities")}
        onProfileClick={() => navigate("profile")}
        onStudentClick={openStudent}
      />
    );
  }

  if (page === "student-profile") {
    return (
      <StudentProfilePage
        student={selectedStudent}
        onBackClick={() => navigate("search")}
        onReportClick={openReportPage}
      />
    );
  }

  if (page === "report-user") {
    return (
      <ReportUserPage
        student={selectedStudent}
        onBackClick={() => navigate("student-profile")}
      />
    );
  }

  if (page === "profile") {
    return (
      <ProfilePage
        onHomeClick={() => navigate("home")}
        onDiscussionsClick={() => navigate("discussions")}
        onSearchClick={() => navigate("search")}
        onCommunitiesClick={() => navigate("communities")}
        onConnectionsClick={() => navigate("connections")}
        onEditProfileClick={() => navigate("edit-profile")}
        onLogoutClick={handleLogout}
        logoutError={logoutError}
      />
    );
  }

  if (page === "communities") {
    return (
      <CommunitiesPage
        onHomeClick={() => navigate("home")}
        onDiscussionsClick={() => navigate("discussions")}
        onSearchClick={() => navigate("search")}
        onProfileClick={() => navigate("profile")}
      />
    );
  }

  if (page === "discussions") {
    return (
      <DiscussionsPage
        onHomeClick={() => navigate("home")}
        onSearchClick={() => navigate("search")}
        onCommunitiesClick={() => navigate("communities")}
        onProfileClick={() => navigate("profile")}
        onCreateThreadClick={() => navigate("create-thread")}
        onThreadClick={openThread}
        threads={threads}
      />
    );
  }

  if (page === "thread-detail") {
    return (
      <ThreadDetailPage
        thread={selectedThread}
        replies={replies}
        onBackClick={() => {
          setSelectedThread(null);
          navigate("discussions");
        }}
      />
    );
  }

  if (page === "connections") {
    return (
      <ConnectionsPage
        onBackClick={() => navigate("profile")}
      />
    );
  }

  if (page === "edit-profile") {
    return (
      <EditProfilePage
        onBackClick={() => navigate("profile")}
      />
    );
  }

  if (page === "create-thread") {
    return (
      <CreateThreadPage
        onBackClick={() => navigate("discussions")}
      />
    );
  }

  return (
    <LoginPage
      onSignupClick={() => navigate("signup")}
      onLoginClick={() => navigate("home")}
      onForgotPasswordClick={() => navigate("forgot-password")}
    />
  );
}

export default App;
