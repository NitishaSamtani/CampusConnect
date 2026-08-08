import { useEffect, useState } from "react";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import ResultChart from "../../../components/dashboard/ResultChart";
import TrendChart from "../../../components/dashboard/TrendChart";
import TrendingCompanies from "../../../components/dashboard/TrendingCompanies";
import Footer from "../../../components/dashboard/Footer";

import { getDashboard } from "../../../services/dashboardService";

import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const response =
          await getDashboard();

        setDashboardData(
          response.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-loading">
        Failed To Load Dashboard
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <DashboardHeader />

      <DashboardStats
        data={dashboardData}
      />

      <div className="dashboard-chart-grid">

        <ResultChart
          data={
            dashboardData.resultAnalytics
          }
        />

        <TrendChart
          data={
            dashboardData.companyTrends
          }
        />

      </div>

      <TrendingCompanies
        companies={
          dashboardData.companyTrends
        }
      />

      <Footer />

    </div>
  );
}

export default Dashboard;