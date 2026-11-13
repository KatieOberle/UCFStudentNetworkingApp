
import { useState, type FormEvent } from "react";
import type { Student } from "./SearchPage";

export interface ReportData {
  reportedUserId: string;
  reason: string;
  details: string;
}

interface ReportUserPageProps {
  student: Student | null;
  onBackClick: () => void;
  onSubmitReport?: (report: ReportData) => Promise<void>;
}

function ReportUserPage({
  student,
  onBackClick,
  onSubmitReport,
}: ReportUserPageProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!student) {
      setError("No student selected.");
      return;
    }

    if (!reason) {
      setError("Please select a reason for your report.");
      return;
    }

    if (details.trim().length < 10) {
      setError("Please provide at least 10 characters of details.");
      return;
    }

    if (!onSubmitReport) {
      setError("Reporting is not connected to the server yet.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmitReport({
        reportedUserId: student.id,
        reason,
        details: details.trim(),
      });

      onBackClick();
    } catch {
      setError("Unable to submit your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Report user navigation">
          <button type="button" onClick={onBackClick}>
            Back to Profile
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>Report User</h2>
          <p>
            Help keep KnightLink safe and respectful for the
            UCF community.
          </p>
        </section>

        <section className="discussion-section">
          {student ? (
            <>
              <p className="report-user-description">
                Reporting:{" "}
                <strong>
                  {student.firstName} {student.lastName}
                </strong>
              </p>

              <form
                className="report-user-form"
                onSubmit={handleSubmit}
              >
                <label htmlFor="report-reason">
                  Reason for Report
                </label>

                <select
                  id="report-reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="harassment">
                    Harassment or Bullying
                  </option>
                  <option value="spam">
                    Spam or Unwanted Content
                  </option>
                  <option value="impersonation">
                    Impersonation
                  </option>
                  <option value="inappropriate">
                    Inappropriate Content
                  </option>
                  <option value="other">
                    Other
                  </option>
                </select>

                <label htmlFor="report-details">
                  Additional Details
                </label>

                <textarea
                  id="report-details"
                  value={details}
                  onChange={(event) =>
                    setDetails(event.target.value)
                  }
                  placeholder="Describe what happened..."
                  rows={6}
                  maxLength={2000}
                  required
                />

                <small>
                  Please provide enough information for
                  moderators to review your report.
                </small>

                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}

                <div className="report-user-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onBackClick}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Report"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <p>No student selected for reporting.</p>
              <button type="button" onClick={onBackClick}>
                Back to Search
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ReportUserPage;
