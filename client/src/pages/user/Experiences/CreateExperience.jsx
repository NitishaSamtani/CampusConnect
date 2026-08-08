import { useEffect, useState } from "react";

import { createExperience } from "../../../services/experienceService";
import {
  getCompanies,
  getRoles,
} from "../../../services/companyService";

import "./Experience.css";

const initialForm = {
  companyId: "",
  companyName: "",
  roleId: "",
  roleName: "",
  college: "",
  campusType: "ON_CAMPUS",
  result: "SELECTED",
  interviewDate: "",
  rounds: [],
};

function CreateExperience() {
  const [formData, setFormData] = useState(initialForm);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roundName, setRoundName] = useState("OA");
  const [isOtherCompany, setIsOtherCompany] = useState(false);
  const [isOtherRole, setIsOtherRole] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);

        const response = await getCompanies();

        const companyList =
          response?.data?.companies ??
          response?.companies ??
          response?.data ??
          [];

        setCompanies(Array.isArray(companyList) ? companyList : []);
      } catch (error) {
        console.error("Company Load Error:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleCompanyChange = async (e) => {
    const value = e.target.value;

    if (value === "other") {
      setIsOtherCompany(true);
      setIsOtherRole(true);
      setRoles([]);

      setFormData((previous) => ({
        ...previous,
        companyId: "",
        companyName: "",
        roleId: "",
        roleName: "",
      }));

      return;
    }

    setIsOtherCompany(false);
    setIsOtherRole(false);

    setFormData((previous) => ({
      ...previous,
      companyId: value,
      companyName: "",
      roleId: "",
      roleName: "",
    }));

    if (!value) {
      setRoles([]);
      return;
    }

    try {
      const response = await getRoles(value);

      const roleList =
        response?.data?.roles ??
        response?.roles ??
        response?.data ??
        [];

      setRoles(Array.isArray(roleList) ? roleList : []);
    } catch (error) {
      console.error("Role Load Error:", error);
      setRoles([]);
    }
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;

    if (value === "other") {
      setIsOtherRole(true);

      setFormData((previous) => ({
        ...previous,
        roleId: "",
        roleName: "",
      }));

      return;
    }

    setIsOtherRole(false);

    setFormData((previous) => ({
      ...previous,
      roleId: value,
      roleName: "",
    }));
  };

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addRound = () => {
    const cleanName = roundName.trim();

    if (!cleanName) return;

    setFormData((previous) => ({
      ...previous,
      rounds: [
        ...previous.rounds,
        {
          roundName: cleanName,
          questions: [],
        },
      ],
    }));
  };

  const removeRound = (roundIndex) => {
    setFormData((previous) => ({
      ...previous,
      rounds: previous.rounds.filter(
        (_, index) => index !== roundIndex
      ),
    }));
  };

  const addQuestion = (roundIndex) => {
    setFormData((previous) => {
      const rounds = previous.rounds.map((round, index) => {
        if (index !== roundIndex) return round;

        return {
          ...round,
          questions: [
            ...round.questions,
            {
              questionText: "",
              questionType: "TECHNICAL",
              difficulty: "MEDIUM",
            },
          ],
        };
      });

      return {
        ...previous,
        rounds,
      };
    });
  };

  const removeQuestion = (roundIndex, questionIndex) => {
    setFormData((previous) => ({
      ...previous,
      rounds: previous.rounds.map((round, index) =>
        index === roundIndex
          ? {
              ...round,
              questions: round.questions.filter(
                (_, qIndex) => qIndex !== questionIndex
              ),
            }
          : round
      ),
    }));
  };

  const handleQuestionChange = (
    roundIndex,
    questionIndex,
    field,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,
      rounds: previous.rounds.map((round, rIndex) =>
        rIndex === roundIndex
          ? {
              ...round,
              questions: round.questions.map(
                (question, qIndex) =>
                  qIndex === questionIndex
                    ? {
                        ...question,
                        [field]: value,
                      }
                    : question
              ),
            }
          : round
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (!formData.companyId && !formData.companyName.trim()) ||
      (!formData.roleId && !formData.roleName.trim()) ||
      !formData.college.trim() ||
      !formData.campusType ||
      !formData.interviewDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.rounds.length === 0) {
      alert("Please add at least one interview round.");
      return;
    }

    try {
      setSubmitting(true);

      await createExperience({
        ...formData,
        companyName: formData.companyName.trim(),
        roleName: formData.roleName.trim(),
        college: formData.college.trim(),
      });

      alert("Experience Posted Successfully");

      setFormData(initialForm);
      setRoles([]);
      setIsOtherCompany(false);
      setIsOtherRole(false);
      setRoundName("OA");
    } catch (error) {
      console.error("Create Experience Error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to post experience"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-experience-page">
      <div className="create-experience-header">
        <div>
          <span className="page-eyebrow">Experience Feed</span>
          <h1>Share Interview Experience</h1>
          <p>
            Help other students prepare by sharing your real interview
            experience.
          </p>
        </div>

        <a
          href="/experiences"
          className="back-to-feed"
        >
          ← Back to Feed
        </a>
      </div>

      <form
        className="experience-form"
        onSubmit={handleSubmit}
      >
        <section className="form-section">
          <div className="section-heading">
            <span>01</span>
            <div>
              <h2>Interview Details</h2>
              <p>Tell us about the company and your interview.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field full-width">
              <label>Company *</label>

              {!isOtherCompany ? (
                <>
                  <select
                    className="form-select"
                    value={formData.companyId}
                    onChange={handleCompanyChange}
                    disabled={loading}
                  >
                    <option value="">
                      {loading
                        ? "Loading companies..."
                        : "Select Existing Company"}
                    </option>

                    {companies.map((company) => (
                      <option
                        key={company._id}
                        value={company._id}
                      >
                        {company.name}
                      </option>
                    ))}

                    <option value="other">Other Company</option>
                  </select>

                  <span className="field-help">
                    Choose an existing company or select Other Company.
                  </span>
                </>
              ) : (
                <input
                  className="form-input"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) =>
                    updateField("companyName", e.target.value)
                  }
                />
              )}
            </div>

            <div className="form-field">
              <label>Role *</label>

              {isOtherRole ? (
                <input
                  className="form-input"
                  placeholder="Enter role"
                  value={formData.roleName}
                  onChange={(e) =>
                    updateField("roleName", e.target.value)
                  }
                />
              ) : (
                <select
                  className="form-select"
                  value={formData.roleId}
                  onChange={handleRoleChange}
                  disabled={!formData.companyId}
                >
                  <option value="">
                    {formData.companyId
                      ? "Select Role"
                      : "Select Company First"}
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role._id}
                      value={role._id}
                    >
                      {role.title}
                    </option>
                  ))}

                  {formData.companyId && (
                    <option value="other">Other Role</option>
                  )}
                </select>
              )}
            </div>

            <div className="form-field">
              <label>College *</label>
              <input
                className="form-input"
                placeholder="Enter your college"
                value={formData.college}
                onChange={(e) =>
                  updateField("college", e.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label>Campus Type *</label>
              <select
                className="form-select"
                value={formData.campusType}
                onChange={(e) =>
                  updateField("campusType", e.target.value)
                }
              >
                <option value="ON_CAMPUS">On Campus</option>
                <option value="OFF_CAMPUS">Off Campus</option>
              </select>
            </div>

            <div className="form-field">
              <label>Interview Date *</label>
              <input
                className="form-input"
                type="date"
                value={formData.interviewDate}
                onChange={(e) =>
                  updateField("interviewDate", e.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label>Result</label>
              <select
                className="form-select"
                value={formData.result}
                onChange={(e) =>
                  updateField("result", e.target.value)
                }
              >
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
                <option value="WAITLISTED">Waitlisted</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>02</span>
            <div>
              <h2>Interview Rounds</h2>
              <p>Add the rounds and questions you remember.</p>
            </div>
          </div>

          <div className="round-builder">
            <div className="round-builder-row">
              <div className="form-field">
                <label>Round Type</label>
                <select
                  className="form-select"
                  value={roundName}
                  onChange={(e) =>
                    setRoundName(e.target.value)
                  }
                >
                  <option value="OA">Online Assessment Round</option>
                  <option value="TECHNICAL">Technical Round</option>
                  <option value="HR">HR Round</option>
                </select>
              </div>

              <button
                type="button"
                className="primary-btn add-round-btn"
                onClick={addRound}
              >
                + Add Round
              </button>
            </div>
          </div>

          {formData.rounds.length === 0 ? (
            <div className="round-empty">
              <div className="empty-icon">+</div>
              <h3>No rounds added yet</h3>
              <p>
                Select a round type above and click Add Round.
              </p>
            </div>
          ) : (
            <div className="round-list">
              {formData.rounds.map((round, roundIndex) => (
                <div
                  className="round-card"
                  key={`${round.roundName}-${roundIndex}`}
                >
                  <div className="round-card-header">
                    <div>
                      <span className="round-number">
                        Round {roundIndex + 1}
                      </span>
                      <h3>{round.roundName}</h3>
                    </div>

                    <div className="round-actions">
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                          addQuestion(roundIndex)
                        }
                      >
                        + Add Question
                      </button>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          removeRound(roundIndex)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {round.questions.length === 0 ? (
                    <div className="question-empty">
                      No questions added to this round yet.
                    </div>
                  ) : (
                    <div className="question-list">
                      {round.questions.map(
                        (question, questionIndex) => (
                          <div
                            className="question-card"
                            key={questionIndex}
                          >
                            <div className="question-header">
                              <strong>
                                Question {questionIndex + 1}
                              </strong>

                              <button
                                type="button"
                                className="remove-question-btn"
                                onClick={() =>
                                  removeQuestion(
                                    roundIndex,
                                    questionIndex
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>

                            <textarea
                              className="form-textarea"
                              placeholder="Enter the interview question..."
                              value={question.questionText}
                              onChange={(e) =>
                                handleQuestionChange(
                                  roundIndex,
                                  questionIndex,
                                  "questionText",
                                  e.target.value
                                )
                              }
                            />

                            <div className="question-fields">
                              <div className="form-field">
                                <label>Question Type</label>
                                <select
                                  className="form-select"
                                  value={question.questionType}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      roundIndex,
                                      questionIndex,
                                      "questionType",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="APTITUDE">
                                    Aptitude
                                  </option>
                                  <option value="CODING">
                                    Coding
                                  </option>
                                  <option value="TECHNICAL">
                                    Technical
                                  </option>
                                  <option value="HR">HR</option>
                                </select>
                              </div>

                              <div className="form-field">
                                <label>Difficulty</label>
                                <select
                                  className="form-select"
                                  value={question.difficulty}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      roundIndex,
                                      questionIndex,
                                      "difficulty",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="EASY">Easy</option>
                                  <option value="MEDIUM">
                                    Medium
                                  </option>
                                  <option value="HARD">Hard</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="form-submit-bar">
          <div>
            <strong>Ready to share?</strong>
            <p>Your experience can help another student prepare.</p>
          </div>

          <button
            type="submit"
            className="primary-btn submit-btn"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Submit Experience"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateExperience;
