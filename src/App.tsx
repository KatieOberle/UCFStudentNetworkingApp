import { useState } from "react";
import {
  searchStudents, sendConnectionRequest, getPostComments, addComment, deleteComment,
  deletePost, submitReport, getLoggedInUserId, logout
} from "./services/api";

import SearchPage from "./pages/SearchPage";
import type { Student } from "./pages/SearchPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import ReportUserPage from "./pages/ReportUserPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import DiscussionsPage from "./pages/DiscussionsPage";
import HomePage from "./pages/HomePage";
import CheckEmailPage from "./pages/CheckEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateThreadPage from "./pages/CreateThreadPage";
import ThreadDetailPage from "./pages/ThreadDetailPage";

import type {
  Thread,
  ThreadReply,
} from "./pages/ThreadDetailPage";

function App() {
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;

    if (path === "/reset-password") return "reset-password";
    if (path === "/verify-email") return "verify-email";

    return "login";
  });

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [selectedThread, setSelectedThread] =
    useState<Thread | null>(null);

  const [logoutError, setLogoutError] = useState("");

  // These collections will be filled by backend integration.
  const [threads] = useState<Thread[]>([]);
  const [replies, setReplies] = useState<ThreadReply[]>([]);
  const [threadError, setThreadError] = useState("");

  function navigate(destination: string) {
    setLogoutError("");

    // Preserve the reset token while the reset page is open.
    // Remove it from the URL when leaving that page.
    if (
      window.location.pathname !== "/" ||
      window.location.search
    ) {
      window.history.replaceState({}, "", "/");
    }

    setPage(destination);
  }

  async function refreshReplies(postId: number) {
    const response = await getPostComments(postId);
    const me = getLoggedInUserId();
    setReplies(response.comments.map((comment) => ({
      id: String(comment.ReplyID),
      body: comment.Body,
      authorName: comment.AuthorId === me ? "You" : `Student #${comment.AuthorId}`,
      createdAt: comment.CreatedAt ? new Date(comment.CreatedAt).toLocaleString() : "",
      isOwnReply: comment.AuthorId === me,
    })));
  }

  async function openThread(thread: Thread) {
    setSelectedThread(thread);
    setReplies([]);
    setThreadError("");
    navigate("thread-detail");
    try { await refreshReplies(Number(thread.id)); }
    catch (error) {
      setThreadError(error instanceof Error ? error.message : "Unable to load replies.");
    }
  }

  async function sendReply(body: string) {
    if (!selectedThread) throw new Error("No thread selected");
    const postId = Number(selectedThread.id);
    await addComment(postId, body);
    await refreshReplies(postId);
  }

  async function removeReply(replyId: string) {
    await deleteComment(Number(replyId));
    if (selectedThread) await refreshReplies(Number(selectedThread.id));
  }

  async function removeThread(threadId: string) {
    await deletePost(Number(threadId));
  }

  async function searchStudentProfiles(query: string): Promise<Student[]> {
    const result = await searchStudents(query);
    const users = Array.isArray(result?.users) ? result.users : [];
    return users
      .filter((user) => user && Number.isSafeInteger(Number(user.userId)) && Number(user.userId) > 0)
      .map((user) => ({
        id: String(user.userId),
        firstName: typeof user.firstName === "string" ? user.firstName : "",
        lastName: typeof user.lastName === "string" ? user.lastName : "",
        major: typeof user.major === "string" ? user.major : "",
        careerInterests: Array.isArray(user.careerInterests) ? user.careerInterests.filter((value): value is string => typeof value === "string") : [],
        companies: Array.isArray(user.companies) ? user.companies.filter((value): value is string => typeof value === "string") : [],
      }));
  }

  async function connectStudent(studentId: string) {
    await sendConnectionRequest(Number(studentId));
  }

  async function reportStudent(report: {reportedUserId: string; reason: string; details: string}) {
    // Backend's reason key is intentionally spelled "innappropriate_content".
    const reason = report.reason === "inappropriate" ? "innappropriate_content" : report.reason;
    await submitReport(Number(report.reportedUserId), reason, report.details.slice(0, 1000));
  }

  function openStudent(student: Student) {
    setSelectedStudent(student);
    navigate("student-profile");
  }

  function openReportPage(student: Student) {
    setSelectedStudent(student);
    navigate("report-user");
  }

  async function handleLogout() {
    try { await logout(); } catch { /* Client token still needs to be cleared. */ }
    localStorage.removeItem("token");
    navigate("login");
  }

  if (page === "verify-email") {
    return <VerifyEmailPage onLoginClick={() => navigate("login")} />;
  }

  if (page === "signup") {
    return (
      <SignupPage
        onLoginClick={() => navigate("login")}
        onRegistered={() => navigate("check-email")}
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
        onSearchClick={() => navigate("search")}        onProfileClick={() => navigate("profile")}
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
        onDiscussionsClick={() => navigate("discussions")}        onProfileClick={() => navigate("profile")}
        onStudentClick={openStudent}
        onSearchStudents={searchStudentProfiles}
      />
    );
  }

  if (page === "student-profile") {
    return (
      <StudentProfilePage
        student={selectedStudent}
        onBackClick={() => navigate("search")}
        onReportClick={openReportPage}
        onConnect={connectStudent}
      />
    );
  }

  if (page === "report-user") {
    return (
      <ReportUserPage
        student={selectedStudent}
        onBackClick={() => navigate("student-profile")}
        onSubmitReport={reportStudent}
      />
    );
  }

  if (page === "profile") {
    return (
      <ProfilePage
        onHomeClick={() => navigate("home")}
        onDiscussionsClick={() => navigate("discussions")}
        onSearchClick={() => navigate("search")}        onConnectionsClick={() => navigate("connections")}
        onEditProfileClick={() => navigate("edit-profile")}
        onLogoutClick={handleLogout}
        logoutError={logoutError}
      />
    );
  }


  if (page === "discussions") {
    return (
      <DiscussionsPage
        onHomeClick={() => navigate("home")}
        onSearchClick={() => navigate("search")}        onProfileClick={() => navigate("profile")}
        onCreateThreadClick={() => navigate("create-thread")}
        onThreadClick={openThread}
        threads={threads}
      />
    );
  }

  if (page === "thread-detail") {
    return (
      <>
      {threadError && <p role="alert" className="form-error">{threadError}</p>}
      <ThreadDetailPage
        thread={selectedThread}
        replies={replies}
        onSubmitReply={sendReply}
        onDeleteReply={removeReply}
        onDeleteThread={removeThread}
        onBackClick={() => {
          setThreadError("");
          setSelectedThread(null);
          navigate("discussions");
        }}
      />
      </>
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
