import {useEffect, useState} from "react";
import {
  getLoggedInUserId, getConnections, getIncomingRequests,
  getProfile, acceptConnectionRequest, declineConnectionRequest
} from "../services/api";

interface ConnectionsPageProps { onBackClick: () => void; }
type ConnectionTab = "connections" | "pending" | "sent";
type Person = {userId: number; name: string; major: string};

export default function ConnectionsPage({onBackClick}: ConnectionsPageProps) {
  const [activeTab, setActiveTab] = useState<ConnectionTab>("connections");
  const [people, setPeople] = useState<Person[]>([]);
  const [pending, setPending] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const id = getLoggedInUserId();
    if (!id) throw new Error("Please log in to view connections.");
    const [connectionsResponse, requestsResponse] = await Promise.all([
      getConnections(id), getIncomingRequests()
    ]);
    const connectionPeople = await Promise.all(connectionsResponse.connections.map(async (item) => {
      const {user} = await getProfile(item.userId);
      return {userId: user.userId, name: `${user.firstName} ${user.lastName}`, major: user.major};
    }));
    const pendingPeople = await Promise.all(requestsResponse.requests.map(async (item) => {
      const {user} = await getProfile(item.RequesterId);
      return {userId: user.userId, name: `${user.firstName} ${user.lastName}`, major: user.major};
    }));
    setPeople(connectionPeople);
    setPending(pendingPeople);
  }
  useEffect(() => {
    let active = true;
    // Avoid setting results after component unmount.
    const id = getLoggedInUserId();
    if (!id) { setError("Please log in to view connections."); setLoading(false); return; }
    Promise.all([getConnections(id), getIncomingRequests()]).then(async ([conn, requests]) => {
      const [connections, incoming] = await Promise.all([
        Promise.all(conn.connections.map((item) => getProfile(item.userId))),
        Promise.all(requests.requests.map((item) => getProfile(item.RequesterId)))
      ]);
      if (!active) return;
      setPeople(connections.map(({user}) => ({userId: user.userId, name: `${user.firstName} ${user.lastName}`, major: user.major})));
      setPending(incoming.map(({user}) => ({userId: user.userId, name: `${user.firstName} ${user.lastName}`, major: user.major})));
    }).catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Unable to load connections."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function respond(userId: number, accept: boolean) {
    setWorkingId(userId); setError(""); setMessage("");
    try {
      if (accept) await acceptConnectionRequest(userId);
      else await declineConnectionRequest(userId);
      await load();
      setMessage(accept ? "Connection accepted." : "Request declined.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update request.");
    } finally { setWorkingId(null); }
  }

  return <div className="home-page">
    <header className="top-nav"><h1>KnightLink</h1><nav aria-label="Connections navigation">
      <button type="button" onClick={onBackClick}>Back to Profile</button>
    </nav></header>
    <main className="home-content">
      <section className="welcome-section"><h2>My Network</h2>
        <p>Manage your connections, review requests, and grow your UCF network.</p>
      </section>
      <section className="discussion-section">
        <div className="connection-tabs" role="group" aria-label="Connection categories">
          {(["connections", "pending", "sent"] as ConnectionTab[]).map((tab) => (
            <button key={tab} type="button" className={activeTab === tab ? "active-tab" : ""}
              aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab === "connections" ? "My Connections" : tab === "pending" ? "Pending Requests" : "Sent Requests"}
            </button>
          ))}
        </div>
        {error && <p role="alert" className="form-error">{error}</p>}
        {message && <p role="status" className="form-success">{message}</p>}
        {loading ? <p>Loading network...</p> : activeTab === "sent" ? (
          <div className="empty-state"><p>Sent requests are not available from the current backend API.</p></div>
        ) : (activeTab === "connections" ? people : pending).length === 0 ? (
          <div className="empty-state"><p>{activeTab === "connections" ? "No connections yet." : "No pending requests."}</p></div>
        ) : <div className="student-results">
          {(activeTab === "connections" ? people : pending).map((person) => <article className="student-result-card" key={person.userId}>
            <h3>{person.name}</h3><p>{person.major || "Major not provided"}</p>
            {activeTab === "pending" && <div className="profile-actions">
              <button type="button" disabled={workingId === person.userId} onClick={() => void respond(person.userId, true)}>Accept</button>
              <button type="button" disabled={workingId === person.userId} onClick={() => void respond(person.userId, false)}>Decline</button>
            </div>}
          </article>)}
        </div>}
      </section>
    </main>
  </div>;
}
