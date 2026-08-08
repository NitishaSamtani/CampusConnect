import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getExperiences } from "../../../services/experienceService";
import {
  getCompanies,
  getCompanyRoles,
} from "../../../services/companyService";

import "./Experience.css";

function ExperienceFeed() {
  const [filters, setFilters] = useState({
    search: "",
    company: "",
    role: "",
    questionType: "",
    difficulty: "",
    campusType: "",
    result: "",
  });

  const [experiences, setExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  // Load all experiences and companies once.
  // Filtering is intentionally done on the client so the feed does not
  // become empty because of a backend search-response mismatch.
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [experienceResponse, companyResponse] =
          await Promise.all([getExperiences(), getCompanies()]);

        const experienceList =
          experienceResponse?.data?.experiences ??
          experienceResponse?.experiences ??
          experienceResponse?.data ??
          [];

        const companyList =
          companyResponse?.data?.companies ??
          companyResponse?.companies ??
          companyResponse?.data ??
          [];

        setExperiences(Array.isArray(experienceList) ? experienceList : []);
        setCompanies(Array.isArray(companyList) ? companyList : []);
      } catch (error) {
        console.error("Experience Feed Load Error:", error);
        setExperiences([]);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load roles for the selected company.
  useEffect(() => {
    const loadRoles = async () => {
      if (!filters.company) {
        setRoles([]);
        return;
      }

      try {
        const response = await getCompanyRoles(filters.company);

        const roleList =
          response?.data?.roles ??
          response?.roles ??
          response?.data ??
          [];

        setRoles(Array.isArray(roleList) ? roleList : []);
      } catch (error) {
        console.error("Load Roles Error:", error);
        setRoles([]);
      }
    };

    loadRoles();
  }, [filters.company]);

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "company" ? { role: "" } : {}),
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      company: "",
      role: "",
      questionType: "",
      difficulty: "",
      campusType: "",
      result: "",
    });
    setRoles([]);
  };

  const getId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value._id || value.id || "";
  };

  const getText = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return (
      value.name ||
      value.title ||
      value.companyName ||
      value.roleName ||
      ""
    );
  };

  const filteredExperiences = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return experiences.filter((experience) => {
      const company = experience.company;
      const role = experience.role;
      const user = experience.user;

      const rounds = Array.isArray(experience.rounds)
        ? experience.rounds
        : [];

      const allRoundText = rounds
        .flatMap((round) => [
          round.roundName,
          ...(Array.isArray(round.questions)
            ? round.questions.flatMap((question) => [
                question.questionText,
                question.questionType,
                question.difficulty,
              ])
            : []),
        ])
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchableText = [
        getText(company),
        getText(role),
        experience.college,
        experience.campusType,
        experience.result,
        getText(user),
        experience.interviewDate,
        allRoundText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesCompany =
        !filters.company ||
        getId(company) === filters.company ||
        company?.name === filters.company;

      const matchesRole =
        !filters.role ||
        getId(role) === filters.role ||
        role?.title === filters.role;

      const matchesCampus =
        !filters.campusType ||
        experience.campusType === filters.campusType;

      const matchesResult =
        !filters.result ||
        experience.result === filters.result;

      const matchesQuestionType =
        !filters.questionType ||
        rounds.some((round) =>
          Array.isArray(round.questions)
            ? round.questions.some(
                (question) =>
                  question.questionType === filters.questionType
              )
            : false
        );

      const matchesDifficulty =
        !filters.difficulty ||
        rounds.some((round) =>
          Array.isArray(round.questions)
            ? round.questions.some(
                (question) =>
                  question.difficulty === filters.difficulty
              )
            : false
        );

      return (
        matchesSearch &&
        matchesCompany &&
        matchesRole &&
        matchesCampus &&
        matchesResult &&
        matchesQuestionType &&
        matchesDifficulty
      );
    });
  }, [experiences, filters]);

  useEffect(() => {
    if (!loading) {
      setFilterLoading(true);
      const timer = setTimeout(() => setFilterLoading(false), 150);
      return () => clearTimeout(timer);
    }
  }, [filters, loading]);

  if (loading) {
    return (
      <div className="experience-page">
        <div className="experience-loading">
          <div className="loading-spinner" />
          <p>Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-page">
      <div className="experience-feed-header">
        <div className="experience-feed-header-content">
          <h1>Experience Feed</h1>
          <p>Explore interview experiences shared by students.</p>
        </div>

        <Link
          to="/experiences/create"
          className="share-experience-btn"
        >
          + Share Experience
        </Link>
      </div>

      <div className="experience-search">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search company, role, college, question..."
            value={filters.search}
            onChange={(e) =>
              handleFilterChange("search", e.target.value)
            }
          />
        </div>

        <select
          value={filters.company}
          onChange={(e) =>
            handleFilterChange("company", e.target.value)
          }
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>

        <select
          value={filters.role}
          disabled={!filters.company}
          onChange={(e) =>
            handleFilterChange("role", e.target.value)
          }
        >
          <option value="">
            {filters.company ? "All Roles" : "Select Company First"}
          </option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.title}
            </option>
          ))}
        </select>

        <select
          value={filters.questionType}
          onChange={(e) =>
            handleFilterChange("questionType", e.target.value)
          }
        >
          <option value="">All Question Types</option>
          <option value="APTITUDE">Aptitude</option>
          <option value="CODING">Coding</option>
          <option value="TECHNICAL">Technical</option>
          <option value="HR">HR</option>
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) =>
            handleFilterChange("difficulty", e.target.value)
          }
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>

        <select
          value={filters.campusType}
          onChange={(e) =>
            handleFilterChange("campusType", e.target.value)
          }
        >
          <option value="">All Campus Types</option>
          <option value="ON_CAMPUS">On Campus</option>
          <option value="OFF_CAMPUS">Off Campus</option>
        </select>

        <select
          value={filters.result}
          onChange={(e) =>
            handleFilterChange("result", e.target.value)
          }
        >
          <option value="">All Results</option>
          <option value="SELECTED">Selected</option>
          <option value="REJECTED">Rejected</option>
          <option value="WAITLISTED">Waitlisted</option>
        </select>

        <button
          type="button"
          className="clear-filters-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {filterLoading && (
        <div className="filter-loading">Updating experiences...</div>
      )}

      {!filterLoading && filteredExperiences.length === 0 ? (
        <div className="no-results">
          <h3>No Experiences Found</h3>
          <p>
            Try another search or clear the filters to see all
            experiences.
          </p>
          <button
            type="button"
            className="empty-clear-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="experience-feed-grid">
          {filteredExperiences.map((experience) => (
            <div
              key={experience._id}
              className="feed-card"
            >
              <div className="card-top">
                <h2 className="feed-title">
                  {getText(experience.company) || "Unknown Company"}
                </h2>

                {experience.result && (
                  <span
                    className={`badge ${experience.result.toLowerCase()}`}
                  >
                    {experience.result}
                  </span>
                )}
              </div>

              <div className="feed-info">
                <p>
                  <strong>Role:</strong>{" "}
                  {getText(experience.role) || "Not specified"}
                </p>

                <p>
                  <strong>College:</strong>{" "}
                  {experience.college || "Not specified"}
                </p>

                <p>
                  <strong>Campus:</strong>{" "}
                  {experience.campusType === "ON_CAMPUS"
                    ? "On Campus"
                    : experience.campusType === "OFF_CAMPUS"
                    ? "Off Campus"
                    : "Not specified"}
                </p>

                <p>
                  <strong>Shared By:</strong>{" "}
                  {getText(experience.user) || "Student"}
                </p>

                <p>
                  <strong>Interview Date:</strong>{" "}
                  {experience.interviewDate
                    ? new Date(
                        experience.interviewDate
                      ).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>

              <Link
                className="feed-link"
                to={`/experiences/${experience._id}`}
              >
                View Details <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExperienceFeed;
