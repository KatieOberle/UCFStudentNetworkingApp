interface HomePageProps {
  onDiscussionsClick: () => void;
  onSearchClick: () => void;
  onCommunitiesClick: () => void;
  onProfileClick: () => void;
}

function HomePage({
  onDiscussionsClick,
  onSearchClick,
  onCommunitiesClick,
  onProfileClick,
}: HomePageProps) {
  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav>
          <button type="button" onClick={onDiscussionsClick}>
            Discussions
          </button>
          <button type="button">Home</button>
          <button type="button" onClick={onSearchClick}>
            Search
          </button>
          <button type="button" onClick={onCommunitiesClick}>
            Communities
          </button>
          <button type="button" onClick={onProfileClick}>
            Profile
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>Welcome to KnightLink</h2>
          <p>
            Connect with UCF students, join discussions, discover communities,
            and grow your network.
          </p>
        </section>

        <section className="discussion-section">
          <div className="section-header">
            <h2>Discussions</h2>
            <button type="button">Create Thread</button>
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
