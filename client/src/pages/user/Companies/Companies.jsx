import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCompanies } from "../../../services/companyService";

import "./Company.css";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCompanies();

      setCompanies(
        response?.companies || []
      );
    } catch (err) {
      console.error(
        "Load Companies Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="companies-page">
        <div className="companies-loading">
          Loading companies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="companies-page">
        <div className="companies-error">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            onClick={loadCompanies}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="companies-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="companies-header">

        <h1>Companies</h1>

        <p>
          Explore companies and their
          interview experiences.
        </p>

      </div>


      {/* ================================
          EMPTY STATE
      ================================= */}

      {companies.length === 0 ? (

        <div className="companies-empty">

          <h2>
            No Companies Found
          </h2>

          <p>
            No companies have been added yet.
          </p>

        </div>

      ) : (

        /* ================================
           COMPANY GRID
        ================================= */

        <div className="companies-grid">

          {companies.map((company) => {

            const experienceCount =
              company.experienceCount || 0;

            return (
              <div
                className="company-card"
                key={company._id}
              >

                <div className="company-logo">

                  {company.name
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>


                <div className="company-card-content">

                  <h2>
                    {company.name}
                  </h2>

                  <p className="company-experience-count">
                    <strong>
                      {experienceCount}
                    </strong>{" "}
                    {experienceCount === 1
                      ? "Experience"
                      : "Experiences"}{" "}
                    Shared
                  </p>

                </div>


                <Link
                  to={`/companies/${company._id}`}
                  className="view-company-btn"
                >
                  View Roles →
                </Link>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default Companies;