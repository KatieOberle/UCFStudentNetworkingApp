
import { useState, type FormEvent } from "react";

export interface Thread {
  id: string;
  title: string;
  body: string;
  authorName: string;
  createdAt?: string;
  isOwnThread?: boolean;
}

export interface ThreadReply {
  id: string;
  body: string;
  authorName: string;
  createdAt?: string;
  isOwnReply?: boolean;
}

interface ThreadDetailPageProps {
  thread?: Thread | null;
  replies?: ThreadReply[];
  onBackClick: () => void;
  onSubmitReply?: (body: string) => Promise<void>;
  onDeleteThread?: (threadId: string) => Promise<void>;
  onDeleteReply?: (replyId: string) => Promise<void>;
}

function ThreadDetailPage({
  thread,
  replies = [],
  onBackClick,
  onSubmitReply,
  onDeleteThread,
  onDeleteReply,
}: ThreadDetailPageProps) {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!replyText.trim()) {
      setError("Please write a reply before submitting.");
      return;
    }

    if (!onSubmitReply) {
      setError("Reply posting is not connected to the server yet.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmitReply(replyText.trim());
      setReplyText("");
    } catch {
      setError("Unable to post your reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteThread() {
    if (!thread || !thread.isOwnThread || !onDeleteThread) {
      setError("Thread deletion is not available.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this thread?")) {
      return;
    }

    setDeletingId(thread.id);
    setError("");

    try {
      await onDeleteThread(thread.id);
      onBackClick();
    } catch {
      setError("Unable to delete this thread.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteReply(replyId: string) {
    const reply = replies.find((item) => item.id === replyId);

    if (!reply?.isOwnReply || !onDeleteReply) {
      setError("Reply deletion is not available.");
      return;
    }

    if (!window.confirm("Delete this reply?")) {
      return;
    }

    setDeletingId(replyId);
    setError("");

    try {
      await onDeleteReply(replyId);
    } catch {
      setError("Unable to delete this reply.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Thread navigation">
          <button type="button" onClick={onBackClick}>
            Back to Discussions
          </button>
        </nav>
      </header>

      <main className="home-content">
        {!thread ? (
          <section className="discussion-section">
            <h2>Thread Details</h2>
            <div className="empty-state">
              <p>
                Select a discussion to view its details and replies.
              </p>
            </div>
          </section>
        ) : (
          <>
            <article className="thread-detail-card">
              <div className="thread-detail-header">
                <div>
                  <h2>{thread.title}</h2>
                  <p className="thread-meta">
                    Posted by {thread.authorName}
                    {thread.createdAt && ` • ${thread.createdAt}`}
                  </p>
                </div>

                {thread.isOwnThread && (
                  <button
                    type="button"
                    className="thread-delete-button"
                    onClick={handleDeleteThread}
                    disabled={deletingId === thread.id}
                  >
                    {deletingId === thread.id
                      ? "Deleting..."
                      : "Delete Thread"}
                  </button>
                )}
              </div>

              <p className="thread-body">{thread.body}</p>
            </article>

            <section className="thread-replies-section">
              <h2>Replies ({replies.length})</h2>

              {replies.length === 0 ? (
                <div className="empty-state">
                  <p>No replies yet. Be the first to respond!</p>
                </div>
              ) : (
                <div className="thread-replies-list">
                  {replies.map((reply) => (
                    <article key={reply.id} className="thread-reply-card">
                      <div className="thread-reply-header">
                        <div>
                          <strong>{reply.authorName}</strong>
                          {reply.createdAt && (
                            <p className="thread-meta">
                              {reply.createdAt}
                            </p>
                          )}
                        </div>

                        {reply.isOwnReply && (
                          <button
                            type="button"
                            className="thread-delete-button"
                            onClick={() =>
                              handleDeleteReply(reply.id)
                            }
                            disabled={deletingId === reply.id}
                          >
                            {deletingId === reply.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </div>

                      <p>{reply.body}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="thread-reply-form-section">
              <h2>Write a Reply</h2>

              <form onSubmit={handleSubmitReply}>
                <label htmlFor="thread-reply">
                  Your Reply
                </label>

                <textarea
                  id="thread-reply"
                  value={replyText}
                  onChange={(event) =>
                    setReplyText(event.target.value)
                  }
                  placeholder="Share your thoughts..."
                  rows={5}
                  required
                />

                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={submitting}>
                  {submitting ? "Posting..." : "Post Reply"}
                </button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ThreadDetailPage;

