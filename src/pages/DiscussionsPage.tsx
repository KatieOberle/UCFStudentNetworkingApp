
import { useState, type FormEvent } from "react";
import type { Thread } from "./ThreadDetailPage";

interface DiscussionsPageProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onCommunitiesClick: () => void;
  onProfileClick: () => void;
  onCreateThreadClick: () => void;
  onThreadClick: (thread: Thread) => void;
  threads?: Thread[];
}

function DiscussionsPage({
  onHomeClick,
  onSearchClick,
  onCommunitiesClick,
  onProfileClick,
  onCreateThreadClick,
  onThreadClick,
  threads = [],
}: DiscussionsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(searchTerm.trim());
  }

  const visibleThreads = threads.filter((thread) => {
    const query = submittedSearch.toLowerCase();

    return (
      thread.title.toLowerCase().includes(query) ||
      thread.body.toLowerCase().includes(query) ||
      thread.authorName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Main navigation">
          <button type="button" onClick={onHomeClick}>
            Home
          </button>

          <button
            type="button"
            className="active-nav"
            aria-current="page"
          >
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
        </nav>
      </header>

      <main className="home-content">
        <section className="profile-header">
          <div>
            <h2>Discussions</h2>
            <p>
              Search existing threads, join conversations,
              or start your own.
            </p>
          </div>

          <button type="button" onClick={onCreateThreadClick}>
            Create Thread
          </button>
        </section>

        <section className="discussion-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search discussions..."
              aria-label="Search discussions"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          {visibleThreads.length === 0 ? (
            <div className="empty-state">
              <p>
                {submittedSearch
                  ? "No discussions match your search."
                  : "No discussions to display yet."}
              </p>
            </div>
          ) : (
            <div className="thread-replies-list">
              {visibleThreads.map((thread) => (
                <article
                  key={thread.id}
                  className="thread-reply-card"
                >
                  <h3>{thread.title}</h3>

                  <p className="thread-meta">
                    Posted by {thread.authorName}
                    {thread.createdAt &&
                      ` • ${thread.createdAt}`}
                  </p>

                  <p className="thread-body">
                    {thread.body}
                  </p>

                  <button
                    type="button"
                    onClick={() => onThreadClick(thread)}
                  >
                    View Discussion
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DiscussionsPage;
