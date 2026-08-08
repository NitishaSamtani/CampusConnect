import "./CompanyDetails.css";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  getCompany,
  getRoles,
} from "../../../services/companyService";

const CompanyDetails = () => {

  const { id } = useParams();

  const [company, setCompany] =
    useState(null);

  const [roles, setRoles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!id) {
      setError("Company ID is missing.");
      setLoading(false);
      return;
    }

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          companyResponse,
          rolesResponse,
        ] = await Promise.all([
          getCompany(id),
          getRoles(id),
        ]);

        setCompany(
          companyResponse?.company || null
        );

        setRoles(
          rolesResponse?.roles || []
        );

      } catch (err) {

        console.error(
          "Company Details Error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load company details."
        );

      } finally {

        setLoading(false);

      }
    };

    loadData();

  }, [id]);

  if (loading) {
    return (
      <div className="company-details-page">
        <div className="company-loading">
          Loading company...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-details-page">

        <div className="company-error">

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <Link
            to="/companies"
            className="back-link"
          >
            ← Back to Companies
          </Link>

        </div>

      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-details-page">

        <div className="company-error">

          <h2>
            Company Not Found
          </h2>

          <Link
            to="/companies"
            className="back-link"
          >
            ← Back to Companies
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="company-details-page">

      <div className="company-details-header">

        <Link
          to="/companies"
          className="back-link"
        >
          ← Back to Companies
        </Link>

        <h1>
          {company.name}
        </h1>

        {company.description && (
          <p className="company-description">
            {company.description}
          </p>
        )}

      </div>

      <section className="roles-section">

        <div className="roles-section-header">

          <h2>
            Available Roles
          </h2>

          <span className="roles-count">
            {roles.length}{" "}
            {roles.length === 1
              ? "Role"
              : "Roles"}
          </span>

        </div>

        {roles.length === 0 ? (

          <div className="no-roles">

            <h3>
              No Roles Available
            </h3>

            <p>
              No interview roles have
              been added for this company yet.
            </p>

          </div>

        ) : (

          <div className="roles-grid">

            {roles.map((role) => (

              <div
                className="role-card"
                key={role._id}
              >

                <div className="role-card-content">

                  <h3>
                    {role.title}
                  </h3>

                  <p className="experience-count">
                    {role.experienceCount || 0}{" "}
                    {(role.experienceCount || 0) === 1
                      ? "Experience"
                      : "Experiences"}
                  </p>

                </div>

                <Link
                  to={`/companies/${id}/roles/${role._id}`}
                  className="role-link"
                >
                  View Experiences →
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default CompanyDetails;