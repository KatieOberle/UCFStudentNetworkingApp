
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
            <p>Your name will appear here.</p>
          </div>

          <div className="profile-card">
            <h3>Major</h3>
            <p>Your major will appear here.</p>
          </div>

          <div className="profile-card">
            <h3>Career Interests</h3>
            <p>Your career interests will appear here.</p>
          </div>

          <div className="profile-card">
            <h3>Company Affiliations</h3>
            <p>Your company affiliations will appear here.</p>
          </div>

          <div className="profile-card">
            <h3>Contact Information</h3>
            <p>Your contact information will appear here.</p>
          </div>

          <div className="profile-card">
            <h3>My Discussions</h3>
            <p>Your discussion threads will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
