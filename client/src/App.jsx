import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Profile from "./pages/user/Profile/Profile";

import Dashboard from "./pages/user/Dashboard/Dashboard";

import Companies from "./pages/user/Companies/Companies";
import CompanyDetails from "./pages/user/Companies/CompanyDetails";

import RoleDetails from "./pages/user/Roles/RoleDetails";

import CreateExperience from "./pages/user/Experiences/CreateExperience";
import ExperienceFeed from "./pages/user/Experiences/ExperienceFeed";
import ExperienceDetails from "./pages/user/Experiences/ExperienceDetails";

import DiscussionRooms from "./pages/user/Discussions/DiscussionRooms";
import DiscussionRoom from "./pages/user/Discussions/DiscussionRoom";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          {/* ================================
              Default
          ================================= */}

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />


          {/* ================================
              Authentication
          ================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

            <Route
  path="/profile"
  element={<Profile />}
/>

          {/* ================================
              Dashboard
          ================================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* ================================
              Companies
          ================================= */}

          <Route
            path="/companies"
            element={<Companies />}
          />

          <Route
            path="/companies/:id"
            element={<CompanyDetails />}
          />


          {/* ================================
              Role Details
          ================================= */}

          <Route
            path="/companies/:companyId/roles/:roleId"
            element={<RoleDetails />}
          />


          {/* ================================
              Interview Experiences
          ================================= */}

          <Route
            path="/experiences"
            element={<ExperienceFeed />}
          />

          <Route
            path="/experiences/create"
            element={<CreateExperience />}
          />

          <Route
            path="/experiences/:id"
            element={<ExperienceDetails />}
          />


          {/* ================================
              Discussion Rooms
          ================================= */}

          <Route
            path="/discussions"
            element={<DiscussionRooms />}
          />

          <Route
            path="/discussions/:roomId"
            element={<DiscussionRoom />}
          />


          {/* ================================
              404
          ================================= */}

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;