const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");

const app = express();

const profileRoutes = require("./modules/profile/profile.routes");

const userRoutes = require("./modules/users/user.routes");

const companyRoutes = require("./modules/companies/company.routes");

const roleRoutes = require("./modules/roles/role.routes");

const experienceRoutes = require("./modules/experiences/experience.routes");

const commentRoutes = require("./modules/comments/comment.routes");

const dashboardRoutes = require("./modules/dashboard/dashboard.routes" );

const discussionRoutes = require("./modules/discussions/discussion.routes");

const notificationRoutes = require("./modules/notifications/notification.routes");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

const adminRoutes = require("./modules/admin/admin.routes");

app.use("/api/admin", adminRoutes);

app.use("/api/profile",profileRoutes);

app.use("/api/users", userRoutes);



app.use("/api/companies",companyRoutes);

app.use("/api/roles", roleRoutes);

app.use("/api/experiences",experienceRoutes);

app.use("/api/comments",commentRoutes);

app.use("/api/dashboard",dashboardRoutes);

app.use("/api/discussions", discussionRoutes);

app.use("/api/notifications",notificationRoutes);

module.exports = app;