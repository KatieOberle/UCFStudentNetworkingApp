
import { useEffect, useState, type FormEvent } from "react";
import { getProfile, updateProfile } from "../services/api";
import type { StudentProfile } from "../services/api";

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

const emptyProfile: ProfileData = {
  firstName: "",
  lastName: "",
  major: "",
  careerInterests: "",
  contactInfo: "",
  companyAffiliations: "",
};

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

function toCommaSeparated(values: string[]) {
  return values.join(", ");
}

function toArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function profileToForm(user: StudentProfile): ProfileData {
  const contact = user.contact ?? {};

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    major: user.major ?? "",
    careerInterests: toCommaSeparated(user.careerInterests ?? []),
    contactInfo:
      typeof contact.info === "string" ? contact.info : "",
    companyAffiliations: toCommaSeparated(user.companies ?? []),
  };
}

function EditProfilePage({
  onBackClick,
  initialProfile,
  onSave,
}: EditProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData>(
    initialProfile ?? emptyProfile
  );

  const [existingContact, setExistingContact] = useState<
    Record<string, unknown>
  >({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const userId = getLoggedInUserId();

      if (!userId) {
        setError("Please log in to edit your profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile(userId);

        if (cancelled) return;

        setProfile(profileToForm(response.user));
        setExistingContact(response.user.contact ?? {});
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field: keyof ProfileData, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const userId = getLoggedInUserId();

    if (!userId) {
      setError("Please log in before saving your profile.");
      return;
    }

    setSaving(true);

    try {
      if (onSave) {
        await onSave(profile);
      } else {
        const response = await updateProfile(userId, {
          Major: profile.major.trim(),
          CareerInterests: toArray(profile.careerInterests),
          Companies: toArray(profile.companyAffiliations),
          Contact: {
            ...existingContact,
            info: profile.contactInfo.trim(),
          },
        });

        setProfile(profileToForm(response.user));
        setExistingContact(response.user.contact ?? {});
      }

      setSuccess("Profile changes saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your profile. Please try again."
      );
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
          {loading ? (
            <p>Loading your profile...</p>
          ) : (
            <form
              className="edit-profile-form"
              onSubmit={handleSubmit}
            >
              <label>
                First Name
                <input
                  type="text"
                  value={profile.firstName}
                  readOnly
                />
              </label>

              <label>
                Last Name
                <input
                  type="text"
                  value={profile.lastName}
                  readOnly
                />
              </label>

              <small>
                Your account name cannot be changed here.
              </small>

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
                    updateField(
                      "careerInterests",
                      event.target.value
                    )
                  }
                  placeholder="Software engineering, cybersecurity, AI"
                  rows={3}
                />
              </label>

              <label>
                Contact Information
                <input
                  type="text"
                  value={profile.contactInfo}
                  onChange={(event) =>
                    updateField(
                      "contactInfo",
                      event.target.value
                    )
                  }
                  placeholder="Professional email or contact link"
                />
              </label>

              <label>
                Company Affiliations
                <textarea
                  value={profile.companyAffiliations}
                  onChange={(event) =>
                    updateField(
                      "companyAffiliations",
                      event.target.value
                    )
                  }
                  placeholder="Google, Microsoft, UCF"
                  rows={3}
                />
              </label>

              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}

              {success && (
                <p role="status">{success}</p>
              )}

              <div className="edit-profile-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onBackClick}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default EditProfilePage;

