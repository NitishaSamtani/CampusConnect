import { Link } from "react-router-dom";
import "../../pages/user/Dashboard/Dashboard.css";

function LatestExperiences({
  experiences,
}) {
  return (
    <div className="latest-experiences">

      <h2>
        Latest Experiences
      </h2>

      {experiences?.map(
        (experience) => (
          <Link
            key={experience._id}
            to={`/experiences/${experience._id}`}
            className="experience-card"
          >

            <div className="experience-company">
              {experience.company?.name}
            </div>

            <div className="experience-role">
              {experience.role?.title}
            </div>

            <div className="experience-result">
              {experience.result}
            </div>

          </Link>
        )
      )}

    </div>
  );
}

export default LatestExperiences;