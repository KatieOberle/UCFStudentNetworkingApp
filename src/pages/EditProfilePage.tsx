
import { useState, type FormEvent } from "react";

interface ProfileData {
  firstName: string;
  lastName: string;
  major: string;
  careerInterests: string;
  contactInfo: string;
  companyAffiliations: string;
}

interface EditProfilePageProps {
  onBackClick: () => void;
  initialProfile?: ProfileData;
  onSave?: (profile: ProfileData) => Promise<void>;
}

function EditProfilePage({
  onBackClick,
  initialProfile,
  onSave,
}: EditProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData>(
    initialProfile ?? {
      firstName: "",
      lastName: "",
      major: "",
      careerInterests: "",
      contactInfo: "",
      companyAffiliations: "",
    }
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(field: keyof ProfileData, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!onSave) {
      setError("Profile saving is not connected to the server yet.");
      return;
    }

    setSaving(true);

    try {
      await onSave(profile);
      onBackClick();
    } catch {
      setError("Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="home-page">
      <header className="top-nav">
        <h1>KnightLink</h1>
        <nav aria-label="Edit profile navigation">
          <button type="button" onClick={onBackClick}>
            Back to Profile
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>Edit Profile</h2>
          <p>
            Update your student information, career interests,
            and professional connections.
          </p>
        </section>

        <section className="discussion-section">
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <label>
              First Name
              <input
                type="text"
                value={profile.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                required
              />
            </label>

            <label>
              Last Name
              <input
                type="text"
                value={profile.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                required
              />
            </label>

            <label>
              Major
              <input
                type="text"
                value={profile.major}
                onChange={(event) =>
                  updateField("major", event.target.value)
                }
              />
            </label>

            <label>
              Career Interests
              <textarea
                value={profile.careerInterests}
                onChange={(event) =>
                  updateField("careerInterests", event.target.value)
                }
                placeholder="Describe your career interests"
                rows={3}
              />
            </label>

            <label>
              Contact Information
              <input
                type="text"
                value={profile.contactInfo}
                onChange={(event) =>
                  updateField("contactInfo", event.target.value)
                }
                placeholder="Professional email or contact link"
              />
            </label>

            <label>
              Company Affiliations
              <textarea
                value={profile.companyAffiliations}
                onChange={(event) =>
                  updateField("companyAffiliations", event.target.value)
                }
                placeholder="Internships, companies, or organizations"
                rows={3}
              />
            </label>

            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}

            <div className="edit-profile-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onBackClick}
              >
                Cancel
              </button>

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default EditProfilePage;

