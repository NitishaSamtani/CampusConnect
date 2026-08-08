import { useEffect, useState } from "react";
import { User, Pencil, Briefcase, MessageCircle } from "lucide-react";

import {
  getProfile,
  updateProfile,
  getMyExperiences,
  getMyComments,
} from "../../../services/userService";

import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [experiences, setExperiences] =
    useState([]);

  const [comments, setComments] =
    useState([]);

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    college: "",
    branch: "",
    graduationYear: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [
        profileData,
        experienceData,
        commentData,
      ] = await Promise.all([
        getProfile(),
        getMyExperiences(),
        getMyComments(),
      ]);

      setUser(profileData.user);

      setForm({
        name: profileData.user.name || "",
        college:
          profileData.user.college || "",
        branch:
          profileData.user.branch || "",
        graduationYear:
          profileData.user.graduationYear || "",
      });

      setExperiences(
        experienceData.experiences || []
      );

      setComments(
        commentData.comments || []
      );

    } catch (error) {
      console.error(
        "Profile Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response =
        await updateProfile({
          ...form,
          graduationYear:
            form.graduationYear
              ? Number(
                  form.graduationYear
                )
              : null,
        });

      setUser(response.user);

      setEditing(false);

    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        Unable to load profile.
      </div>
    );
  }

 return (
  <div className="profile-page">

    {/* =========================================
        PROFILE HEADER
    ========================================= */}
    <section className="profile-header-card">

      <div className="profile-avatar">
        <User size={42} />
      </div>

      <div className="profile-header-info">
        <h1>{user.name}</h1>

        <p>
          {user.email}
        </p>
      </div>

      <button
        type="button"
        className="edit-profile-btn"
        onClick={() => setEditing(!editing)}
      >
        <Pencil size={17} />
        {editing ? "Close Edit" : "Edit Profile"}
      </button>

    </section>


    {/* =========================================
        PERSONAL INFORMATION
    ========================================= */}
    <section className="profile-section">

      <div className="section-title">
        <User size={21} />

        <h2>
          Personal Information
        </h2>
      </div>


      {/* EDIT PROFILE FORM */}
      {editing ? (

        <div className="profile-form">

          <div className="form-group">
            <label>
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label>
              College
            </label>

            <input
              type="text"
              name="college"
              value={form.college}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label>
              Branch
            </label>

            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label>
              Graduation Year
            </label>

            <input
              type="number"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              min="1900"
              max="2100"
            />
          </div>


          {/* FORM ACTIONS */}
          <div className="profile-actions">

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>


            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditing(false);

                setForm({
                  name: user.name || "",
                  college: user.college || "",
                  branch: user.branch || "",
                  graduationYear:
                    user.graduationYear || "",
                });
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      ) : (

        /* =====================================
           VIEW PERSONAL INFORMATION
        ===================================== */
        <div className="profile-info-grid">

          <div>
            <span>
              Name
            </span>

            <strong>
              {user.name}
            </strong>
          </div>


          <div>
            <span>
              Email
            </span>

            <strong>
              {user.email}
            </strong>
          </div>


          <div>
            <span>
              College
            </span>

            <strong>
              {user.college || "Not added"}
            </strong>
          </div>


          <div>
            <span>
              Branch
            </span>

            <strong>
              {user.branch || "Not added"}
            </strong>
          </div>


          <div>
            <span>
              Graduation Year
            </span>

            <strong>
              {user.graduationYear || "Not added"}
            </strong>
          </div>

        </div>

      )}

    </section>


    {/* =========================================
        MY EXPERIENCES
    ========================================= */}
    <section className="profile-section">

      <div className="section-title">

        <Briefcase size={21} />

        <h2>
          My Experiences
        </h2>

      </div>


      {experiences.length === 0 ? (

        <p className="empty-text">
          You haven't shared any
          experiences yet.
        </p>

      ) : (

        <div className="profile-list">

          {experiences.map(
            (experience) => (

              <div
                className="profile-list-card"
                key={experience._id}
              >

                <h3>
                  {experience.company?.name ||
                    "Company"}
                </h3>


                <p>
                  <strong>
                    Role:
                  </strong>{" "}

                  {experience.role?.title ||
                    experience.role?.name ||
                    "Not added"}
                </p>


                <p>
                  <strong>
                    College:
                  </strong>{" "}

                  {experience.college ||
                    "Not added"}
                </p>


                <span
                  className={
                    experience.result ===
                    "SELECTED"
                      ? "result selected"
                      : experience.result ===
                        "REJECTED"
                        ? "result rejected"
                        : "result waitlisted"
                  }
                >
                  {experience.result}
                </span>

              </div>

            )
          )}

        </div>

      )}

    </section>


    {/* =========================================
        MY COMMENTS
    ========================================= */}
    <section className="profile-section">

      <div className="section-title">

        <MessageCircle size={21} />

        <h2>
          My Comments
        </h2>

      </div>


      {comments.length === 0 ? (

        <p className="empty-text">
          You haven't posted any
          comments yet.
        </p>

      ) : (

        <div className="profile-list">

          {comments.map(
            (comment) => (

              <div
                className="comment-card"
                key={comment._id}
              >

                <p>
                  {comment.message}
                </p>


                {comment.experienceId && (
                  <small>
                    {comment.experienceId?.company?.name ||
                      "Interview Experience"}
                  </small>
                )}

              </div>

            )
          )}

        </div>

      )}

    </section>


    {/* =========================================
        END PROFILE
    ========================================= */}

  </div>
);
};

export default Profile;