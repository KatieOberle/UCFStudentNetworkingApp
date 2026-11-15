
import { useEffect, useState, type FormEvent } from "react";
import type { Thread } from "./ThreadDetailPage";
import { getUserPosts } from "../services/api";

interface DiscussionsPageProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
  onCreateThreadClick: () => void;
  onThreadClick: (thread: Thread) => void;
  threads?: Thread[];
}

function getLoggedInUserId(): number | null {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(atob(base64));
    const userId = Number(payload.userId);

    return Number.isSafeInteger(userId) && userId > 0
      ? userId
      : null;
  } catch {
    return null;
  }
}

function DiscussionsPage({
  onHomeClick,
  onSearchClick,
  onProfileClick,
  onCreateThreadClick,
  onThreadClick,
  threads = [],
}: DiscussionsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [myThreads, setMyThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadThreads() {
      const userId = getLoggedInUserId();

      if (!userId) {
        if (!cancelled) {
          setError("Please log in to view your discussions.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getUserPosts(userId);

        if (cancelled) return;

        const loadedThreads = response.posts.map((post) => ({
          id: String(post.PostID),
          title: post.Title,
          body: post.Body,
          authorName: "You",
          createdAt: "",
        })) as Thread[];

        setMyThreads(loadedThreads);
        setError("");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load discussions."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadThreads();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(searchTerm.trim());
  }

  const allThreads = [...myThreads, ...threads].filter(
    (thread, index, array) =>
      array.findIndex((item) => item.id === thread.id) === index
  );

  const visibleThreads = allThreads.filter((thread) => {
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
              View your threads, search discussions,
              or start a new conversation.
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

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-state">
              <p>Loading discussions...</p>
            </div>
          ) : visibleThreads.length === 0 ? (
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

