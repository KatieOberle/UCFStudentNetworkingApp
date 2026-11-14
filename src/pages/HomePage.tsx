import { useEffect, useState } from "react";
import { authFetch } from "../auth";

interface HomePageProps {
  onDiscussionsClick: () => void;
  onSearchClick: () => void;
  onCommunitiesClick: () => void;
  onProfileClick: () => void;
}

interface MeResponse {
  user?: { userId: number; firstName: string; lastName: string };
  error?: string;
}

interface ConnectionRequest {
  RequesterId: number;
  RecipientId: number;
  Status: string;
  CreatedAt: string;
}

interface RequestsResponse {
  requests?: ConnectionRequest[];
  error?: string;
}

interface ProfileResponse {
  user?: { firstName: string; lastName: string };
  error?: string;
}

interface PendingRequest {
  requesterId: number;
  name: string;
}

async function loadRequesterName(requesterId: number): Promise<string> {
  try {
    const response = await authFetch(`/api/profile/${requesterId}`);
    const data: ProfileResponse = await response.json().catch(() => ({}));

    if (response.ok && data.user) {
      return `${data.user.firstName} ${data.user.lastName}`.trim();
    }
  } catch {
    // fall through to the generic label
  }

  return `Student #${requesterId}`;
}

function HomePage({
  onDiscussionsClick,
  onSearchClick,
  onCommunitiesClick,
  onProfileClick,
}: HomePageProps) {
  const [firstName, setFirstName] = useState("");
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const meRes = await authFetch("/api/auth/me");
        const me: MeResponse = await meRes.json().catch(() => ({}));

        if (!meRes.ok || !me.user) {
          throw new Error(me.error || "Could not load your account.");
        }

        const reqRes = await authFetch("/api/connection/requests");
        const data: RequestsResponse = await reqRes.json().catch(() => ({}));

        if (!reqRes.ok || !data.requests) {
          throw new Error(data.error || "Could not load connection requests.");
        }

        const pending = await Promise.all(
          data.requests.map(async (request) => ({
            requesterId: request.RequesterId,
            name: await loadRequesterName(request.RequesterId),
          }))
        );

        if (!cancelled) {
          setFirstName(me.user.firstName);
          setRequests(pending);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load your home page.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav>
          <button type = "button" className="active-nav" aria-current="page" >
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
        </nav>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>{firstName ? `Welcome to KnightLink, ${firstName}` : "Welcome to KnightLink"}</h2>
          <p>
            Connect with UCF students, join discussions, discover communities,
            and grow your network.
          </p>
        </section>

        <section className="discussion-section">
          <div className="section-header">
            <h2>Pending Connection Requests</h2>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && error && <p role="alert">{error}</p>}

          {!loading && !error && requests.length === 0 && (
            <div className="empty-state">
              <p>No pending connection requests.</p>
            </div>
          )}

          {requests.map((request) => (
            <div className="profile-card" key={request.requesterId}>
              <p>{request.name} wants to connect with you.</p>
            </div>
          ))}
        </section>

        <section className="discussion-section">
          <div className="section-header">
            <h2>Discussions</h2>
            <button type="button" onClick={onDiscussionsClick}>
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