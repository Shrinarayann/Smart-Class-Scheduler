export const mockStudentInfo = {
    name: "Alex Johnson",
    id: "STU12345",
    program: "Computer Science",
    semester: "Fall 2025",
    year: 3,
    credits: 15
  };
  
  export const mockCourses = [
    { id: 1, code: "CS301", name: "Data Structures", credits: 4, instructor: "Dr. Smith", schedule: "Mon/Wed 10:00-11:30", capacity: 30, enrolled: 18, status: "Open" },
    { id: 2, code: "CS420", name: "Machine Learning", credits: 3, instructor: "Dr. Chen", schedule: "Tue/Thu 13:00-14:30", capacity: 25, enrolled: 25, status: "Full" },
    { id: 3, code: "MATH255", name: "Linear Algebra", credits: 3, instructor: "Dr. Johnson", schedule: "Mon/Wed 13:00-14:30", capacity: 40, enrolled: 32, status: "Open" },
    { id: 4, code: "CS380", name: "Database Systems", credits: 4, instructor: "Dr. Garcia", schedule: "Tue/Thu 10:00-11:30", capacity: 30, enrolled: 22, status: "Open" },
    { id: 5, code: "ENG210", name: "Technical Writing", credits: 3, instructor: "Prof. Williams", schedule: "Fri 9:00-12:00", capacity: 25, enrolled: 20, status: "Open" }
  ];
  
  export const mockEnrolledCourses = [
    { id: 1, code: "CS301", name: "Data Structures", credits: 4, schedule: "Mon/Wed 10:00-11:30" },
    { id: 4, code: "CS380", name: "Database Systems", credits: 4, schedule: "Tue/Thu 10:00-11:30" },
    { id: 5, code: "ENG210", name: "Technical Writing", credits: 3, schedule: "Fri 9:00-12:00" }
  ];
  
  export const scheduleMap = {
    "Mon/Wed 10:00-11:30": { days: ["Monday", "Wednesday"], time: "10:00-11:30" },
    "Tue/Thu 10:00-11:30": { days: ["Tuesday", "Thursday"], time: "10:00-11:30" },
    "Mon/Wed 13:00-14:30": { days: ["Monday", "Wednesday"], time: "13:00-14:30" },
    "Tue/Thu 13:00-14:30": { days: ["Tuesday", "Thursday"], time: "13:00-14:30" },
    "Fri 9:00-12:00": { days: ["Friday"], time: "9:00-12:00" }
  };