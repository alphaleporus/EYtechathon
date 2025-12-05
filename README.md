# 🏥 Healthcare Provider Data Validator

> **EY Techathon 6.0 - Challenge VI: Provider Data Validation Platform**

A comprehensive healthcare provider data management and validation platform built with React, Node.js, and Express. This
application helps healthcare organizations manage provider information, validate data quality, and maintain compliance
through detailed audit logging.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Login Credentials](#login-credentials)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [File Validation Format](#file-validation-format)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The Healthcare Provider Data Validator is a full-stack web application designed to streamline healthcare provider data
management. It offers real-time data validation, quality scoring, and comprehensive audit trails to ensure data
integrity and regulatory compliance.

### Key Capabilities:

- **Provider Management**: Add, edit, and manage healthcare provider profiles
- **Data Validation**: Upload CSV/XLSX files with automatic validation and error detection
- **Quality Metrics**: Track provider quality scores and performance metrics
- **Audit Logging**: Complete audit trail of all system activities
- **User Authentication**: Secure login and registration system
- **Dashboard Analytics**: Real-time metrics and data visualization

---

## ✨ Features

### 🔐 Authentication System

- User registration with validation
- Secure login with JWT tokens
- Session management
- Protected routes

### 📊 Dashboard

- Real-time provider statistics
- Quality score distribution charts
- Top specialties breakdown
- Performance trends

### 👥 Provider Management

- Complete CRUD operations
- Search and filter capabilities
- Quality score tracking
- Specialty categorization
- Pagination support

### 📁 Data Validation

- CSV/XLSX file upload
- Real-time validation
- Error detection and reporting
- Data correction suggestions
- Format validation (NPI, email, phone, etc.)

### 📝 Audit Logs

- Complete activity tracking
- User action logging
- Timestamp records
- Compliance reporting
- Filtered view options

---

## 🛠 Technology Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Figma Design** - UI/UX design implementation

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin support

### Development

- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **Git** - Version control

---

## 📁 Project Structure

```
EYtechathon/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Dashboard.tsx    # Dashboard with analytics
│   │   │   ├── Providers.tsx    # Provider list and management
│   │   │   ├── FileValidation.tsx # File upload and validation
│   │   │   ├── AuditLogs.tsx    # Audit trail viewer
│   │   │   ├── LoginPage.tsx    # User login
│   │   │   ├── RegisterPage.tsx # User registration
│   │   │   ├── LandingPage.tsx  # Landing page
│   │   │   ├── Layout.tsx       # Main layout with sidebar
│   │   │   └── ui/              # Reusable UI components
│   │   ├── utils/               # Utility functions
│   │   │   ├── api.ts           # API client configuration
│   │   │   └── auth.ts          # Authentication utilities
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   └── vite.config.ts           # Vite configuration
│
├── server/                      # Backend Node.js application
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── providers.js         # Provider CRUD routes
│   │   ├── validation.js        # File validation routes
│   │   └── audit.js             # Audit log routes
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── upload.js            # File upload handling
│   └── index.js                 # Server entry point
│
├── uploads/                     # Uploaded files directory
├── database.json                # JSON database (users & data)
├── sample_providers.csv         # Sample data file
├── package.json                 # Root dependencies
└── README.md                    # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0.0 or higher) - Comes with Node.js
- **Git** (optional) - [Download](https://git-scm.com/)
- **Modern web browser** (Chrome, Firefox, Edge, Safari)

### Verify Installation:

```bash
node --version    # Should output v16.0.0 or higher
npm --version     # Should output v7.0.0 or higher
```

---

## 🚀 Installation & Setup

### 1. Clone or Download the Repository

```bash
# If using Git
git clone <repository-url>
cd EYtechathon

# Or simply download and extract the ZIP file
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup

The application uses default configurations. No `.env` file is required for local development.

**Default Configuration:**

- Backend API: `http://localhost:5000`
- Frontend Dev Server: `http://localhost:3000`

---

## 🎮 Running the Application

### Method 1: Quick Start (Recommended)

Run both frontend and backend concurrently:

```bash
npm start
```

This will:

- Start the backend server on `http://localhost:5000`
- Start the frontend dev server on `http://localhost:3000`
- Automatically open the browser

### Method 2: Separate Terminals

**Terminal 1 - Backend:**

```bash
npm run server
```

**Terminal 2 - Frontend:**

```bash
npm run client
```

### Method 3: Individual Commands

**Backend only:**

```bash
cd server
node index.js
```

**Frontend only:**

```bash
cd client
npm run dev
```

---

## 🔑 Login Credentials

Use these credentials to access the application:

### Test User 1

- **Email:** `demo@test.com`
- **Password:** `demo123456`

### Test User 2

- **Email:** `test@test.com`
- **Password:** `test123`

### Register New Account

You can also create a new account using the registration page:

1. Click "Create Account" on the login page
2. Fill in your details (name, email, password)
3. Submit to create your account
4. You'll be automatically logged in

---

## 📖 Usage Guide

### 1. Landing Page

- Welcome screen with platform overview
- Click **"Get Started"** to proceed to login

### 2. Login / Registration

- **Login**: Enter credentials and click "Sign In"
- **Register**: Click "Create Account" and fill in the form
- **Forgot Password**: Click "Forgot password?" for reset options

### 3. Dashboard

After logging in, you'll see:

- **Total Providers**: Count of all registered providers
- **Active Providers**: Currently active provider count
- **Avg Quality Score**: Average quality across all providers
- **Validation Jobs**: Pending validation tasks
- **Quality Distribution Chart**: Visual breakdown of quality scores
- **Top Specialties**: Most common medical specialties

### 4. Provider Management

Navigate to **Providers** in the sidebar:

- **View All Providers**: Paginated table view
- **Search**: Filter by name, NPI, or email
- **Add Provider**: Click "Add Provider" button
- **Edit Provider**: Click edit icon on any provider row
- **Delete Provider**: Click delete icon (requires confirmation)

### 5. Data Validation

Navigate to **Data Validation** in the sidebar:

- **Upload File**: Drag & drop or click to select CSV/XLSX
- **View Results**: See validation summary with stats
- **Review Errors**: Check detailed error list with suggestions
- **Download Report**: Export validation results

### 6. Audit Logs

Navigate to **Audit Logs** in the sidebar:

- **View Activities**: See all system activities
- **Filter by Type**: CREATE, UPDATE, DELETE actions
- **User Tracking**: See who performed each action
- **Timestamp**: When each action occurred
- **Pagination**: Navigate through log history

### 7. Profile Menu

Click on your profile at the bottom of the sidebar:

- **User Info**: View your account details
- **Logout**: Sign out of the application

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # User login
GET    /api/auth/me              # Get current user
```

### Providers

```
GET    /api/providers            # Get all providers
GET    /api/providers/:id        # Get provider by ID
POST   /api/providers            # Create new provider
PUT    /api/providers/:id        # Update provider
DELETE /api/providers/:id        # Delete provider
```

### Validation

```
POST   /api/validation/upload    # Upload file for validation
GET    /api/validation/:id       # Get validation results
```

### Audit

```
GET    /api/audit/logs           # Get audit logs
GET    /api/audit/logs/:id       # Get specific log entry
```

---

## 📋 File Validation Format

### Supported File Types

- CSV (.csv)
- Excel (.xlsx)

### Required Columns

| Column | Format | Example |
|--------|--------|---------|
| **NPI** | 10 digits | `1234567890` |
| **Name** | String | `Dr. John Smith` |
| **Email** | user@domain.com | `john.smith@hospital.com` |
| **Phone** | (XXX) XXX-XXXX | `(555) 123-4567` |
| **Specialty** | String | `Cardiology` |
| **License State** | 2-letter code | `CA` |
| **Quality Score** | 0-100 | `87` |

### Validation Rules

1. **NPI Validation**
    - Must be exactly 10 digits
    - No letters or special characters
    - Example: `1234567890`

2. **Email Validation**
    - Must be valid email format
    - Must contain @ and domain
    - Example: `provider@hospital.com`

3. **Phone Validation**
    - Format: (XXX) XXX-XXXX
    - Example: `(555) 123-4567`

4. **State Code**
    - Must be 2-letter US state abbreviation
    - Example: `CA`, `NY`, `TX`

5. **Specialty**
    - Must match approved specialty list
    - Common: Cardiology, Internal Medicine, Pediatrics, etc.

6. **Quality Score**
    - Must be between 0-100
    - Numeric only

### Sample CSV Format

```csv
npi,name,email,phone,specialty,license_state,quality_score
1234567890,Dr. Sarah Johnson,sarah.j@hospital.com,(555) 123-4567,Cardiology,CA,92
2345678901,Dr. Michael Chen,michael.c@clinic.com,(555) 234-5678,Internal Medicine,NY,88
3456789012,Dr. Emily Davis,emily.d@healthcare.com,(555) 345-6789,Pediatrics,TX,95
```

---

## 🎨 Screenshots

### Landing Page

Beautiful landing page with platform overview and call-to-action.

### Dashboard

Real-time analytics with provider statistics, quality distribution charts, and top specialties.

### Provider Management

Complete provider list with search, filtering, and CRUD operations.

### Data Validation

File upload interface with real-time validation and error reporting.

### Audit Logs

Comprehensive activity tracking with user actions and timestamps.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues

1. Check existing issues first
2. Create detailed bug reports
3. Include screenshots if applicable
4. Provide steps to reproduce

### Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test all features before submitting

---

## 📄 License

This project is part of the EY Techathon 6.0 competition.

---

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**

```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

**2. Module Not Found Error**

```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

**3. Database Issues**
If the database.json gets corrupted, restore from backup or reset:

```bash
# Backup exists at database.json.backup
cp database.json.backup database.json
```

**4. Login Issues**

- Clear browser cache and localStorage
- Press F12 → Application → Storage → Clear Site Data
- Refresh the page

**5. File Upload Fails**

- Check uploads/ directory exists
- Verify file format (CSV or XLSX)
- Check file size (max 10MB)

---

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing documentation
3. Contact the development team

---

## 🎯 Future Enhancements

- [ ] Advanced analytics and reporting
- [ ] Export functionality for providers
- [ ] Email notifications
- [ ] Multi-factor authentication
- [ ] Role-based access control
- [ ] Dark mode support
- [ ] Mobile responsive improvements
- [ ] Real-time collaboration features
- [ ] Integration with external healthcare APIs
- [ ] Automated backup system

---

## 👥 Team

**EY Techathon 6.0 - Challenge VI Team**

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Built with ❤️ for EY Techathon 6.0**

Last Updated: December 2024
Version: 1.0.0
