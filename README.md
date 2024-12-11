# Bow Course Registration System

A web-based course registration system for Bow Valley College built with React, Node.js, and SQL Server.

## Prerequisites

- Node.js 
- SQL Server 
- npm or yarn package manager

## Database Setup

You have two options to set up the database:

### Option 1: Using the SQL Script

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Open the `database/schema.sql` file
4. Execute the script to:
   - Create the database
   - Create all required tables
   - Insert initial data including:
     - Programs (SD-DIP, SD-CERT, SD-PD)
     - Admin user (username: admin, password: admin123)
     - Sample courses
     - Sample data

### Option 2: Using the Backup File

1. Copy the `BowCourseRegistration.bak` file to your SQL Server backup directory
   - Default location: `C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\Backup`
2. Open SQL Server Management Studio
3. Right-click on "Databases"
4. Select "Restore Database"
5. Choose "Device" and select the .bak file
6. Click OK to restore the database

## Application Setup

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the backend directory with:
```env
PORT=5000
DB_SERVER=your_server_name
DB_NAME=BowCourseRegistration
DB_USER=your_username
DB_PASSWORD=your_password
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

4. Start the backend server:
```
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the frontend directory with:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend application:
```bash
npm start
```

## User Accounts

### Admin Account
- Username: admin
- Password: admin123
- or you can create your admin account 
- Can manage courses, programs, and view all registrations

### Student Registration
Students can register through the registration page with:
- Basic information (name, email, username)
- Program selection (SD-DIP, SD-CERT, or SD-PD)
- Contact details
- Password (minimum 6 characters)

## Features

### Admin Features
- Course Management (Add, Edit, Delete)
- View Student Registrations
- Program Management
- Message System
- View Reports

### Student Features
- Course Registration
- View Available Courses
- Track Registration Status
- Message System
- Profile Management

## Database Schema

### Main Tables
1. Users
   - Student and admin accounts
   - Authentication details

2. Programs
   - Available programs
   - Program details and requirements

3. Courses
   - Course information
   - Capacity and scheduling

4. StudentDetails
   - Additional student information
   - Program enrollment

5. CourseRegistrations
   - Course enrollment records
   - Registration status

6. Messages
   - Internal messaging system
   - Communication records

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register/student` - Student registration
- POST `/api/auth/register/admin` - Admin registration

### Courses
- GET `/api/courses` - List all courses
- POST `/api/courses` - Add new course (Admin)
- PUT `/api/courses/:id` - Update course (Admin)
- DELETE `/api/courses/:id` - Delete course (Admin)

### Registrations
- POST `/api/registrations` - Register for course
- GET `/api/registrations/student/:id` - Get student registrations
- PUT `/api/registrations/:id` - Update registration status

### Programs
- GET `/api/programs` - List all programs
- GET `/api/programs/:code` - Get program details

## Security Features

- Password Hashing (bcrypt)
- JWT Authentication
- Input Validation
- SQL Injection Prevention
- CORS Protection
- Role-Based Access Control

## Troubleshooting

### Common Issues

1. Database Connection
   - Verify SQL Server credentials
   - Check server name and port
   - Ensure SQL Server is running

2. Backend Issues
   - Check .env configuration
   - Verify port availability
   - Check logs for errors

3. Frontend Issues
   - Verify API URL in .env
   - Check console for errors
   - Clear browser cache if needed

## Contributors

- Nafiyad Adane 
- Juan Gonzalez Mellizo
- Nkemsinachi Ejinkeonye
- Nissi Daramola


## Acknowledgments

- Bow Valley College
- Hugo Vinicius Zeminian Bueno Camargo

