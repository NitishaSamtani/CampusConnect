# CampusConnect

# 🎓 CampusConnect

### A Smart Campus Platform for Students, Faculty & Placements

CampusConnect is a full-stack web platform designed to create a centralized digital ecosystem for students, faculty, and placement-related activities. It brings together placement experiences, interview preparation, discussions, notifications, bookmarks, and user profiles into a single platform.

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration and login
* Google OAuth authentication
* JWT-based authentication using HTTP-only cookies
* Protected routes
* Role-based access control for **Users and Admins**
* Secure password hashing with bcrypt

### 📊 Personalized Dashboard

* Personalized user dashboard
* Recently viewed and saved content
* **Continue Where You Left Off** activity
* Notifications for relevant updates
* Quick access to companies, roles, experiences, and discussions

### 🏢 Company & Role Exploration

* Browse companies and available roles
* View company-specific placement experiences
* Explore role-specific interview experiences
* Experience counts for companies
* Search and filter opportunities

### 💼 Placement Experiences

Users can share and explore real placement experiences, including:

* Company and role details
* College information
* Selection result:

  * Selected
  * Rejected
  * Waitlisted
* Interview date
* Interview rounds
* Round-wise questions

Supported interview rounds include:

* Online Assessment (OA)
* Technical Round
* HR Round

Questions can be categorized by:

* Aptitude
* Coding
* Technical
* HR

Difficulty levels:

* Easy
* Medium
* Hard

### 💬 Real-Time Discussion Rooms

* Company and role-specific discussion rooms
* Real-time messaging using Socket.IO
* Join and leave room events
* Typing indicators
* Online user presence
* Discussion around interview experiences and preparation
* Comments, replies, and interactions

### 🔔 Notifications

* User-specific notifications
* Real-time notification delivery
* Private Socket.IO user rooms
* Notifications for relevant platform activity

### 🔖 Bookmarks

* Save useful experiences and content
* Access bookmarked content from the dashboard
* Quickly return to previously saved resources

### 👤 User Profiles

* Personalized user profiles
* Academic and activity information
* User-specific experiences and interactions

### 🔎 Search & Filtering

Search and filter placement content using criteria such as:

* Company
* Role
* Difficulty
* Year
* College
* Tags

### 👍 Community Interaction

* Upvote experiences
* Comment on experiences
* Reply to comments
* Share useful experiences
* Report inappropriate content

### 🛠️ Admin Panel

Administrators can manage and moderate platform content, including:

* Users
* Companies
* Roles
* Experiences
* Discussions
* Reports
* Platform analytics

---

### Architecture Flow

```text
┌─────────────────────┐
│   React Frontend    │
│                     │
│ UI • Dashboard      │
│ Forms • Search      │
│ API Calls • Routing │
└──────────┬──────────┘
           │
           │ HTTPS / REST API
           ▼
┌─────────────────────┐
│ Node.js + Express   │
│                     │
│ API Routes          │
│ Business Logic      │
│ Validation          │
│ JWT Authentication  │
│ Socket.IO           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ MongoDB + Mongoose  │
│                     │
│ Users               │
│ Companies           │
│ Roles               │
│ Experiences         │
│ Questions           │
│ Discussions         │
│ Notifications       │
└─────────────────────┘
           │
           ├──────────────► Cloudinary
           │                File/Image Storage
           │
           └──────────────► Socket.IO
                            Real-Time Communication
```

### How It Works

1. The **React frontend** provides the user interface and communicates with the backend through REST APIs.
2. The **Node.js/Express backend** handles authentication, validation, business logic, and API requests.
3. **JWT authentication** securely manages user sessions using HTTP-only cookies.
4. **MongoDB** stores users, companies, roles, placement experiences, questions, discussions, bookmarks, and notifications.
5. **Socket.IO** enables real-time communication for discussion rooms, typing indicators, online users, and notifications.
6. **Cloudinary** is used for cloud-based file and image storage.
7. Protected backend routes ensure that users can only access resources permitted by their role and authentication status.

---

## 🔒 Security

CampusConnect implements several security mechanisms:

* JWT-based authentication
* HTTP-only cookies
* Password hashing with bcrypt
* Protected API routes
* Role-based authorization
* Input validation
* User-specific Socket.IO rooms
* Access control for administrative functionality

---

## 🌟 Key Highlights

* Full-stack **MERN** application
* Real-time communication using **Socket.IO**
* Secure authentication with **JWT**
* Role-based access control
* Placement experience management
* Company and role-based exploration
* Interactive interview preparation
* Real-time discussion rooms
* Personalized dashboards and notifications
* Cloud-based media storage
* Admin moderation and management

---

## 📌 Future Enhancements

* Advanced recommendation system for relevant placement experiences
* AI-powered interview preparation
* Resume analysis and suggestions
* More detailed placement analytics
* Enhanced notification preferences
* Mobile application support

---
CampusConnect — Connecting students, experiences, and opportunities.
