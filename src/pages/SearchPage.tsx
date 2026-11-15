
import { useState, type FormEvent } from "react";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  major?: string;
  graduationYear?: string | number;
  careerInterests?: string[];
  companies?: string[];
  bio?: string;
  contactEmail?: string;
  linkedIn?: string;
}

interface SearchPageProps {
  onHomeClick: () => void;
  onDiscussionsClick: () => void;
  onCommunitiesClick: () => void;
  onProfileClick: () => void;
  onStudentClick: (student: Student) => void;
  onSearchStudents?: (query: string) => Promise<Student[]>;
}

function SearchPage({
  onHomeClick,
  onDiscussionsClick,
  onCommunitiesClick,
  onProfileClick,
  onStudentClick,
  onSearchStudents,
}: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Student[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const query = searchTerm.trim();

    if (!query) {
      setResults([]);
      setSearched(false);
      setError("Enter a name, major, interest, or company.");
      return;
    }

    if (!onSearchStudents) {
      setResults([]);
      setSearched(false);
      setError("Student search is not connected to the server yet.");
      return;
    }

    setLoading(true);

    try {
      const students = await onSearchStudents(query);
      setResults(students);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(false);
      setError("Unable to search students. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>

        <nav aria-label="Main navigation">
          <button type="button" onClick={onHomeClick}>
            Home
          </button>

          <button type="button" onClick={onDiscussionsClick}>
            Discussions
          </button>

          <button
            type="button"
            className="active-nav"
            aria-current="page"
          >
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
          <h2>Search Students</h2>
          <p>
            Find students by name, major, career interests, or
            company affiliations.
          </p>
        </section>

        <section className="discussion-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search students..."
              aria-label="Search students"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          {!searched && !error && (
            <div className="empty-state">
              <p>Search for students to see results.</p>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="empty-state">
              <p>No students matched your search.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="student-results">
              <h3>
                Search Results ({results.length})
              </h3>

              <div className="student-results-grid">
                {results.map((student) => (
                  <article
                    key={student.id}
                    className="student-result-card"
                  >
                    <div
                      className="student-avatar"
                      aria-hidden="true"
                    >
                      {student.firstName.charAt(0)}
                      {student.lastName.charAt(0)}
                    </div>

                    <h3>
                      {student.firstName} {student.lastName}
                    </h3>

                    <p>
                      <strong>Major:</strong>{" "}
                      {student.major || "Not provided"}
                    </p>

                    <p>
                      <strong>Career Interests:</strong>{" "}
                      {student.careerInterests?.length
                        ? student.careerInterests.join(", ")
                        : "Not provided"}
                    </p>

                    <button
                      type="button"
                      onClick={() => onStudentClick(student)}
                    >
                      View Profile
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SearchPage;
