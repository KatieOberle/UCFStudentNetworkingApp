interface SearchPageProps {
  onHomeClick: () => void;
  onDiscussionsClick: () => void;
  onCommunitiesClick: () => void;
  onProfileClick: () => void;
}

function SearchPage({
  onHomeClick,
  onDiscussionsClick,
  onCommunitiesClick,
  onProfileClick,
}: SearchPageProps) {
  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav>
          <button type="button" onClick={onHomeClick}>
            Home
          </button>

          <button type="button">
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
          <h2>Search Students</h2>
          <p>
            Find students by name, major, career interests, or company
            affiliations.
          </p>
        </section>

        <section className="discussion-section">
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search students..."
            />

            <button type="button">
              Search
            </button>
          </div>

          <div className="empty-state">
            <p>Search for students to see results.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SearchPage;
