import "../../pages/user/Dashboard/Dashboard.css";

function DashboardStats({ data }) {
  const cards = [
    {
      title: "Experiences Posted",
      value: data?.experiencesPosted || 0,
    },
    {
      title: "Comments Added",
      value: data?.commentsAdded || 0,
    },
    {
      title: "Companies Covered",
      value: data?.companyTrends?.length || 0,
    },
    {
      title: "Live Discussions",
      value: data?.liveDiscussions?.length || 0,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div
          key={index}
          className="stat-card"
        >
          <h2>{card.value}</h2>

          <p>{card.title}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;