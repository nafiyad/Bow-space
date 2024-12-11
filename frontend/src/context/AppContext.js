import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // State for courses
  const [courses, setCourses] = useState([
    // Diploma Courses
    { id: 'SODV1101', code: 'SODV1101', name: 'Programming Fundamentals', term: 'Winter', program: 'SD-DIP', description: 'Introduction to programming concepts and practices.' },
    { id: 'TECH1101', code: 'TECH1101', name: 'Web and Internet Fundamentals', term: 'Winter', program: 'SD-DIP', description: 'Basic concepts of web technologies and internet protocols.' },
    { id: 'TECH1102', code: 'TECH1102', name: 'Internet of Things', term: 'Winter', program: 'SD-DIP', description: 'Introduction to IoT technologies and applications.' },
    { id: 'MGMT1103', code: 'MGMT1103', name: 'Essential Skills for Teams Collaboration', term: 'Winter', program: 'SD-DIP', description: 'Developing skills for effective team collaboration.' },
    { id: 'MATH1901', code: 'MATH1901', name: 'Math for the Computer Industry', term: 'Winter', program: 'SD-DIP', description: 'Mathematical concepts relevant to computer science.' },
    { id: 'DATA1201', code: 'DATA1201', name: 'Introduction to Relational Databases', term: 'Fall', program: 'SD-DIP', description: 'Fundamentals of relational database design and management.' },
    { id: 'DESN2301', code: 'DESN2301', name: 'User Experience Design', term: 'Fall', program: 'SD-DIP', description: 'Principles and practices of user experience design.' },
    { id: 'SODV1201', code: 'SODV1201', name: 'Introduction to Web Programming', term: 'Fall', program: 'SD-DIP', description: 'Basics of web programming technologies.' },
    { id: 'SODV1202', code: 'SODV1202', name: 'Introduction to Object Oriented Programming', term: 'Fall', program: 'SD-DIP', description: 'Fundamentals of object-oriented programming paradigm.' },
    { id: 'TECH1201', code: 'TECH1201', name: 'Networking Essentials', term: 'Fall', program: 'SD-DIP', description: 'Basic concepts of computer networking.' },
    { id: 'DATA2201', code: 'DATA2201', name: 'Relational Databases', term: 'Summer', program: 'SD-DIP', description: 'Advanced topics in relational database management.' },
    { id: 'MGMT1104', code: 'MGMT1104', name: 'Project Management in Software Development', term: 'Summer', program: 'SD-DIP', description: 'Project management principles applied to software development.' },
    { id: 'SODV2101', code: 'SODV2101', name: 'Rapid Application Development', term: 'Summer', program: 'SD-DIP', description: 'Techniques for fast and efficient application development.' },
    { id: 'SODV2201', code: 'SODV2201', name: 'Web Programming', term: 'Summer', program: 'SD-DIP', description: 'Advanced web programming concepts and frameworks.' },
    { id: 'SODV2202', code: 'SODV2202', name: 'Object Oriented Programming', term: 'Summer', program: 'SD-DIP', description: 'Advanced object-oriented programming concepts.' },
    { id: 'SODV2203', code: 'SODV2203', name: 'Introduction to Game and Simulation Programming', term: 'Spring', program: 'SD-DIP', description: 'Basics of game development and simulation programming.' },
    { id: 'SODV2401', code: 'SODV2401', name: 'Algorithms and Data Structures', term: 'Spring', program: 'SD-DIP', description: 'Fundamental algorithms and data structures in computer science.' },
    { id: 'SODV2999', code: 'SODV2999', name: 'Software Development Diploma Capstone Project', term: 'Spring', program: 'SD-DIP', description: 'Culminating project showcasing comprehensive software development skills.' },
    { id: 'SODV3203-1', code: 'SODV3203', name: 'Mobile Application Development', term: 'Spring', program: 'SD-DIP', description: 'Developing applications for mobile platforms.' },
    { id: 'TECH2102', code: 'TECH2102', name: 'Enterprise Computing', term: 'Spring', program: 'SD-DIP', description: 'Concepts and practices in enterprise-level computing.' },

    // Post-Diploma Courses
    { id: 'SODV3201', code: 'SODV3201', name: 'Web Programming Foundations', term: 'Winter', program: 'SD-PD', description: 'Advanced web programming concepts and techniques.' },
    { id: 'DESN3203', code: 'DESN3203', name: 'Web Design and Development', term: 'Winter', program: 'SD-PD', description: 'Principles of web design and development practices.' },
    { id: 'MATH3901', code: 'MATH3901', name: 'Mathematics for Software Development', term: 'Winter', program: 'SD-PD', description: 'Advanced mathematical concepts for software development.' },
    { id: 'SODV3301', code: 'SODV3301', name: 'Software Development Techniques', term: 'Winter', program: 'SD-PD', description: 'Advanced software development methodologies and techniques.' },
    { id: 'SODV3302', code: 'SODV3302', name: 'Systems Development and Object-Oriented Design', term: 'Winter', program: 'SD-PD', description: 'Advanced systems development and OO design principles.' },
    { id: 'DATA3401', code: 'DATA3401', name: 'Introduction to Data and Analytics', term: 'Summer', program: 'SD-PD', description: 'Fundamentals of data analysis and analytics in software development.' },
    { id: 'DESN3306', code: 'DESN3306', name: 'Computer Graphics', term: 'Summer', program: 'SD-PD', description: 'Principles and techniques of computer graphics programming.' },
    { id: 'SODV3203-2', code: 'SODV3203', name: 'Mobile Application Development', term: 'Summer', program: 'SD-PD', description: 'Advanced mobile application development techniques.' },
    { id: 'SODV3999', code: 'SODV3999', name: 'Software Development Capstone Project', term: 'Summer', program: 'SD-PD', description: 'Comprehensive capstone project for post-diploma students.' },
    { id: 'TECH3101', code: 'TECH3101', name: 'Systems Development: Concepts and Analysis', term: 'Summer', program: 'SD-PD', description: 'Advanced concepts in systems development and analysis.' },

    // Certificate Courses
    { id: 'SODV3201-CERT', code: 'SODV3201', name: 'Web Programming Foundations', term: 'Winter', program: 'SD-CERT', description: 'Web programming concepts for certificate students.' },
    { id: 'DESN3203-CERT', code: 'DESN3203', name: 'Web Design and Development', term: 'Winter', program: 'SD-CERT', description: 'Web design principles for certificate students.' },
    { id: 'MATH3901-CERT', code: 'MATH3901', name: 'Mathematics for Software Development', term: 'Winter', program: 'SD-CERT', description: 'Essential mathematics for software development.' },
    { id: 'SODV3301-CERT', code: 'SODV3301', name: 'Software Development Techniques', term: 'Winter', program: 'SD-CERT', description: 'Core software development techniques for certificate students.' },
    { id: 'SODV3302-CERT', code: 'SODV3302', name: 'Systems Development and Object-Oriented Design', term: 'Summer', program: 'SD-CERT', description: 'OO design principles for certificate students.' },
    { id: 'DATA3401-CERT', code: 'DATA3401', name: 'Introduction to Data and Analytics', term: 'Summer', program: 'SD-CERT', description: 'Basic data analysis for certificate students.' },
    { id: 'DESN3306-CERT', code: 'DESN3306', name: 'Computer Graphics', term: 'Summer', program: 'SD-CERT', description: 'Introduction to computer graphics for certificate students.' },
    { id: 'SODV3203-CERT', code: 'SODV3203', name: 'Mobile Application Development', term: 'Summer', program: 'SD-CERT', description: 'Mobile app development for certificate students.' },
  ]);

  // State for programs
  const [programs, setPrograms] = useState([
    { code: 'SD-DIP', name: 'Software Development Diploma', duration: '2 years', description: 'A comprehensive program covering various aspects of software development.', feesDomestic: 15000, feesInternational: 25000 },
    { code: 'SD-PD', name: 'Software Development Post-Diploma', duration: '1 year', description: 'An advanced program for those with prior programming experience.', feesDomestic: 10000, feesInternational: 18000 },
    { code: 'SD-CERT', name: 'Software Development Certificate', duration: '6 months', description: 'A short-term program focusing on essential software development skills.', feesDomestic: 5000, feesInternational: 8000 },
  ]);

  // Function to add a new course
  const addCourse = (newCourse) => {
    setCourses(prevCourses => [...prevCourses, { ...newCourse, id: Date.now().toString() }]);
    return { success: true, message: 'Course added successfully' };
  };

  // Function to update an existing course
  const updateCourse = (updatedCourse) => {
    setCourses(prevCourses => prevCourses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    return { success: true, message: 'Course updated successfully' };
  };

  // Function to delete a course
  const deleteCourse = (courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    return { success: true, message: 'Course deleted successfully' };
  };

  return (
    <AppContext.Provider value={{ 
      courses,
      programs,
      addCourse,
      updateCourse,
      deleteCourse,
      setPrograms,
    }}>
      {children}
    </AppContext.Provider>
  );
};
