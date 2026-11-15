
interface HomePageProps {
  onDiscussionsClick: () => void;
  onSearchClick: () => void;
  onCommunitiesClick: () => void;
  onProfileClick: () => void;
  onCreateThreadClick: () => void;
  onLogoutClick: () => void;
  logoutError?: string;
}

function HomePage({
  onDiscussionsClick,
  onSearchClick,
  onCommunitiesClick,
  onProfileClick,
  onCreateThreadClick,
  onLogoutClick,
  logoutError,
}: HomePageProps) {
  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Main navigation">
          <button
            type="button"
            className="active-nav"
            aria-current="page"
          >
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

          <button type="button" onClick={onProfileClick}>
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

        <section className="welcome-section">
          <h2>Welcome to KnightLink</h2>
          <p>
            Connect with UCF students, join discussions,
            discover communities, and grow your network.
          </p>
        </section>

        <section className="discussion-section">
          <div className="section-header">
            <h2>Discussions</h2>

            <button
              type="button"
              onClick={onCreateThreadClick}
            >
              Create Thread
            </button>
          </div>

          <div className="empty-state">
            <p>No discussions to display yet.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
