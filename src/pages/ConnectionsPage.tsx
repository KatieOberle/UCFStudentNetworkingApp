
import { useState } from "react";

interface ConnectionsPageProps {
  onBackClick: () => void;
}

type ConnectionTab = "connections" | "pending" | "sent";

function ConnectionsPage({ onBackClick }: ConnectionsPageProps) {
  const [activeTab, setActiveTab] =
    useState<ConnectionTab>("connections");

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Connections navigation">
          <button type="button" onClick={onBackClick}>
            Back to Profile
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>My Network</h2>
          <p>
            Manage your connections, review requests,
            and grow your UCF network.
          </p>
        </section>

        <section className="discussion-section">
          <div
            className="connection-tabs"
            role="group"
            aria-label="Connection categories"
          >
            <button
              type="button"
              className={activeTab === "connections" ? "active-tab" : ""}
              aria-pressed={activeTab === "connections"}
              onClick={() => setActiveTab("connections")}
            >
              My Connections
            </button>

            <button
              type="button"
              className={activeTab === "pending" ? "active-tab" : ""}
              aria-pressed={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            >
              Pending Requests
            </button>

            <button
              type="button"
              className={activeTab === "sent" ? "active-tab" : ""}
              aria-pressed={activeTab === "sent"}
              onClick={() => setActiveTab("sent")}
            >
              Sent Requests
            </button>
          </div>

          <div className="empty-state">
            {activeTab === "connections" && (
              <p>Your connections will appear here.</p>
            )}

            {activeTab === "pending" && (
              <p>
                Incoming connection requests will appear here.
              </p>
            )}

            {activeTab === "sent" && (
              <p>
                Your sent connection requests will appear here.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ConnectionsPage;

