import { useState, useEffect } from 'react'
import {
  Users,
  Building2,
  FileCheck,
  Plus,
  Search,
  Mail,
  CheckCircle2,
  XCircle,
  Bell,
  Percent,
  UserPlus
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import MetricStatCard from '../components/MetricStatCard'
import TaskStatisticsCard from '../components/TaskStatisticsCard'
import PerformanceCard from '../components/PerformanceCard'
import Modal from '../components/Modal'
import {
  getStoredEmployees,
  saveStoredEmployees,
  getStoredLeaves,
  saveStoredLeaves
} from '../data/portalData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const HRDashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('hrm_dark_mode') === 'true'
  })

  // Synchronize dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('hrm_dark_mode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('hrm_dark_mode', 'false')
    }
  }, [isDarkMode])

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null)
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false)
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false)

  // Search & Filter
  const [employeeSearch, setEmployeeSearch] = useState('')

  // Persistent Employees State
  const [employees, setEmployees] = useState([])
  useEffect(() => {
    setEmployees(getStoredEmployees())
  }, [])

  // Persistent Leaves State
  const [leaveRequests, setLeaveRequests] = useState([])
  useEffect(() => {
    setLeaveRequests(getStoredLeaves())
  }, [])

  // Add User Form State
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Employee',
    password: ''
  })

  // Add Employee Form State with all required fields
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    department: 'Software Engineering',
    designation: '',
    joiningDate: '',
    salary: ''
  })

  // Job Applications
  const jobApplications = [
    { name: 'Rojina Shahi', email: 'shahirji12@gmail.com', position: 'Graphics Designer', badgeColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
    { name: 'Amrit Acharya', email: 'amritacha0@gmail.com', position: 'Mobile Engineer', badgeColor: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' },
    { name: 'Abhinav Aryal', email: 'abhiv.aryal@hotmail.com', position: 'Frontend Developer', badgeColor: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  ]

  // Shortlisted Candidates
  const shortlisted = [
    { name: 'Francis Holzworth', id: 'APPID#00222' },
    { name: 'Kaylyn Yokel', id: 'APPID#00223' },
    { name: 'Kimberly Muro', id: 'APPID#00224' },
  ]

  // Departments list
  const departments = [
    { name: 'Software Engineering', head: 'Rahul Nair', count: 24, budget: '₹1.2 Cr', openPositions: 4 },
    { name: 'Product Design', head: 'Darrel Steward', count: 8, budget: '₹45 L', openPositions: 2 },
    { name: 'Marketing & Sales', head: 'Jhon Willamson', count: 12, budget: '₹60 L', openPositions: 3 },
    { name: 'Human Resources', head: 'Sarah Jenkins', count: 5, budget: '₹30 L', openPositions: 1 },
    { name: 'Business Development', head: 'Jaxon Dean', count: 6, budget: '₹35 L', openPositions: 2 },
  ]

  // Exact Sidebar items required by user for HR:
  const hrSidebarItems = [
    'Dashboard',
    'Employees',
    'Departments',
    'Attendance',
    'Leave Management',
    'Tasks',
    'Performance',
    'Documents',
    'Announcements',
    'Notifications',
    'Logout'
  ]

  // Grant Leave Handler
  const handleGrantLeave = (id) => {
    const updated = leaveRequests.map(l => l.id === id ? { ...l, status: 'Granted' } : l)
    setLeaveRequests(updated)
    saveStoredLeaves(updated)
    alert('Leave request has been Granted!')
  }

  // Reject Leave Handler
  const handleRejectLeave = (id) => {
    const updated = leaveRequests.map(l => l.id === id ? { ...l, status: 'Rejected' } : l)
    setLeaveRequests(updated)
    saveStoredLeaves(updated)
    alert('Leave request has been Rejected.')
  }

  // Handle Add User
  const handleAddUser = (e) => {
    e.preventDefault()
    if (!userForm.name || !userForm.email) {
      alert('Please fill out the name and email address.')
      return
    }

    setEmployeeForm(prev => ({
      ...prev,
      name: userForm.name,
      email: userForm.email,
      designation: userForm.role === 'Employee' ? 'Associate Engineer' : userForm.role
    }))

    setIsAddUserOpen(false)
    setIsAddEmployeeOpen(true)
    alert(`User account for ${userForm.name} created! Please now enter their employee profile details.`)
  }

  // Handle Add Employee Details
  const handleAddEmployee = (e) => {
    e.preventDefault()
    if (!employeeForm.name || !employeeForm.email || !employeeForm.phone) {
      alert('Please fill out all required employee details.')
      return
    }

    const newEmp = {
      id: Date.now(),
      name: employeeForm.name,
      email: employeeForm.email,
      phone: employeeForm.phone,
      dateOfBirth: employeeForm.dateOfBirth || '1998-05-15',
      gender: employeeForm.gender || 'Male',
      address: employeeForm.address || 'Bengaluru, Karnataka',
      department: employeeForm.department || 'Software Engineering',
      designation: employeeForm.designation || 'Software Engineer',
      joiningDate: employeeForm.joiningDate || new Date().toISOString().split('T')[0],
      salary: employeeForm.salary || '₹10,00,000 / yr',
      status: 'Active',
      attendancePercentage: 96.0
    }

    const updated = [newEmp, ...employees]
    setEmployees(updated)
    saveStoredEmployees(updated)
    setIsAddEmployeeOpen(false)
    setEmployeeForm({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      department: 'Software Engineering',
      designation: '',
      joiningDate: '',
      salary: ''
    })
    alert('Employee profile saved successfully with full details!')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                Good Morning, <span className="text-gray-800 dark:text-gray-100">Sarah</span> !
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Welcome back, Let's get back to work.
              </p>
            </div>

            {/* Row of Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricStatCard
                icon={Users}
                value={`${employees.length}`}
                label="Total Employee"
              />
              <MetricStatCard
                icon={Building2}
                value="15"
                label="Total Department"
              />
              <MetricStatCard
                icon={Percent}
                value="95.2%"
                label="Attendance Rate"
              />
              <MetricStatCard
                icon={FileCheck}
                value={`${leaveRequests.filter(l => l.status === 'Pending').length} Pending`}
                label="Leave Requests"
              />
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 xl:grid-cols-[1.8fr_1.1fr]">
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      All Employee Directory
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      With real-time attendance percentages and profile details
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsAddUserOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-xs font-medium text-white transition"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Add User / Employee
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-100/80 dark:border-gray-800/50 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <tr>
                        <th className="pb-3">Employee Name</th>
                        <th className="pb-3">Department</th>
                        <th className="pb-3">Designation</th>
                        <th className="pb-3">Attendance %</th>
                        <th className="pb-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/50">
                      {employees.slice(0, 5).map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                                {emp.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                  {emp.name}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">{emp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {emp.department}
                          </td>
                          <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {emp.designation}
                          </td>
                          <td className="py-3.5">
                            <span className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                              {emp.attendancePercentage}%
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setSelectedEmployeeDetails(emp)}
                              className="rounded px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-gray-100 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Panels */}
              <div className="space-y-6">
                <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-6">
                  <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Recent Job Applications
                  </h3>
                  <div className="space-y-3.5">
                    {jobApplications.map((cand, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                            {cand.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs truncate text-gray-800 dark:text-gray-100">
                              {cand.name}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{cand.email}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium shrink-0 ${cand.badgeColor}`}>
                          {cand.position}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-6">
                  <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Shortlisted Candidates
                  </h3>
                  <div className="space-y-3">
                    {shortlisted.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.id}</p>
                          </div>
                        </div>
                        <button className="rounded-lg p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'Employees':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Organization Employee Directory
                </h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Complete records with phone, DOB, gender, address, salary</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition"
                >
                  <UserPlus className="h-4 w-4" />
                  Add User
                </button>
                <button
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition"
                >
                  <Plus className="h-4 w-4" />
                  Add Employee Details
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, role or dept..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] py-2.5 pl-9 pr-4 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">Total: {employees.length} personnel</span>
            </div>

            {/* Directory Table */}
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-6 overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="border-b border-gray-100/80 dark:border-gray-800/50 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Designation</th>
                    <th className="pb-3">Attendance %</th>
                    <th className="pb-3">Joining Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/50">
                  {employees
                    .filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()) || e.department.toLowerCase().includes(employeeSearch.toLowerCase()))
                    .map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-100">
                                {emp.name}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">{emp.phone}</td>
                        <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">{emp.department}</td>
                        <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">{emp.designation}</td>
                        <td className="py-3.5">
                          <span className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                            {emp.attendancePercentage}%
                          </span>
                        </td>
                        <td className="py-3.5 text-sm text-gray-500 dark:text-gray-400 font-medium">{emp.joiningDate}</td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setSelectedEmployeeDetails(emp)}
                            className="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-xs font-semibold"
                          >
                            View Full Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'Leave Management':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Leave Requests & Approvals
              </h2>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                Review, grant or reject all employee leave requests
              </p>
            </div>

            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-6">
              <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">
                All Leave Requests ({leaveRequests.length})
              </h3>

              <div className="space-y-4">
                {leaveRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-gray-100/80 dark:border-gray-800/50 p-4 bg-gray-50/50 dark:bg-gray-900/40"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                          {req.employeeName}
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-gray-500">({req.department})</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          req.status === 'Granted' || req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : req.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                        <strong>{req.type}</strong>: {req.dates} ({req.days} days)
                      </p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Reason: "{req.reason}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectLeave(req.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 transition dark:hover:bg-rose-900/30"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleGrantLeave(req.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm transition dark:hover:bg-emerald-900/30"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Grant Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'Attendance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Organization Attendance Analytics
              </h2>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Live attendance percentage and check-in ratios</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-5">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Overall Attendance</p>
                <p className="mt-2 text-3xl font-bold text-emerald-500 dark:text-emerald-400">95.2%</p>
                <p className="mt-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">42 / 45 checked in today</p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-5">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Late Arrivals</p>
                <p className="mt-2 text-3xl font-bold text-amber-500 dark:text-amber-400">4.4%</p>
                <p className="mt-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">2 employees late</p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-5">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">On Leave</p>
                <p className="mt-2 text-3xl font-bold text-blue-500 dark:text-blue-400">2.2%</p>
                <p className="mt-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">1 employee on leave</p>
              </div>
            </div>
          </div>
        )

      case 'Departments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Departments
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {departments.map((d, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                  <Building2 className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mb-2" />
                  <h4 className="font-semibold text-base text-gray-800 dark:text-gray-100">
                    {d.name}
                  </h4>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Lead: {d.head}</p>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-3">{d.count} Members • {d.budget}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'Tasks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Task Delegation
              </h2>
              <button onClick={() => setIsAssignTaskOpen(true)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white">Assign Task</button>
            </div>
            <TaskStatisticsCard totalTask={245} overdueTask={17} />
          </div>
        )

      case 'Performance':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Performance Appraisals
            </h2>
            <PerformanceCard />
          </div>
        )

      case 'Documents':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              HR Documents
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {['HR Compliance Handbook', 'Leave Guidelines', 'Workplace Policy'].map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                    {doc}
                  </span>
                  <button className="text-xs font-semibold text-indigo-600 hover:underline">Download</button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'Announcements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Announcements
              </h2>
              <button onClick={() => setIsNewAnnouncementOpen(true)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white">New Notice</button>
            </div>
            <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                Townhall & Bonus Distribution
              </h4>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">All department leads are requested to finalize quarterly appraisals.</p>
            </div>
          </div>
        )

      case 'Notifications':
        return (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              HR Notifications
            </h2>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex gap-3">
              <Bell className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                  New Leave Applications Received
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Review pending employee requests in Leave Management.</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0c1222]' : 'bg-[#f5f6f8]'}`}>
      <div className="flex min-h-screen">
        <Sidebar
          role="hr"
          items={hrSidebarItems}
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <TopHeader
            user={{
              name: 'Sarah Jenkins',
              role: 'HR Manager',
              avatar: null
            }}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            isDarkMode={isDarkMode}
          />

          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Step 1: Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New Portal User"
        footer={
          <>
            <button
              onClick={() => setIsAddUserOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-sm"
            >
              Continue to Employee Details →
            </button>
          </>
        }
      >
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">User Full Name</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              placeholder="e.g. Alex Morgan"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              placeholder="alex@company.com"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Account Role</label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
            >
              <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Employee</option>
              <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">HR Manager</option>
              <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Admin</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Temporary Password</label>
            <input
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
        </form>
      </Modal>

      {/* Step 2: Add Employee Details Modal */}
      <Modal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        title="Add Employee Profile Details"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              onClick={() => setIsAddEmployeeOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEmployee}
              className="rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 px-5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm"
            >
              Save Employee Profile
            </button>
          </>
        }
      >
        <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                placeholder="Full Name"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={employeeForm.dateOfBirth}
                onChange={(e) => setEmployeeForm({ ...employeeForm, dateOfBirth: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
              <select
                value={employeeForm.gender}
                onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
              >
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Male</option>
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Female</option>
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Non-Binary / Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
              <select
                value={employeeForm.department}
                onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
              >
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Software Engineering</option>
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Product Design</option>
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Marketing</option>
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Human Resources</option>
                <option className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">Business Development</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Designation</label>
              <input
                type="text"
                value={employeeForm.designation}
                onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Joining Date</label>
              <input
                type="date"
                value={employeeForm.joiningDate}
                onChange={(e) => setEmployeeForm({ ...employeeForm, joiningDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Salary (Annual)</label>
              <input
                type="text"
                value={employeeForm.salary}
                onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                placeholder="e.g. ₹12,00,000 / yr"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Permanent Address</label>
            <textarea
              rows={2}
              value={employeeForm.address}
              onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })}
              placeholder="Street address, City, State, PIN"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
        </form>
      </Modal>

      {/* View Full Employee Details Modal */}
      {selectedEmployeeDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEmployeeDetails(null)}
          title={`Employee Details: ${selectedEmployeeDetails.name}`}
          maxWidth="max-w-xl"
          footer={
            <button
              onClick={() => setSelectedEmployeeDetails(null)}
              className="rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-base text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.name}
                </p>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{selectedEmployeeDetails.designation}</p>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{selectedEmployeeDetails.email}</p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2.5 py-1 text-xs font-semibold">
                  {selectedEmployeeDetails.attendancePercentage}% Attendance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Phone Number</p>
                <p className="font-semibold mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.phone || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Date of Birth</p>
                <p className="font-semibold mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.dateOfBirth || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Gender</p>
                <p className="font-semibold mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.gender || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Joining Date</p>
                <p className="font-semibold mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.joiningDate || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Department</p>
                <p className="font-semibold mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.department || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Salary</p>
                <p className="font-semibold text-emerald-600 mt-0.5">{selectedEmployeeDetails.salary || 'N/A'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
              <p className="text-gray-500 dark:text-gray-400 font-medium">Address</p>
              <p className="font-medium mt-0.5 text-gray-800 dark:text-gray-100">
                {selectedEmployeeDetails.address || 'N/A'}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Task Modal */}
      <Modal
        isOpen={isAssignTaskOpen}
        onClose={() => setIsAssignTaskOpen(false)}
        title="Assign New Task"
        footer={
          <>
            <button onClick={() => setIsAssignTaskOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">Cancel</button>
            <button onClick={() => { alert('Task assigned!'); setIsAssignTaskOpen(false); }} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white">Assign</button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
            <input type="text" placeholder="Task title..." className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
            <select className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer">
              {employees.map(e => <option key={e.id} className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">{e.name} ({e.department})</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* New Announcement Modal */}
      <Modal
        isOpen={isNewAnnouncementOpen}
        onClose={() => setIsNewAnnouncementOpen(false)}
        title="Publish Announcement"
        footer={
          <>
            <button onClick={() => setIsNewAnnouncementOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">Cancel</button>
            <button onClick={() => { alert('Announcement published!'); setIsNewAnnouncementOpen(false); }} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white">Publish</button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" placeholder="Headline..." className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea rows={4} placeholder="Content..." className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 px-3 text-sm text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default HRDashboard
