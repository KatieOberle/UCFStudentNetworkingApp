
import { useState } from "react";
import type { Student } from "./SearchPage";

interface StudentProfilePageProps {
  student: Student | null;
  onBackClick: () => void;
  onConnect?: (studentId: string) => Promise<void>;
  onReportClick?: (student: Student) => void;
}

function StudentProfilePage({
  student,
  onBackClick,
  onConnect,
  onReportClick,
}: StudentProfilePageProps) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [connecting, setConnecting] = useState(false);

  async function handleConnect() {
    if (!student) return;

    setError("");
    setMessage("");

    if (!onConnect) {
      setError("Connection requests are not connected to the server yet.");
      return;
    }

    setConnecting(true);

    try {
      await onConnect(student.id);
      setMessage("Connection request sent.");
    } catch {
      setError("Unable to send connection request. Please try again.");
    } finally {
      setConnecting(false);
    }
  }

  function handleReport() {
    if (!student) return;

    if (!onReportClick) {
      setError("User reporting is not available yet.");
      return;
    }

    onReportClick(student);
  }

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Student profile navigation">
          <button type="button" onClick={onBackClick}>
            Back to Search
          </button>
        </nav>
      </header>

      <main className="home-content">
        {!student ? (
          <section className="discussion-section">
            <h2>Student Profile</h2>
            <p>No student selected.</p>
          </section>
        ) : (
          <>
            <section className="profile-header">
              <div>
                <h2>
                  {student.firstName} {student.lastName}
                </h2>
                <p>UCF Student Profile</p>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={connecting}
                >
                  {connecting ? "Sending..." : "Connect"}
                </button>

                <button
                  type="button"
                  className="report-user-button"
                  onClick={handleReport}
                >
                  Report User
                </button>
              </div>
            </section>

            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="form-success">
                {message}
              </p>
            )}

            <section className="profile-grid">
              <div className="profile-card">
                <h3>Major</h3>
                <p>{student.major || "Not provided"}</p>
              </div>

              <div className="profile-card">
                <h3>Graduation Year</h3>
                <p>
                  {student.graduationYear || "Not provided"}
                </p>
              </div>

              <div className="profile-card">
                <h3>Career Interests</h3>
                <p>
                  {student.careerInterests?.length
                    ? student.careerInterests.join(", ")
                    : "Not provided"}
                </p>
              </div>

              <div className="profile-card">
                <h3>Company Affiliations</h3>
                <p>
                  {student.companies?.length
                    ? student.companies.join(", ")
                    : "Not provided"}
                </p>
              </div>

              <div className="profile-card">
                <h3>About</h3>
                <p>{student.bio || "No bio provided."}</p>
              </div>

              <div className="profile-card">
                <h3>Contact Information</h3>

                {student.contactEmail ? (
                  <p>
                    Email: {student.contactEmail}
                  </p>
                ) : (
                  <p>No email provided.</p>
                )}

                {student.linkedIn && (
                  <p>
                    <a
                      href={student.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn Profile
                    </a>
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default StudentProfilePage;

