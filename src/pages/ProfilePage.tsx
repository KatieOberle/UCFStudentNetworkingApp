interface ProfilePageProps {
  onHomeClick: () => void;
  onDiscussionsClick: () => void;
  onSearchClick: () => void;
  onCommunitiesClick: () => void;
}

function ProfilePage({
  onHomeClick,
  onDiscussionsClick,
  onSearchClick,
  onCommunitiesClick,
}: ProfilePageProps) {
  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav>
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

          <button type="button">
            Profile
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="profile-header">
          <div>
            <h2>My Profile</h2>
            <p>
              Manage your student information, interests, and networking
              profile.
            </p>
          </div>

          <button type="button">Edit Profile</button>
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
