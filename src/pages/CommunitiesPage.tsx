interface CommunitiesPageProps {
  onHomeClick: () => void;
  onDiscussionsClick: () => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
}

function CommunitiesPage({
  onHomeClick,
  onDiscussionsClick,
  onSearchClick,
  onProfileClick,
}: CommunitiesPageProps) {
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

          <button type="button" className="active-nav" aria-current="page">
            Communities
          </button>

          <button type="button" onClick={onProfileClick}>
            Profile
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="profile-header">
          <div>
            <h2>Communities</h2>
            <p>
              Discover student communities or create one around shared interests.
            </p>
          </div>

          <button type="button">Create Community</button>
        </section>

        <section className="discussion-section">
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search communities..."
            />

            <button type="button">Search</button>
          </div>

          <div className="empty-state">
            <p>Search for communities to see results.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CommunitiesPage;
