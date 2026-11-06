interface DiscussionsPageProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onCommunitiesClick: () => void;
  onProfileClick: () => void;
}

function DiscussionsPage({
  onHomeClick,
  onSearchClick,
  onCommunitiesClick,
  onProfileClick,
}: DiscussionsPageProps) {
  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav>
          <button type="button" onClick={onHomeClick}>
            Home
          </button>

          <button type="button" className="active-nav" aria-current="page">Discussions </button>

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
        <section className="profile-header">
          <div>
            <h2>Discussions</h2>
            <p>
              Search existing threads, join conversations, or start your own.
            </p>
          </div>

          <button type="button">Create Thread</button>
        </section>

        <section className="discussion-section">
<form
  className="search-bar"
  onSubmit={(event) => {
    event.preventDefault();
  }}
>
  <input
    type="search"
    placeholder="Search discussions..."
    aria-label="Search discussions"
  />

  <button type="submit">
    Search
  </button>
</form>  

          <div className="empty-state">
            <p>No discussions to display yet.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DiscussionsPage;

