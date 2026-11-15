import {useEffect, useState} from "react";
import {getProfile, getLoggedInUserId, getUserPosts} from "../services/api";
import type {StudentProfile} from "../services/api";
interface ProfilePageProps {
  onHomeClick: () => void;
  onDiscussionsClick: () => void;
  onSearchClick: () => void;
  onCommunitiesClick: () => void;
  onConnectionsClick: () => void;
  onEditProfileClick: () => void;
  onLogoutClick: () => void;
  logoutError?: string;
}

function ProfilePage({
  onHomeClick,
  onDiscussionsClick,
  onSearchClick,
  onCommunitiesClick,
  onConnectionsClick,
  onEditProfileClick,
  onLogoutClick,
  logoutError,
}: ProfilePageProps) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [threadCount, setThreadCount] = useState<number | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const id = getLoggedInUserId();
    if (!id) { setError("Please log in to view your profile."); return; }
    let active = true;
    Promise.all([getProfile(id), getUserPosts(id)]).then(([profile, posts]) => {
      if (!active) return;
      setUser(profile.user);
      setThreadCount(posts.posts.length);
    }).catch((err: unknown) => {
      if (active) setError(err instanceof Error ? err.message : "Unable to load profile.");
    });
    return () => { active = false; };
  }, []);
  const contactInfo = user?.contact && typeof user.contact.info === "string" ? user.contact.info : "Not provided";
  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Main navigation">
          <button type="button" onClick={onHomeClick}>
            Home
          </button>

          <button type="button" onClick={onDiscussionsClick}>
            Discussions
          </button>

          <button type="button" onClick={onSearchClick}>
            Search
          </button>

          <button type="button" onClick={onCommunitiesClick}>
            Communities
          </button>

          <button
            type="button"
            className="active-nav"
            aria-current="page"
          >
            Profile
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={onLogoutClick}
          >
            Log Out
          </button>
        </nav>
      </header>

      <main className="home-content">
        {logoutError && (
          <p role="alert" className="form-error">
            {logoutError}
          </p>
        )}

        {error && <p role="alert" className="form-error">{error}</p>}
        <section className="profile-header">
          <div>
            <h2>My Profile</h2>
            <p>
              Manage your student information, interests,
              and networking profile.
            </p>
          </div>

          <div className="profile-actions">
            <button
              type="button"
              onClick={onEditProfileClick}
            >
              Edit Profile
            </button>

            <button
              type="button"
              onClick={onConnectionsClick}
            >
              My Connections
            </button>
          </div>
        </section>

        <section className="profile-grid">
          <div className="profile-card">
            <h3>Name</h3>
            <p>{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</p>
          </div>

          <div className="profile-card">
            <h3>Major</h3>
            <p>{user?.major || "Not provided"}</p>
          </div>

          <div className="profile-card">
            <h3>Career Interests</h3>
            <p>{user?.careerInterests?.join(", ") || "Not provided"}</p>
          </div>

          <div className="profile-card">
            <h3>Company Affiliations</h3>
            <p>{user?.companies?.join(", ") || "Not provided"}</p>
          </div>

          <div className="profile-card">
            <h3>Contact Information</h3>
            <p>{contactInfo}</p>
          </div>

          <div className="profile-card">
            <h3>My Discussions</h3>
            <p>{threadCount === null ? "Loading..." : `${threadCount} thread(s)`}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
