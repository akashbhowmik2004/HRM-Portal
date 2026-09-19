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

import { useToast } from '../components/ToastProvider';
import { auth, admin } from '../apis/axios';

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

const HRContent = ({ activeSection, setActiveSection, userDetails }) => {
  const { showToast } = useToast();

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null)
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false)
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const fetchAnnouncements = async () => {
    try {
      const response = await auth.get('/announcements')
      if (response.data.success) {
        setAnnouncements(response.data.announcements || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  // Search & Filter
  const [employeeSearch, setEmployeeSearch] = useState('')

  // Persistent Employees State
  const [employees, setEmployees] = useState([])
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Persistent Leaves State
  const [leaveRequests, setLeaveRequests] = useState([])
  
  // Persistent Tasks State
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    try {
      const response = await admin.get("/tasks");
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showToast("Error fetching assigned tasks", "error");
    }
  };

  useEffect(() => {
    fetchLeaveRequests()
    fetchTasks()
  }, [])

  const [projects, setProjects] = useState([])
  const [isReviewProjectOpen, setIsReviewProjectOpen] = useState(false)
  const [reviewingProject, setReviewingProject] = useState(null)
  const [projectReviewForm, setProjectReviewForm] = useState({ score: "", feedback: "" })

    const fetchLeaveRequests = async () => {
    try {
      const response = await admin.get('/leave-requests');
      if (response.data.success) {
        setLeaveRequests(response.data.leaveRequests);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await admin.get('/employees');
      if (response.data.success) {
        setEmployees(
          response.data.employees.map((employee) => ({
            ...employee,
            name: employee.userId?.name || 'Unnamed employee',
            email: employee.userId?.email || 'No email',
            role: employee.userId?.role || 'employee',
            status: employee.userId?.isActive === false ? 'Inactive' : 'Active',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await admin.get('/departments');
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await admin.get('/projects')
      if (response.data.success) {
        setProjects(response.data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const [users, setUsers] = useState([])
  const fetchUsers = async () => {
    try {
      const response = await admin.get('/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => { fetchProjects(); fetchEmployees(); fetchLeaveRequests(); fetchDepartments(); fetchUsers(); }, [])

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
  const [jobApplications, setJobApplications] = useState([])

  // Shortlisted Candidates
  const [shortlisted, setShortlisted] = useState([])

  // Departments list
  const [departments, setDepartments] = useState([])

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      showToast('Please fill out the name and email address.', 'error');
      return;
    }
    try {
      const payload = { ...userForm, role: 'employee' };
      await admin.post('/create-user', payload);

      setEmployeeForm((prev) => ({
        ...prev,
        name: userForm.name,
        email: userForm.email,
        designation: 'Software Engineer',
      }));

      setIsAddUserOpen(false);
      setIsAddEmployeeOpen(true);
      showToast('User created! Please now enter their employee profile details.', 'success');
    } catch (error) {
      console.error('Error adding user:', error);
      showToast('Error creating user.', 'error');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!employeeForm.email || !employeeForm.phone) {
      showToast('Please fill out all required employee details.', 'error');
      return;
    }
    try {
      const response = await admin.post('/create-employee', employeeForm);
      const selectedDepartment = departments.find(
        (department) => department.name === employeeForm.department,
      );
      if (selectedDepartment && response.data.employee?._id) {
        await admin.post('/assign-department', {
          employeeId: response.data.employee._id,
          departmentId: selectedDepartment._id,
        });
      }
      
      await fetchEmployees();
      if(typeof fetchDepartments === 'function') await fetchDepartments();
      
      setIsAddEmployeeOpen(false);
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
      });
      showToast('Employee profile saved successfully with full details!', 'success');
    } catch (error) {
      console.error('Error adding employee details:', error);
      showToast('Error creating employee', 'error');
    }
  };

  const handleGrantLeave = async (leaveId) => {
    try {
      const response = await admin.put(`/leave-requests/accept/${leaveId}`);
      if (response.data.success) {
        await fetchLeaveRequests();
        showToast('Leave request has been Granted!', 'success');
      }
    } catch (error) {
      console.error('Error granting leave:', error);
      showToast('Error granting leave', 'error');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      const response = await admin.put(`/leave-requests/reject/${leaveId}`);
      if (response.data.success) {
        await fetchLeaveRequests();
        showToast('Leave request has been Rejected.', 'error');
      }
    } catch (error) {
      console.error('Error rejecting leave:', error);
      showToast('Error rejecting leave', 'error');
    }
  };
  const handleProjectReview = async (e) => {
    e.preventDefault();
    if (!projectReviewForm.score) {
      return showToast("Please provide a score.", "error");
    }
    try {
      const response = await admin.put(`/projects/${reviewingProject._id}/review`, {
        score: projectReviewForm.score,
        feedback: projectReviewForm.feedback
      });
      if (response.data.success) {
        await fetchProjects();
        setIsReviewProjectOpen(false);
        setReviewingProject(null);
        setProjectReviewForm({ score: "", feedback: "" });
        showToast("Project reviewed successfully!", "success");
      }
    } catch (error) {
      console.error("Error reviewing project:", error);
      showToast(
        error.response?.data?.message || "Error reviewing project. Please try again.",
        "error"
      );
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                Good Morning, <span className="text-gray-800 dark:text-gray-100">{userDetails?.name?.split(' ')[0] || "HR"}</span> !
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
                value={`${userDetails?.attendanceCount || 0} Days (${userDetails?.attendancePercentage || 0}%)`}
                label="My Attendance"
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
                        <tr key={emp._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
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

                <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      Announcements
                    </h3>
                    <button onClick={() => setActiveSection('Announcements')} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement._id}>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                          {announcement.headline}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {announcement.body}
                        </p>
                      </div>
                    ))}
                    {announcements.length === 0 && <p className="text-xs text-gray-500 dark:text-gray-400">No announcements yet.</p>}
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
                      <tr key={emp._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
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
            
            <div className="mt-8 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft p-6 overflow-x-auto">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                System Users
              </h3>
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="border-b border-gray-100/80 dark:border-gray-800/50 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="pb-3">User Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/50">
                  {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-100">
                                {u.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">{u.email}</td>
                        <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium capitalize">{u.role}</td>
                        <td className="py-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${u.isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
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
                    key={req._id || req.id}
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
                        onClick={() => handleRejectLeave(req._id || req.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 transition dark:hover:bg-rose-900/30"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleGrantLeave(req._id || req.id)}
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
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Organization Tasks Matrix
              </h2>
              <button
                onClick={() => setIsAssignTaskOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Assign Task
              </button>
            </div>
            <TaskStatisticsCard totalTask={245} overdueTask={17} />
            <div className="rounded-xl border border-gray-100/80 bg-white/80 p-6 shadow-soft dark:border-gray-800/50 dark:bg-[#151d2e]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100">
                Assigned Tasks ({tasks.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead className="border-b border-gray-100 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <tr>
                      <th className="pb-3 font-medium">Task</th>
                      <th className="pb-3 font-medium">Assigned Employee</th>
                      <th className="pb-3 font-medium">Priority</th>
                      <th className="pb-3 font-medium">Deadline</th>
                      <th className="pb-3 text-right font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                    {tasks.map((task) => (
                      <tr key={task._id}>
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="mt-0.5 text-gray-500 dark:text-gray-400">
                              {task.description}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                          <p className="font-medium">
                            {task.assignee?.name || "Unknown"}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {task.assignee?.email || "No email"}
                          </p>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-300">
                          {task.priority}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-300">
                          {task.deadline || "Not set"}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              task.status === "Completed"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                            }`}
                          >
                            {task.status === "Completed"
                              ? "Completed"
                              : "Not completed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {tasks.length === 0 && (
                <p className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                  No tasks have been assigned yet.
                </p>
              )}
            </div>
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
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft text-sm text-gray-500 dark:text-gray-400">
                  No announcements yet.
                </div>
              ) : announcements.map((announcement) => (
                <div key={announcement._id} className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                  <span className="text-[10px] font-semibold text-indigo-500 uppercase">Notice</span>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mt-1">
                    {announcement.headline}
                  </h4>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                    {announcement.body}
                  </p>
                </div>
              ))}
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

      case 'Projects':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Project Reviews
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Review and score employee projects
              </p>
            </div>
            {projects.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No projects available to review.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex flex-col rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft"
                  >
                    <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold text-indigo-500 uppercase">
                      By {project.employeeId?.userId?.name || "Unknown Employee"}
                    </p>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                      {project.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex flex-wrap gap-3">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-indigo-600 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-emerald-600 hover:underline"
                        >
                          Live Link
                        </a>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                      {project.score ? (
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">Score: {project.score}/5</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">"{project.feedback}"</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReviewingProject(project);
                            setProjectReviewForm({ score: "", feedback: "" });
                            setIsReviewProjectOpen(true);
                          }}
                          className="w-full rounded-lg bg-indigo-50 dark:bg-indigo-900/20 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
                        >
                          Review Project
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {renderContent()}

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
            <button onClick={() => { showToast('Task assigned!', 'success'); setIsAssignTaskOpen(false); }} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white">Assign</button>
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
              {employees.map(e => <option key={e._id} className="bg-white dark:bg-[#0c1222] text-gray-800 dark:text-gray-100">{e.name} ({e.department})</option>)}
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
            <button onClick={() => { showToast('Announcement published!', 'success'); setIsNewAnnouncementOpen(false); }} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white">Publish</button>
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
      <Modal
        isOpen={isReviewProjectOpen}
        onClose={() => setIsReviewProjectOpen(false)}
        title="Review Project"
        footer={
          <>
            <button
              onClick={() => setIsReviewProjectOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleProjectReview}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-medium text-white transition"
            >
              Save Review
            </button>
          </>
        }
      >
        <form onSubmit={handleProjectReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Score (out of 5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              required
              value={projectReviewForm.score}
              onChange={(e) =>
                setProjectReviewForm({ ...projectReviewForm, score: e.target.value })
              }
              placeholder="e.g. 8"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-gray-800 dark:text-gray-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Feedback / Comments
            </label>
            <textarea
              rows={3}
              value={projectReviewForm.feedback}
              onChange={(e) =>
                setProjectReviewForm({ ...projectReviewForm, feedback: e.target.value })
              }
              placeholder="Provide comments on the project..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-gray-800 dark:text-gray-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </form>
      </Modal>
    </>
  )
}

export default HRContent;


