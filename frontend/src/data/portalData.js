// Shared persistent state store for HRM Portal

const DEFAULT_EMPLOYEES = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1995-08-14',
    gender: 'Female',
    address: '42 Lotus Boulevard, Indiranagar, Bengaluru, KA',
    department: 'Software Engineering',
    designation: 'Senior Frontend Engineer',
    joiningDate: '2022-03-15',
    salary: '₹14,50,000 / yr',
    status: 'Active',
    attendancePercentage: 95.5
  },
  {
    id: 2,
    name: 'Robert Howard',
    email: 'robert.howard@company.com',
    phone: '+91 98111 22334',
    dateOfBirth: '1992-04-20',
    gender: 'Male',
    address: '77 Silicon Valley Phase 2, Whitefield, Bengaluru, KA',
    department: 'Software Engineering',
    designation: 'Mobile Engineer',
    joiningDate: '2021-06-10',
    salary: '₹12,00,000 / yr',
    status: 'Active',
    attendancePercentage: 94.0
  },
  {
    id: 3,
    name: 'Jhon Willamson',
    email: 'jhon.w@company.com',
    phone: '+91 98222 33445',
    dateOfBirth: '1990-11-05',
    gender: 'Male',
    address: '12 Brigade Road, Bengaluru, KA',
    department: 'Marketing',
    designation: 'Sales Executive',
    joiningDate: '2020-01-18',
    salary: '₹9,80,000 / yr',
    status: 'Active',
    attendancePercentage: 91.2
  },
  {
    id: 4,
    name: 'Darrel Steward',
    email: 'darrel.s@company.com',
    phone: '+91 98333 44556',
    dateOfBirth: '1996-01-29',
    gender: 'Male',
    address: '504 Green Glen Layout, Bellandur, Bengaluru, KA',
    department: 'Product Design',
    designation: 'Lead UI/UX Designer',
    joiningDate: '2021-10-01',
    salary: '₹15,00,000 / yr',
    status: 'Active',
    attendancePercentage: 97.8
  },
  {
    id: 5,
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    phone: '+91 98444 55667',
    dateOfBirth: '1988-09-12',
    gender: 'Female',
    address: '23 Richmond Town, Bengaluru, KA',
    department: 'Human Resources',
    designation: 'Head of HR',
    joiningDate: '2019-04-05',
    salary: '₹18,00,000 / yr',
    status: 'Active',
    attendancePercentage: 98.2
  }
]

const DEFAULT_LEAVE_REQUESTS = [
  {
    id: 1,
    employeeName: 'Priya Sharma',
    department: 'Software Engineering',
    type: 'Sick Leave',
    dates: '12 Oct 2026 - 14 Oct 2026',
    days: 2,
    reason: 'Suffering from severe viral fever and throat infection',
    status: 'Pending',
    appliedOn: 'Today'
  },
  {
    id: 2,
    employeeName: 'Robert Howard',
    department: 'Software Engineering',
    type: 'Casual Leave',
    dates: '20 Oct 2026 - 22 Oct 2026',
    days: 2,
    reason: 'Attending sibling wedding ceremony in home town',
    status: 'Pending',
    appliedOn: 'Yesterday'
  },
  {
    id: 3,
    employeeName: 'Jhon Willamson',
    department: 'Marketing',
    type: 'Earned Leave',
    dates: '01 Nov 2026 - 05 Nov 2026',
    days: 4,
    reason: 'Planned family annual vacation trip',
    status: 'Pending',
    appliedOn: '3 days ago'
  },
  {
    id: 4,
    employeeName: 'Darrel Steward',
    department: 'Product Design',
    type: 'Sick Leave',
    dates: '01 Oct 2026 - 02 Oct 2026',
    days: 1,
    reason: 'Medical appointment',
    status: 'Granted',
    appliedOn: '2 weeks ago'
  }
]

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'HRM Portal Design & Sidebar System',
    content: 'Complete corporate HRM dashboard refactoring with dark mode support, modern widgets, role-based navigation and attendance percentage calculations.',
    githubLink: 'https://github.com/akashbhowmik2004/HRM-Portal',
    youtubeLink: 'https://youtube.com',
    linkedinLink: 'https://linkedin.com',
    author: 'Priya Sharma',
    progress: 95,
    status: 'In Progress',
    createdAt: 'Oct 20, 2026'
  },
  {
    id: 2,
    title: 'Enterprise Single Sign-On (SSO) & Biometrics',
    content: 'Integration of OAuth2 / SAML and physical biometric gate scanner synchronization with MongoDB data feeds.',
    githubLink: 'https://github.com/akashbhowmik2004/HRM-Portal',
    youtubeLink: 'https://youtube.com',
    linkedinLink: 'https://linkedin.com',
    author: 'Priya Sharma',
    progress: 70,
    status: 'In Progress',
    createdAt: 'Oct 15, 2026'
  }
]

// Safe getters and setters using LocalStorage
export const getStoredEmployees = () => {
  try {
    const data = localStorage.getItem('hrm_employees')
    return data ? JSON.parse(data) : DEFAULT_EMPLOYEES
  } catch {
    return DEFAULT_EMPLOYEES
  }
}

export const saveStoredEmployees = (employees) => {
  try {
    localStorage.setItem('hrm_employees', JSON.stringify(employees))
  } catch (e) {
    console.error('Failed to persist employees', e)
  }
}

export const getStoredLeaves = () => {
  try {
    const data = localStorage.getItem('hrm_leaves')
    return data ? JSON.parse(data) : DEFAULT_LEAVE_REQUESTS
  } catch {
    return DEFAULT_LEAVE_REQUESTS
  }
}

export const saveStoredLeaves = (leaves) => {
  try {
    localStorage.setItem('hrm_leaves', JSON.stringify(leaves))
  } catch (e) {
    console.error('Failed to persist leaves', e)
  }
}

export const getStoredProjects = () => {
  try {
    const data = localStorage.getItem('hrm_projects')
    return data ? JSON.parse(data) : DEFAULT_PROJECTS
  } catch {
    return DEFAULT_PROJECTS
  }
}

export const saveStoredProjects = (projects) => {
  try {
    localStorage.setItem('hrm_projects', JSON.stringify(projects))
  } catch (e) {
    console.error('Failed to persist projects', e)
  }
}
