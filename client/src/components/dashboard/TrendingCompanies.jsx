import { Link } from "react-router-dom";
import "../../pages/user/Dashboard/Dashboard.css";

function TrendingCompanies({
  companies,
}) {
  return (
    <div className="trending-companies">

      <h2>
        Trending Companies
      </h2>

      <div className="company-grid">

        {companies?.map(
          (company) => (
            <Link
              key={company._id?._id}
              to={`/companies/${company._id?._id}`}
              className="company-card"
            >

              <h3>
                {company._id?.name}
              </h3>

              <div className="company-count">
                {company.total}
                {" "}
                Experiences
              </div>

            </Link>
          )
        )}

      </div>

    </div>
  );
}

export default TrendingCompanies;