import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getExperiences } from "../../../services/experienceService";

import {
  getDiscussionRoomByRole,
} from "../../../services/discussionApi";

import "./RoleDetails.css";


const RoleDetails = () => {

  const { companyId, roleId } = useParams();

  const [experiences, setExperiences] =
    useState([]);

  const [discussionRoom, setDiscussionRoom] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [discussionLoading, setDiscussionLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  ========================================
  LOAD EXPERIENCES + DISCUSSION ROOM
  ========================================
  */

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);
      setDiscussionLoading(true);
      setError("");

      try {

        /*
        ------------------------------------
        Load Experiences
        ------------------------------------
        */

        const experienceResponse =
          await getExperiences(
            companyId,
            roleId
          );


        /*
        ------------------------------------
        Handle Axios response
        ------------------------------------
        */

        setExperiences(
          experienceResponse?.data?.experiences ||
          experienceResponse?.experiences ||
          []
        );


        /*
        ------------------------------------
        Load Discussion Room
        ------------------------------------
        */

        try {

          console.log(
            "Current Role ID:",
            roleId
          );

          const discussionResponse =
            await getDiscussionRoomByRole(
              roleId
            );

          console.log(
            "Discussion Room API Response:",
            discussionResponse
          );


          const room =
            discussionResponse?.data?.room ||
            discussionResponse?.room ||
            null;


          console.log(
            "Discussion Room:",
            room
          );


          setDiscussionRoom(room);

        } catch (discussionError) {

          console.error(
            "Discussion Room Error:",
            discussionError
          );

          setDiscussionRoom(null);

        } finally {

          setDiscussionLoading(false);

        }

      } catch (experienceError) {

        console.error(
          "Experience Error:",
          experienceError
        );

        setExperiences([]);

        setError(
          experienceError?.response?.data?.message ||
          "Unable to load interview experiences."
        );

      } finally {

        setLoading(false);

      }

    };


    if (companyId && roleId) {
      loadData();
    }

  }, [companyId, roleId]);


  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {

    return (

      <div className="role-details-page">

        <div className="role-loading">

          Loading interview experiences...

        </div>

      </div>

    );

  }


  /*
  ========================================
  ERROR
  ========================================
  */

  if (error) {

    return (

      <div className="role-details-page">

        <div className="role-error">

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <Link
            to={`/companies/${companyId}`}
            className="back-link"
          >
            ← Back to Company
          </Link>

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

    <div className="role-details-page">


      {/* =================================
          BACK
      ================================= */}

      <Link
        to={`/companies/${companyId}`}
        className="back-link"
      >
        ← Back to Company
      </Link>


      {/* =================================
          EXPERIENCES HEADER
      ================================= */}

      <div className="role-header">

        <h1>
          Interview Experiences
        </h1>

        <p>
          Browse interview experiences
          shared by students.
        </p>

      </div>


      {/* =================================
          EXPERIENCES
      ================================= */}

      {
        experiences.length === 0 ? (

          <div className="no-experience">

            <h2>
              No Experiences Found
            </h2>

            <p>
              No interview experience has
              been shared for this role yet.
            </p>

            <Link
              to="/experiences/create"
              className="share-experience-btn"
            >
              Share Your Experience →
            </Link>

          </div>

        ) : (

          <div className="experience-grid">

            {

              experiences.map((exp) => (

                <div
                  key={exp._id}
                  className="experience-card"
                >


                  {/* College */}

                  <h2 className="college-name">

                    {exp.college}

                  </h2>


                  {/* Result */}

                  <div className="info-row">

                    <span className="label">
                      Result
                    </span>

                    <span
                      className={`badge ${
                        exp.result
                          ?.toLowerCase()
                      }`}
                    >

                      {exp.result}

                    </span>

                  </div>


                  {/* Campus */}

                  {exp.campusType && (

                    <div className="info-row">

                      <span className="label">
                        Campus
                      </span>

                      <span>

                        {
                          exp.campusType ===
                          "ON_CAMPUS"
                            ? "On Campus"
                            : "Off Campus"
                        }

                      </span>

                    </div>

                  )}


                  {/* Interview Date */}

                  <div className="info-row">

                    <span className="label">
                      Interview Date
                    </span>

                    <span>

                      {exp.interviewDate
                        ? new Date(
                            exp.interviewDate
                          ).toLocaleDateString()
                        : "Not available"}

                    </span>

                  </div>


                  {/* Shared By */}

                  {exp.user?.name && (

                    <div className="info-row">

                      <span className="label">
                        Shared By
                      </span>

                      <span>
                        {exp.user.name}
                      </span>

                    </div>

                  )}


                  {/* View */}

                  <Link
                    to={`/experiences/${exp._id}`}
                    className="view-btn"
                  >

                    View Complete Experience →

                  </Link>


                </div>

              ))

            }

          </div>

        )
      }


      {/* =================================
          DISCUSSION ROOM
      ================================= */}

      <div className="discussion-section">

        <div className="discussion-content">


          <div className="discussion-text">

            <span className="discussion-label">
              LIVE DISCUSSION
            </span>


            <h2>
              Discuss This Role
            </h2>


            <p>

              Connect with students preparing
              for the same company and role.
              Ask questions, share preparation
              tips, and discuss interview
              experiences in real time.

            </p>


            {
              !discussionLoading &&
              discussionRoom && (

                <div className="discussion-meta">


                  <span>

                    👥{" "}

                    {
                      discussionRoom.participants
                        ?.length || 0
                    }

                    {" "}Members

                  </span>


                  <span>

                    💬{" "}

                    {
                      discussionRoom.totalMessages ||
                      0
                    }

                    {" "}Messages

                  </span>


                </div>

              )
            }

          </div>


          {/* =================================
              JOIN BUTTON
          ================================= */}

          {
            !discussionLoading &&
            discussionRoom && (

              <Link
                to={`/discussions/${discussionRoom._id}`}
                className="discussion-button"
              >

                Join Discussion →

              </Link>

            )
          }


          {/* =================================
              NO ROOM
          ================================= */}

          {
            !discussionLoading &&
            !discussionRoom && (

              <div className="discussion-unavailable">

                Discussion room is not available
                for this role yet.

              </div>

            )
          }


        </div>

      </div>


    </div>

  );

};


export default RoleDetails;