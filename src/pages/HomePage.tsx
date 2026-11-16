import { useEffect, useState } from "react";
import { getRecentPosts, getLoggedInUserId, type FeedPost } from "../services/api";


interface HomePageProps {
  onDiscussionsClick: () => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
  onCreateThreadClick: () => void;
  onLogoutClick: () => void;
  logoutError?: string;
}

function HomePage({
  onDiscussionsClick,
  onSearchClick,
  onProfileClick,
  onCreateThreadClick,
  onLogoutClick,
  logoutError,
}: HomePageProps) {
  const [recentPosts, setRecentPosts] = useState<FeedPost[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [recentError, setRecentError] = useState("");
  const currentUserId = getLoggedInUserId();

  useEffect(() => {
    let active = true;
    getRecentPosts().then(data => {
      if(active) setRecentPosts(data.posts.slice(0, 5));
    }).catch(error => {
      if(active) setRecentError(error instanceof Error ? error.message : "Could not load discussions");
    }).finally(() => { if(active) setLoadingRecent(false); });
    return () => { active = false; };
  }, []);

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
            and grow your network.
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
          {loadingRecent ? (
            <div className="empty-state"><p>Loading recent discussions...</p></div>
          ) : recentError ? (
            <p role="alert" className="form-error">{recentError}</p>
          ) : recentPosts.length === 0 ? (
            <div className="empty-state"><p>No discussions to display yet.</p></div>
          ) : (
            <div className="thread-replies-list">
              {recentPosts.map(post => (
                <article className="thread-reply-card" key={post.PostID}>
                  <h3>{post.Title}</h3>
                  <p className="thread-meta">Posted by {post.AuthorId === currentUserId ? "You" : post.authorName}</p>
                  <p className="thread-body">{post.Body}</p>
                  <button type="button" onClick={onDiscussionsClick}>View Discussions</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
