
import { useState, type FormEvent } from "react";

interface Community {
  id: string;
  name: string;
}

interface CreateThreadPageProps {
  onBackClick: () => void;
  communities?: Community[];
  onCreateThread?: (thread: {
    title: string;
    body: string;
    communityId?: string;
  }) => Promise<void>;
}

function CreateThreadPage({
  onBackClick,
  communities = [],
  onCreateThread,
}: CreateThreadPageProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Please enter a title and description.");
      return;
    }

    if (!onCreateThread) {
      setError("Thread publishing is not connected to the server yet.");
      return;
    }

    setSubmitting(true);

    try {
      await onCreateThread({
        title: title.trim(),
        body: body.trim(),
        communityId: communityId || undefined,
      });

      onBackClick();
    } catch {
      setError("Unable to publish your thread. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Create thread navigation">
          <button type="button" onClick={onBackClick}>
            Back to Discussions
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>Create a Thread</h2>
          <p>
            Start a discussion, share an opportunity,
            or ask a question to your UCF network.
          </p>
        </section>

        <section className="discussion-section">
          <form className="create-thread-form" onSubmit={handleSubmit}>
            <label>
              Thread Title
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What would you like to discuss?"
                maxLength={150}
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write your discussion here..."
                rows={7}
                required
              />
            </label>

            <label>
              Community (Optional)
              <select
                value={communityId}
                onChange={(event) => setCommunityId(event.target.value)}
              >
                <option value="">General discussion</option>

                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </label>

            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}

            <div className="create-thread-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onBackClick}
              >
                Cancel
              </button>

              <button type="submit" disabled={submitting}>
                {submitting ? "Publishing..." : "Create Thread"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreateThreadPage;

