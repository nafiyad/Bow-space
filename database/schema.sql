-- Drop existing tables if they exist
IF OBJECT_ID('CourseRegistrations', 'U') IS NOT NULL DROP TABLE CourseRegistrations;
IF OBJECT_ID('Courses', 'U') IS NOT NULL DROP TABLE Courses;

-- Create Courses table with VARCHAR id
CREATE TABLE Courses (
    id VARCHAR(20) PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    term VARCHAR(10) NOT NULL CHECK (term IN ('Winter', 'Spring', 'Summer', 'Fall')),
    program VARCHAR(10) REFERENCES Programs(code),
    description TEXT,
    capacity INT DEFAULT 30,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Create CourseRegistrations table
CREATE TABLE CourseRegistrations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    studentId INT REFERENCES Users(id),
    courseId VARCHAR(20) REFERENCES Courses(id),
    status VARCHAR(20) DEFAULT 'Enrolled' CHECK (status IN ('Enrolled', 'Dropped', 'Completed')),
    grade VARCHAR(2),
    registrationDate DATETIME DEFAULT GETDATE(),
    UNIQUE (studentId, courseId)
);

-- Modify the course inserts to use IDENTITY for id
INSERT INTO Courses (code, name, term, program, description) VALUES
('DATA1201', 'Introduction to Relational Databases', 'Fall', 'SD-DIP', 'Fundamentals of relational database design and management'),
('DATA3401', 'Introduction to Data and Analytics', 'Summer', 'SD-CERT', 'Basic data analysis for certificate students'),
-- ... rest of the course inserts ... 