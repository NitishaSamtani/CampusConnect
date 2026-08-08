import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getExperienceById,
} from "../../../services/experienceService";

import Comments from "../../../components/comments/Comments";

import "./Experience.css";


function ExperienceDetails() {

  const { id } = useParams();

  const [experience, setExperience] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  /*
  ========================================
  LOAD EXPERIENCE
  ========================================
  */

  const loadExperience = async () => {

    try {

      setLoading(true);

      const response =
        await getExperienceById(id);

      setExperience(
        response.data?.experience || null
      );

    } catch (error) {

      console.error(
        "Get Experience Error:",
        error
      );

      setExperience(null);

    } finally {

      setLoading(false);

    }

  };


  /*
  ========================================
  LOAD ON PAGE OPEN
  ========================================
  */

  useEffect(() => {

    if (id) {
      loadExperience();
    }

  }, [id]);


  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {

    return (

      <div className="experience-details-page">

        <div className="detail-card">

          <p>
            Loading experience...
          </p>

        </div>

      </div>

    );

  }


  /*
  ========================================
  NOT FOUND
  ========================================
  */

  if (!experience) {

    return (

      <div className="experience-details-page">

        <div className="detail-card">

          <h2>
            Experience Not Found
          </h2>

          <p>
            This interview experience could
            not be found or may have been
            removed.
          </p>

        </div>

      </div>

    );

  }


  /*
  ========================================
  PAGE
  ========================================
  */

  return (

    <div className="experience-details-page">


      {/* =================================
          EXPERIENCE HEADER
      ================================= */}

      <div className="detail-card">

        <h1 className="page-title">

          {experience.company?.name ||
            "Company"}

        </h1>


        <h2>

          {experience.role?.title ||
            "Role"}

        </h2>


        <p>

          <strong>
            College:
          </strong>{" "}

          {experience.college ||
            "Not available"}

        </p>


        <p>

          <strong>
            Campus:
          </strong>{" "}

          {experience.campusType ===
          "ON_CAMPUS"
            ? "On Campus"
            : experience.campusType ===
              "OFF_CAMPUS"
            ? "Off Campus"
            : "Not available"}

        </p>


        <p>

          <strong>
            Result:
          </strong>{" "}

          <span className="badge">

            {experience.result}

          </span>

        </p>


        <p>

          <strong>
            Interview Date:
          </strong>{" "}

          {
            experience.interviewDate
              ? new Date(
                  experience.interviewDate
                ).toLocaleDateString()
              : "Not available"
          }

        </p>


        <p>

          <strong>
            Shared By:
          </strong>{" "}

          {experience.user?.name ||
            "Student"}

        </p>

      </div>


      {/* =================================
          INTERVIEW ROUNDS
      ================================= */}

      <div className="rounds-section">

        <h2 className="section-title">
          Interview Rounds
        </h2>


        {
          experience.rounds?.length > 0 ? (

            experience.rounds.map(
              (round, index) => (

                <div
                  key={
                    round._id ||
                    index
                  }
                  className="round-card"
                >

                  <h2 className="round-title">

                    {round.roundName}
                    {" "}Round

                  </h2>


                  {
                    round.questions?.length >
                    0 ? (

                      round.questions.map(
                        (
                          question,
                          qIndex
                        ) => (

                          <div
                            key={
                              question._id ||
                              qIndex
                            }
                            className="question-card"
                          >

                            <p className="question-text">

                              {
                                question.questionText
                              }

                            </p>


                            <div
                              className="question-meta"
                              style={{
                                marginTop:
                                  "10px",
                              }}
                            >

                              <span
                                className="badge"
                              >

                                {
                                  question.questionType
                                }

                              </span>


                              <span
                                className="badge"
                              >

                                {
                                  question.difficulty
                                }

                              </span>

                            </div>

                          </div>

                        )
                      )

                    ) : (

                      <p>
                        No questions added
                        for this round.
                      </p>

                    )

                  }

                </div>

              )
            )

          ) : (

            <div className="detail-card">

              <p>
                No interview rounds
                available.
              </p>

            </div>

          )
        }

      </div>


      {/* =================================
          COMMENTS
      ================================= */}

      <div className="comments-section">

        <div className="detail-card">

          <h2 className="round-title">

            Comments & Discussion

          </h2>


          <Comments
            experienceId={
              experience._id
            }
          />

        </div>

      </div>


    </div>

  );

}


export default ExperienceDetails;