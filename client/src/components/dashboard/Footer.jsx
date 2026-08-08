import "../../pages/user/Dashboard/Dashboard.css";

function Footer() {
  return (
    <footer className="dashboard-footer">

      <div>

        <h2>
          CampusConnect
        </h2>

        <p>
          Helping students
          crack placements
          smarter.
        </p>

      </div>

      <div className="footer-links">

        <a href="/dashboard">
          Dashboard
        </a>

        <a href="/companies">
          Companies
        </a>

        <a href="/experiences">
          Experiences
        </a>

      </div>

      <div className="copyright">

        © 2026
        CampusConnect

      </div>

    </footer>
  );
}

export default Footer;