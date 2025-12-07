# 🏥 Clarity - Healthcare Provider Data Validation

<div align="center">
  <img src="Media/logo.png" alt="Clarity Logo" width="300" >

> **EY Techathon 6.0 - Challenge VI: Provider Data Validation Platform**
</div>

<br/>

A comprehensive full-stack healthcare provider data management and validation platform built with React, TypeScript,
Node.js, and Express. Clarity streamlines provider data management, validates data quality, and maintains
regulatory compliance through detailed audit logging.

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Login Credentials](#login-credentials)
- [Project Structure](#project-structure)
- [Branding & Assets](#branding--assets)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [File Validation Format](#file-validation-format)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

Clarity is a modern, full-stack web application designed to streamline healthcare
provider data management operations. Built with a focus on data integrity, regulatory compliance, and user experience,
it offers real-time validation, comprehensive analytics, and complete audit trails.

<div align="center">
  <img src="Media/Clarity - Healthcare Provider Data Validation _ EY Techathon 6_0.jpeg" alt="Clarity Dashboard Preview" width="800">
  <p><i>Clarity Analytics Dashboard - Real-time insights and data visualization</i></p>
</div>

### Key Highlights:

- 🔐 **Secure Authentication** with JWT tokens
- 📊 **Real-time Analytics** dashboard with visual metrics
- 👥 **Provider Management** with CRUD operations
- 📁 **Data Validation** for CSV/XLSX files
- 📝 **Complete Audit Trails** for compliance
- 🎨 **Modern UI** with custom branding and polished design
- ⚡ **Fast & Responsive** React + Vite architecture
- 🖼️ **Professional Branding** with custom logo and assets

---

## ✨ Features

### 🔐 Authentication & Security

- User registration with email validation
- Secure login with JWT token-based authentication
- Protected routes and session management
- Logout with confirmation dialog
- Password encryption with bcrypt

### 📊 Dashboard Analytics

- **Provider Statistics**: Total, active, and quality metrics
- **Quality Distribution Charts**: Visual breakdown by score ranges
- **Top Specialties**: Most common medical specialties
- **Trend Analysis**: Performance metrics over time
- **Real-time Updates**: Live data synchronization

### 👥 Provider Management

- **Complete CRUD Operations**: Create, Read, Update, Delete
- **Advanced Search**: Filter by name, NPI, email
- **Quality Scoring**: Track provider quality metrics
- **Specialty Tracking**: Categorize by medical specialty
- **Pagination Support**: Efficient data navigation
- **Bulk Actions**: Manage multiple providers

### 📁 Data Validation

- **File Upload**: Drag & drop or click to select
- **Format Support**: CSV and XLSX files (max 10MB)
- **Real-time Validation**: Instant error detection
- **Error Reporting**: Detailed validation messages
- **Smart Suggestions**: Automatic correction recommendations
- **Format Validation**: NPI, email, phone, state codes

### 📝 Audit Logs

- **Activity Tracking**: Complete user action history
- **User Attribution**: Track who made changes
- **Timestamps**: Precise activity timing
- **Action Types**: CREATE, UPDATE, DELETE operations
- **Compliance Ready**: 7-year data retention
- **Searchable History**: Filter and find activities

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.6.2 | Type Safety |
| Vite | 6.3.5 | Build Tool & Dev Server |
| Tailwind CSS | 3.4.17 | Styling Framework |
| Lucide React | 0.468.0 | Icon Library |
| Axios | 1.7.9 | HTTP Client |
| Radix UI | Latest | UI Components |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | >=16.0.0 | Runtime Environment |
| Express.js | 4.21.2 | Web Framework |
| JWT | 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password Hashing |
| Multer | 1.4.5-lts.1 | File Upload |
| CORS | 2.8.5 | Cross-Origin Support |

### Development Tools

- **Nodemon** - Auto-restart server during development
- **Concurrently** - Run multiple commands simultaneously
- **ESLint** - Code quality and consistency
- **Git** - Version control

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0.0 or higher) - Comes with Node.js
- **Git** (optional, for cloning) - [Download](https://git-scm.com/)

### Verify Installation:

```bash
node --version    # Should output v16.0.0 or higher
npm --version     # Should output v7.0.0 or higher
```

### System Requirements:

- **OS**: Windows 10/11, macOS 10.14+, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 500MB free space
- **Browser**: Chrome, Firefox, Edge, or Safari (latest versions)

---

## 🚀 Installation

### Step 1: Clone or Download

```bash
# Option A: Clone with Git
git clone <repository-url>
cd EYtechathon

# Option B: Download ZIP
# Extract the ZIP file and navigate to the folder
cd EYtechathon
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

> **Note**: This will install all required packages for both frontend and backend. The installation may take 2-3 minutes
> depending on your internet connection.

---

## 🎮 Running the Application

### Quick Start (Recommended)

Run both frontend and backend simultaneously:

```bash
npm start
```

This command will:

- ✅ Start backend server on `http://localhost:5000`
- ✅ Start frontend dev server on `http://localhost:3000`
- ✅ Automatically open your browser

### Alternative Methods

**Option 1: Separate Terminals**

Terminal 1 - Backend:

```bash
npm run server
```

Terminal 2 - Frontend:

```bash
npm run client
```

**Option 2: Individual Commands**

Backend only:

```bash
cd server
node index.js
```

Frontend only:

```bash
cd client
npm run dev
```

### Verify Installation

Once running, you should see:

```
✅ Backend API: http://localhost:5000
✅ Frontend: http://localhost:3000
```

---

## 🔑 Login Credentials

### Pre-configured Test Accounts

**Account 1 (Primary)**

```
Email: demo@test.com
Password: demo123456
```

**Account 2 (Alternative)**

```
Email: test@test.com
Password: test123
```

### Create New Account

1. Navigate to the application
2. Click **"Create Account"** on login page
3. Fill in your details:
    - Full Name
    - Email Address
    - Password (minimum 6 characters)
4. Submit to create your account
5. You'll be automatically logged in

---

## 📁 Project Structure

```
EYtechathon/
│
├── client/                          # Frontend React Application
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── Dashboard.tsx        # Analytics dashboard
│   │   │   ├── Providers.tsx        # Provider management
│   │   │   ├── FileValidation.tsx   # File upload & validation
│   │   │   ├── AuditLogs.tsx        # Activity tracking
│   │   │   ├── LoginPage.tsx        # User login
│   │   │   ├── RegisterPage.tsx     # User registration
│   │   │   ├── LandingPage.tsx      # Welcome page
│   │   │   ├── Layout.tsx           # Main layout wrapper
│   │   │   ├── AddProviderModal.tsx # Add provider dialog
│   │   │   ├── EmptyState.tsx       # Empty state component
│   │   │   └── ui/                  # Reusable UI components
│   │   │       ├── button.tsx       # Button component
│   │   │       ├── badge.tsx        # Badge component
│   │   │       ├── card.tsx         # Card component
│   │   │       ├── input.tsx        # Input component
│   │   │       └── utils.ts         # UI utilities
│   │   │
│   │   ├── utils/                   # Utility Functions
│   │   │   ├── api.ts               # API client & interceptors
│   │   │   └── auth.ts              # Authentication helpers
│   │   │
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # Application entry point
│   │   └── index.css                # Global styles
│   │
│   ├── public/                      # Static assets
│   │   ├── logo.png                 # Clarity logo
│   │   ├── favicon.ico              # Browser favicon
│   │   └── dashboard-preview.png    # Dashboard preview image
│   ├── package.json                 # Frontend dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vite.config.ts               # Vite configuration
│   └── tailwind.config.js           # Tailwind CSS configuration
│
├── server/                          # Backend Node.js Application
│   ├── routes/
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── providers.js             # Provider CRUD endpoints
│   │   ├── validation.js            # File validation endpoints
│   │   └── audit.js                 # Audit log endpoints
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── upload.js                # File upload handling
│   │
│   └── index.js                     # Server entry point
│
├── Media/                           # Brand assets
│   ├── logo.png                     # Clarity logo source
│   ├── favicon.ico                  # Favicon source
│   └── dashboard-preview.png        # Dashboard screenshot
│
├── uploads/                         # Uploaded files storage
├── database.json                    # JSON database (users & data)
├── sample_providers.csv             # Sample data file
├── package.json                     # Root dependencies & scripts
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

---

## 🎨 Branding & Assets

### Logo & Identity

**Clarity** features professional branding with a custom logo that includes:

- **Magnifying glass with healthcare cross**: Symbolizing data validation and healthcare focus
- **Modern design**: Clean, rounded corners matching the UI aesthetic
- **Consistent sizing**: Optimized for different display contexts
   - Landing Page: 80px height
   - Dashboard Sidebar: 120px height
   - Login/Register Pages: 96px height

### Visual Assets

All brand assets are located in the `Media/` directory and deployed to `client/public/`:

| Asset                   | Location                 | Purpose                    | Size  |
|-------------------------|--------------------------|----------------------------|-------|
| `logo.png`              | `/logo.png`              | Main logo across all pages | 4.1MB |
| `favicon.ico`           | `/favicon.ico`           | Browser tab icon           | 15KB  |
| `dashboard-preview.png` | `/dashboard-preview.png` | Landing page showcase      | 282KB |

### Design System

- **Primary Color**: `#1976D2` (Blue)
- **Secondary Color**: `#0d47a1` (Dark Blue)
- **Success**: `#43A047` (Green)
- **Warning**: `#FB8C00` (Orange)
- **Error**: `#E53935` (Red)
- **Border Radius**: `rounded-xl` (12px) for consistent UI elements
- **Shadows**: Layered shadows for depth and modern feel

---

## 📖 Usage Guide

### 1. Landing Page

The welcome screen showcases Clarity with:

- **Custom Branding**: Clarity logo prominently displayed
- **Feature Overview**: Key platform capabilities highlighted
- **Live Dashboard Preview**: Actual screenshot of the analytics dashboard
- **Call-to-Action**: Get Started button to proceed to login
- **Statistics**: Key metrics (10K+ providers, 99.8% accuracy, 24/7 uptime, 100% HIPAA compliant)

### 2. Authentication

**Login:**

1. Enter your email and password
2. Click **"Sign In"**
3. You'll be redirected to the dashboard

**Register:**

1. Click **"Create Account"** on login page
2. Fill in the registration form
3. Submit to create your account
4. Automatic login after registration

**Logout:**

1. Click on your profile at the bottom of sidebar
2. Confirmation dialog will appear
3. Click **"Yes, Logout"** to confirm

### 3. Dashboard

Upon login, you'll see comprehensive analytics:

**Key Metrics:**

- **Total Providers**: All registered providers
- **Active Providers**: Currently active count
- **Avg Quality Score**: Average across all providers
- **Validation Jobs**: Pending validation tasks

**Visualizations:**

- Quality distribution bar chart
- Top specialties ranking
- Growth trends

### 4. Provider Management

Navigate to **Providers** in the sidebar:

**View Providers:**

- Paginated table with all provider data
- Sortable columns
- 10 providers per page

**Search:**

- Type in search box to filter
- Search by name, NPI, or email
- Results update in real-time

**Add Provider:**

1. Click **"Add Provider"** button
2. Fill in the form:
    - Name, NPI, Specialty
    - Email, Phone, License State
    - Quality Score
3. Click **"Save"** to add

**Edit Provider:**

- Click edit icon (pencil) on any row
- Modify details
- Save changes

**Delete Provider:**

- Click delete icon (trash) on any row
- Confirm deletion
- Provider removed from system

### 5. Data Validation

Navigate to **Data Validation**:

**Upload File:**

1. Drag & drop file onto upload area, OR
2. Click **"Select File"** button
3. Choose CSV or XLSX file (max 10MB)

**View Results:**

- Total records processed
- Valid records count
- Invalid records count
- Warnings count

**Review Errors:**

- Detailed error list with row numbers
- Current vs. suggested values
- Error type indicators (Error/Warning)

**Validation Rules:**

- NPI: 10 digits
- Email: valid format
- Phone: (XXX) XXX-XXXX
- State: 2-letter code
- Specialty: approved list

### 6. Audit Logs

Navigate to **Audit Logs**:

**View Activities:**

- Chronological activity list
- Color-coded action types
- User attribution
- Timestamp information

**Action Types:**

- **CREATE** (Green): New records added
- **UPDATE** (Blue): Records modified
- **DELETE** (Red): Records removed

**Information Displayed:**

- Action performed
- Entity affected (provider, validation)
- User who performed action
- Date and time
- Detailed description

**Pagination:**

- Navigate through log history
- 8 logs per page
- Previous/Next buttons

---

## 🔌 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Provider Endpoints

#### Get All Providers

```http
GET /api/providers
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "Dr. Sarah Johnson",
    "npi": "1234567890",
    "specialty": "Cardiology",
    "email": "sarah@hospital.com",
    "qualityScore": 92
  }
]
```

#### Create Provider

```http
POST /api/providers
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Dr. Sarah Johnson",
  "npi": "1234567890",
  "specialty": "Cardiology",
  "email": "sarah@hospital.com",
  "phone": "(555) 123-4567",
  "licenseState": "CA",
  "qualityScore": 92
}

Response: 201 Created
```

#### Update Provider

```http
PUT /api/providers/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "qualityScore": 95
}

Response: 200 OK
```

#### Delete Provider

```http
DELETE /api/providers/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

### Validation Endpoints

#### Upload File

```http
POST /api/validation/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [CSV or XLSX file]

Response: 200 OK
{
  "totalRecords": 50,
  "validRecords": 42,
  "invalidRecords": 5,
  "warnings": 3,
  "errors": [...]
}
```

### Audit Log Endpoints

#### Get Audit Logs

```http
GET /api/audit/logs
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "uuid",
    "action": "CREATE",
    "entity": "provider",
    "user": "John Smith",
    "timestamp": "2024-12-06T10:30:00Z",
    "details": "Created new provider..."
  }
]
```

---

## 📋 File Validation Format

### Supported File Types

- **CSV** (.csv)
- **Excel** (.xlsx)
- **Maximum Size**: 10MB

### Required Columns

| Column | Format | Example | Validation |
|--------|--------|---------|------------|
| **npi** | 10 digits | `1234567890` | Must be exactly 10 numeric digits |
| **name** | Text | `Dr. John Smith` | Required, alphanumeric with spaces |
| **email** | Email format | `john@hospital.com` | Valid email with @ and domain |
| **phone** | (XXX) XXX-XXXX | `(555) 123-4567` | US phone format with parentheses |
| **specialty** | Text | `Cardiology` | Must match approved specialty list |
| **license_state** | 2 letters | `CA` | Valid US state abbreviation |
| **quality_score** | 0-100 | `87` | Numeric value between 0 and 100 |

### Approved Specialties

- Cardiology
- Internal Medicine
- Pediatrics
- Orthopedics
- Dermatology
- Neurology
- Oncology
- Psychiatry
- Radiology
- Anesthesiology

### Sample CSV Format

```csv
npi,name,email,phone,specialty,license_state,quality_score
1234567890,Dr. Sarah Johnson,sarah.j@hospital.com,(555) 123-4567,Cardiology,CA,92
2345678901,Dr. Michael Chen,michael.c@clinic.com,(555) 234-5678,Internal Medicine,NY,88
3456789012,Dr. Emily Davis,emily.d@healthcare.com,(555) 345-6789,Pediatrics,TX,95
```

### Validation Error Types

**Errors (Must Fix):**

- Invalid NPI format
- Invalid email format
- Specialty not in approved list
- Invalid state code

**Warnings (Should Fix):**

- Phone number format inconsistency
- Missing optional fields
- Quality score out of typical range

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Port Already in Use

**Problem**: Error message "Port 5000/3000 already in use"

**Solution**:

```bash
# Windows
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### 2. Module Not Found

**Problem**: "Cannot find module" error

**Solution**:

```bash
# Delete node_modules and reinstall
rm -rf node_modules client/node_modules package-lock.json client/package-lock.json

# Reinstall dependencies
npm install
cd client && npm install
```

#### 3. Database Errors

**Problem**: Cannot read from database.json

**Solution**:

```bash
# Check if file exists
ls -la database.json

# If corrupted, reset database
# (This will lose existing data)
echo '{"users": [], "providers": []}' > database.json
```

#### 4. Login Issues

**Problem**: "Invalid credentials" even with correct password

**Solution**:

1. Clear browser cache and localStorage
    - Press F12 → Application → Storage
    - Click "Clear Site Data"
2. Refresh the page
3. Try logging in again

#### 5. File Upload Fails

**Problem**: File upload doesn't work

**Solution**:

1. Check file size (max 10MB)
2. Verify file format (CSV or XLSX only)
3. Ensure `uploads/` directory exists:
   ```bash
   mkdir uploads
   ```

#### 6. Build Errors

**Problem**: Frontend build fails

**Solution**:

```bash
cd client

# Clear cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

#### 7. Backend Won't Start

**Problem**: Server crashes on startup

**Solution**:

1. Check Node.js version:
   ```bash
   node --version  # Should be >=16.0.0
   ```
2. Check for syntax errors:
   ```bash
   node --check server/index.js
   ```
3. View detailed errors:
   ```bash
   npm run server:dev
   ```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues

1. Check [existing issues](../../issues) first
2. Create detailed bug report including:
    - Steps to reproduce
    - Expected behavior
    - Actual behavior
    - Screenshots (if applicable)
    - System information

### Submitting Changes

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test thoroughly
5. Commit with clear messages:
   ```bash
   git commit -m "Add: Feature description"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Submit a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test all changes before submitting
- Keep commits atomic and focused

---

## 📄 License

This project is part of the EY Techathon 6.0 competition.

---

## 🙏 Acknowledgments

- **EY Techathon 6.0** for the challenge opportunity
- **React Team** for the amazing framework
- **Vite Team** for the blazing-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set

---

## 📞 Support

For support and questions:

- 📧 Email: gaurav15042004@gmail.com
- 🐛 Issues: [GitHub Issues](../../issues)

---

## 🎯 Future Roadmap

- [ ] Advanced analytics and reporting dashboard
- [ ] Export functionality (PDF, Excel)
- [ ] Email notifications for validation results
- [ ] Multi-factor authentication
- [ ] Role-based access control (Admin, User, Viewer)
- [ ] Dark mode support
- [ ] Mobile-responsive improvements
- [ ] Real-time collaboration features
- [ ] Integration with external healthcare APIs
- [ ] Automated backup system
- [ ] Advanced search with filters
- [ ] Batch operations for providers
- [ ] Custom validation rules
- [ ] API rate limiting
- [ ] Performance monitoring

---

<div align="center">

**Built with ❤️ for EY Techathon 6.0**

![Healthcare](https://img.shields.io/badge/Healthcare-Data%20Validation-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

**Last Updated**: December 2024 | **Version**: 1.0.0

[⬆ Back to Top](#-clarity---healthcare-provider-data-validation)

</div>
