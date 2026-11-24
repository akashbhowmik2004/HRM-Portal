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
  UserPlus,
  FileText,
  Camera,
  GraduationCap,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ChevronRight
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
  Filler,
  ArcElement,
  BarElement
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import MetricStatCard from '../components/MetricStatCard'
import WebcamCapture from '../components/WebcamCapture'
import TaskStatisticsCard from '../components/TaskStatisticsCard'
import PerformanceCard from '../components/PerformanceCard'
import Modal from '../components/Modal'

import { useToast } from '../components/ToastProvider';
import { auth, admin, api } from '../apis/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
)
const DocumentList = ({ employeeId }) => {
  const [docs, setDocs] = useState([]);
  const openDocument = async (documentId) => {
    try {
      const res = await api.get(`/documents/download/${documentId}`);
      if (res.data.success) {
        window.open(res.data.downloadUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Error opening document", err);
    }
  };
  useEffect(() => {
    if (!employeeId) return;
    const fetchDocs = async () => {
      try {
        const { api } = await import("../apis/axios.js");
        const res = await api.get(`/documents/${employeeId}`);
        if (res.data.success) {
          setDocs(res.data.documents);
        }
      } catch (err) {
        console.error("Error fetching docs", err);
      }
    };
    fetchDocs();
  }, [employeeId]);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {docs.length === 0 ? (
        <p className="text-sm text-[#647572]">No documents found for this employee.</p>
      ) : (
        docs.map((doc) => (
          <div key={doc._id} className="flex items-center justify-between gap-3 p-4 bg-white rounded-xl border border-[#E2E8E5] shadow-xs">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#172B2A]">{doc.title}</p>
              <p className="text-[11px] text-[#647572]">{doc.documentType}</p>
            </div>
            <button
              type="button"
              onClick={() => openDocument(doc._id)}
              className="shrink-0 text-xs font-semibold text-[#0F766E] hover:underline"
            >
              View Document
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const HRContent = ({ activeSection, setActiveSection, userDetails }) => {
  const { showToast } = useToast();

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null)

  // Face Enrollment State
  const [isEnrollFaceOpen, setIsEnrollFaceOpen] = useState(false);
  const [enrollFaceEmployeeId, setEnrollFaceEmployeeId] = useState(null);

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
  const [issues, setIssues] = useState([])

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

  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const fetchAttendanceLogs = async () => {
    try {
      const response = await api.get("/attendance/all");
      if (response.data.success) {
        setAttendanceLogs(response.data.attendance);
      }
    } catch (error) {
      console.error("Error fetching all attendance logs:", error);
    }
  };

  const [todayStatus, setTodayStatus] = useState(null);
  const fetchTodayStatus = async () => {
    try {
      const response = await api.get("/attendance/today-status");
      if (response.data.success) {
        setTodayStatus(response.data);
      }
    } catch (error) {
      console.error("Error fetching today status:", error);
    }
  };

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isWebcamCheckInOpen, setIsWebcamCheckInOpen] = useState(false);

  const fetchTodayAttendance = async () => {
    try {
      const response = await api.get("/attendance/today");
      if (response.data.success && response.data.attendance) {
        setTodayAttendance(response.data.attendance);
        if (response.data.attendance.checkInTime && !response.data.attendance.checkOutTime) {
          setIsCheckedIn(true);
        } else {
          setIsCheckedIn(false);
        }
      } else {
        setIsCheckedIn(false);
      }
    } catch (error) {
      console.error("Error fetching today attendance:", error);
    }
  };

  const handleWebcamPunch = async (descriptor, setStatus) => {
    try {
      setStatus("Verifying identity...", false);
      const res = await api.post("/attendance/checkin-webcam", {
        faceDescriptor: descriptor,
      });

      if (res.data.success) {
        setStatus("Attendance marked successfully", false);
        showToast(res.data.message || "Attendance updated successfully", "success");
        setTimeout(() => setIsWebcamCheckInOpen(false), 1500);
        fetchTodayAttendance();
        fetchAttendanceLogs();
        fetchTodayStatus(); // Update HR dashboard global stats
      } else {
        const errorMsg = res.data.message || "Failed to verify face.";
        showToast(errorMsg, "error");
        setStatus(errorMsg, false);
        setTimeout(() => setIsWebcamCheckInOpen(false), 2000);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Face verification failed";
      showToast(errorMessage, "error");
      setStatus(errorMessage, false);
      setTimeout(() => setIsWebcamCheckInOpen(false), 2000);
    }
  };

  useEffect(() => {
    fetchAttendanceLogs();
    fetchTodayStatus();
    fetchTodayAttendance();
  }, []);

  const fetchIssues = async () => {
    try {
      // Use api instance since issue route is under /api/issues
      const { api } = await import('../apis/axios');
      const response = await api.get("/issues");
      if (response.data.success) {
        setIssues(response.data.issues);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handleUpdateIssueStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Open" ? "Resolved" : "Open";
      const { api } = await import('../apis/axios');
      const response = await api.patch(`/issues/${id}/status`, { status: newStatus });
      
      if (response.data.success) {
        showToast(`Issue marked as ${newStatus}`, "success");
        fetchIssues(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      showToast("Failed to update issue status", "error");
    }
  };

  useEffect(() => {
    fetchLeaveRequests()
    fetchTasks()
    fetchIssues()
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
            status: employee.userId?.status || 'Active',
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
    gender: '',
    address: '',
    department: '',
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
    'Issues',
    'Logout'
  ];

  // Document upload state
  const [docEmployeeId, setDocEmployeeId] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("Offer Letter");
  const [docFile, setDocFile] = useState(null);
  const [uploadCount, setUploadCount] = useState(0);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docEmployeeId || !docTitle || !docFile) {
      return showToast("Please fill all document fields and select a file.", "error");
    }
    const formData = new FormData();
    formData.append("employeeId", docEmployeeId);
    formData.append("title", docTitle);
    formData.append("documentType", docType);
    formData.append("file", docFile);
    try {
      const res = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        showToast("Document uploaded successfully!", "success");
        setDocTitle("");
        setDocFile(null);
        e.target.reset();
        setUploadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      showToast(err.response?.data?.message || "Error uploading document", "error");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      showToast('Please fill out the name and email address.', 'error');
      return;
    }
    try {
      // HR can only add employees
      const payload = { ...userForm, role: 'Employee' };
      const response = await admin.post('/create-user', payload);

      await fetchUsers();

      setEmployeeForm((prev) => ({
        ...prev,
        name: userForm.name,
        email: userForm.email,
        designation: 'Software Engineer',
      }));

      setIsAddUserOpen(false);
      setIsAddEmployeeOpen(true);
      showToast('User created successfully! Now add profile details.', 'success');
    } catch (error) {
      console.error('Error adding user:', error);
      showToast(error.response?.data?.message || 'Error creating user.', 'error');
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
        gender: '',
        address: '',
        department: '',
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

  const handleEnrollFace = async (descriptor, setStatus) => {
    try {
      setStatus("Saving face descriptor...");
      const res = await admin.post(`/employees/${enrollFaceEmployeeId}/enroll-face`, {
        faceDescriptor: descriptor
      });
      if (res.data.success) {
        showToast("Face enrolled successfully", "success");
        setIsEnrollFaceOpen(false);
        setEnrollFaceEmployeeId(null);
        fetchEmployees();
      } else {
        setStatus("Failed to enroll face.");
        showToast(res.data.message || "Failed to enroll face", "error");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error enrolling face.");
      showToast(err.response?.data?.message || "Error enrolling face", "error");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard': {
        const internCount = users.filter(u => u.employmentType === 'intern' || u.role === 'intern').length;
        const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
        const deptCount = departments.length;
        const empCount = employees.length;

        const growthLabels = [];
        const growthData = [];
        const now = new Date();
        for (let offset = 5; offset >= 0; offset -= 1) {
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59);
          growthLabels.push(monthEnd.toLocaleDateString('en-US', { month: 'short' }));
          growthData.push(
            employees.filter((employee) => {
              if (!employee.createdAt) return false;
              return new Date(employee.createdAt) <= monthEnd;
            }).length,
          );
        }

        const lineChartData = {
          labels: growthLabels,
          datasets: [
            {
              label: 'Active Headcount',
              data: growthData,
              fill: true,
              backgroundColor: 'rgba(15, 118, 110, 0.08)',
              borderColor: '#0F766E',
              borderWidth: 2.2,
              tension: 0.35,
              pointRadius: 3.5,
              pointBackgroundColor: '#0F766E',
              pointHoverRadius: 5,
            }
          ]
        };

        const lineChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0A362C',
              titleFont: { size: 11, weight: '600' },
              bodyFont: { size: 11 },
              padding: 8,
              cornerRadius: 6,
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 11 }, color: '#64748B' }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(226, 232, 240, 0.6)' },
              ticks: { font: { size: 11 }, color: '#64748B', precision: 0 }
            }
          }
        };

        // Department Distribution Data
        const deptCounts = departments.map(d => ({
          name: d.name,
          count: employees.filter(e => e.department === d.name).length
        })).filter(d => d.count > 0);

        const chartDeptItems = deptCounts;

        const doughnutData = {
          labels: chartDeptItems.map(d => d.name),
          datasets: [
            {
              data: chartDeptItems.map(d => d.count),
              backgroundColor: ['#0F766E', '#14B8A6', '#10B981', '#38BDF8', '#64748B', '#F59E0B'],
              borderWidth: 2,
              borderColor: '#FFFFFF',
              hoverOffset: 4
            }
          ]
        };

        const doughnutOptions = {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0A362C',
              padding: 8,
              cornerRadius: 6
            }
          }
        };

        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033]">
                    HR Workforce Overview
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4F1] px-2.5 py-0.5 text-xs font-semibold text-[#0F766E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
                    Live Portal
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  Welcome back, <span className="font-semibold text-slate-700">{userDetails?.name || 'HR Manager'}</span>. Here is today's personnel snapshot.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E3E7EB] bg-white text-xs text-slate-600 font-medium shadow-sm">
                  <Calendar className="h-3.5 w-3.5 text-[#0F766E]" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4" />
                  + Add Employee
                </button>
              </div>
            </div>

            {/* 4 Top Stat Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <MetricStatCard
                icon={Users}
                value={`${employees.length}`}
                label="Total Employees"
                subtext="Across all company units"
                badge="+12% YoY"
                badgeType="positive"
                iconBg="bg-teal-50 text-[#0F766E]"
              />
              <MetricStatCard
                icon={GraduationCap}
                value={`${internCount}`}
                label="Interns & Trainees"
                subtext="Active learning cohorts"
                badge="Cohort 2026"
                badgeType="neutral"
                iconBg="bg-emerald-50 text-emerald-700"
              />
              <MetricStatCard
                icon={FileCheck}
                value={`${pendingLeaves} Pending`}
                label="Leave Requests"
                subtext={`${leaveRequests.length} total submissions`}
                badge={pendingLeaves > 0 ? "Requires review" : "Up to date"}
                badgeType={pendingLeaves > 0 ? "warning" : "positive"}
                iconBg="bg-amber-50 text-amber-700"
              />
              <MetricStatCard
                icon={Building2}
                value={`${deptCount} Teams`}
                label="Total Departments"
                subtext="Active organizational divisions"
                badge="Configured"
                badgeType="neutral"
                iconBg="bg-sky-50 text-sky-700"
              />
            </div>

            {/* Middle 3-Column Section: Growth Line Chart | Leave Queue | Dept Doughnut */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Employee Headcount Growth (5 cols) */}
              <div className="lg:col-span-5 rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-[#0F766E]" />
                      Employee Growth
                    </h3>
                    <span className="text-[11px] font-semibold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md">
                      6-Month Trend
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Monthly active headcount expansion
                  </p>
                </div>
                <div className="h-52 w-full">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Current Roster: <strong className="text-slate-700">{employees.length}</strong></span>
                  <span className="text-[#0F766E] font-medium flex items-center gap-0.5">
                    Steady hiring pace <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>

              {/* Pending Leave Requests Review (4 cols) */}
              <div className="lg:col-span-4 rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4 text-amber-600" />
                      Leave Requests Review
                    </h3>
                    <button
                      onClick={() => setActiveSection('Leave Management')}
                      className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-0.5"
                    >
                      View all ({leaveRequests.length})
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Recent employee time-off applications
                  </p>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-56">
                  {leaveRequests.slice(0, 4).map((req) => (
                    <div
                      key={req._id || req.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-[#F8FAF9] flex items-center justify-between gap-2 transition hover:border-slate-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#0F766E] font-bold text-xs">
                          {(req.employeeName || req.employeeId?.name || 'E').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-[#172033] truncate">
                            {req.employeeName || req.employeeId?.name || 'Employee'}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {req.type} • {req.days || 1}d ({req.dates || 'Upcoming'})
                          </p>
                        </div>
                      </div>

                      {req.status === 'Pending' ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleGrantLeave(req._id || req.id)}
                            title="Approve"
                            className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectLeave(req._id || req.id)}
                            title="Reject"
                            className="p-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          req.status === 'Approved' || req.status === 'Granted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  ))}
                  {leaveRequests.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No leave requests pending.
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Pending Action: <strong className="text-amber-700">{pendingLeaves}</strong></span>
                  <button
                    onClick={() => setActiveSection('Leave Management')}
                    className="text-[#0F766E] font-medium hover:underline flex items-center gap-0.5"
                  >
                    Manage leaves <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Department Distribution Donut (3 cols) */}
              <div className="lg:col-span-3 rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#172033] mb-1">
                    Department Distribution
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">
                    Personnel allocation by division
                  </p>
                </div>

                <div className="relative h-44 w-full flex items-center justify-center">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-[#172033]">{employees.length}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Members</span>
                  </div>
                </div>

                <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto">
                  {chartDeptItems.slice(0, 4).map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[idx % doughnutData.datasets[0].backgroundColor.length] }}
                        />
                        <span className="truncate">{d.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700 ml-2">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Employee Directory Snapshot */}
            <div className="rounded-xl bg-white border border-[#E3E7EB] shadow-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#172033]">
                    Organization Directory Snapshot
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time roster with verified attendance percentages and roles
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSection('Employees')}
                    className="text-xs font-semibold text-[#0F766E] hover:underline px-2.5 py-1.5"
                  >
                    View All ({employees.length}) →
                  </button>
                  <button
                    onClick={() => setIsAddUserOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] px-3 py-1.5 text-xs font-medium text-white transition shadow-sm"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    + Add Employee
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="pb-2.5">Employee</th>
                      <th className="pb-2.5">Department</th>
                      <th className="pb-2.5">Designation</th>
                      <th className="pb-2.5">Attendance</th>
                      <th className="pb-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.slice(0, 6).map((emp) => (
                      <tr key={emp._id} className="hover:bg-[#F8FAF9] transition">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#0F766E] font-semibold text-xs">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-[#172033]">
                                {emp.name}
                              </p>
                              <p className="text-[10px] text-slate-400">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-xs text-slate-600 font-medium">
                          {emp.department || 'General'}
                        </td>
                        <td className="py-3 text-xs text-slate-600 font-medium">
                          {emp.designation || 'Staff'}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            (emp.attendancePercentage || 0) >= 80
                              ? 'bg-emerald-50 text-emerald-700'
                              : (emp.attendancePercentage || 0) >= 50
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-600'
                          }`}>
                            {emp.attendancePercentage || 0}%
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setSelectedEmployeeDetails(emp)}
                            className="rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-xs text-slate-400">
                          No employees registered yet. Click "+ Add Employee" above to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'Employees':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                  Organization Employee Directory
                </h2>
                <p className="text-xs font-medium text-[#647572] mt-0.5">
                  Complete personnel records with phone, department, designation, attendance and verified credentials
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4" />
                  + Add User
                </button>
                <button
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  + Add Employee Details
                </button>
              </div>
            </div>

            {/* Search Filter Panel */}
            <div className="rounded-xl bg-white border border-[#E2E8E5] shadow-card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#647572]" />
                <input
                  type="text"
                  placeholder="Search by name, role or dept..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] py-2.5 pl-9 pr-4 text-xs font-medium text-[#172B2A] placeholder-[#647572]/70 outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition"
                />
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-[#647572]">Total:</span>
                <span className="px-2.5 py-1 rounded-md bg-[#EAF5F1] text-[#0F766E] font-bold text-xs">
                  {employees.length} personnel
                </span>
              </div>
            </div>

            {/* Employee Directory Table */}
            <div className="rounded-xl bg-white border border-[#E2E8E5] shadow-card p-6 overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="border-b border-[#E2E8E5] text-[11px] font-semibold uppercase tracking-wider text-[#647572]">
                  <tr>
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Contact Phone</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Designation</th>
                    <th className="pb-3">Attendance %</th>
                    <th className="pb-3">Joining Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E5]">
                  {employees
                    .filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()) || e.department.toLowerCase().includes(employeeSearch.toLowerCase()))
                    .map((emp) => (
                      <tr key={emp._id} className="hover:bg-[#EAF5F1]/50 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF5F1] text-[#0F766E] font-bold text-xs">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-[#172B2A]">
                                {emp.name}
                              </p>
                              <p className="text-[11px] text-[#647572] truncate max-w-[200px]">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-xs text-[#172B2A] font-medium">{emp.phone || "—"}</td>
                        <td className="py-3.5 text-xs text-[#172B2A] font-medium">{emp.department}</td>
                        <td className="py-3.5 text-xs text-[#647572] font-medium">{emp.designation}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            (emp.attendancePercentage || 0) >= 80
                              ? 'bg-emerald-50 text-[#15803D]'
                              : (emp.attendancePercentage || 0) >= 50
                              ? 'bg-amber-50 text-[#D97706]'
                              : 'bg-rose-50 text-[#DC2626]'
                          }`}>
                            {emp.attendancePercentage || 0}%
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-[#647572] font-medium">{emp.joiningDate || "—"}</td>
                        <td className="py-3.5 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            <button
                              onClick={() => {
                                setDocEmployeeId(emp._id);
                                setActiveSection("Documents");
                              }}
                              className="flex items-center gap-1 rounded-lg border border-[#E2E8E5] bg-white hover:bg-[#EAF5F1] text-[#0F766E] px-2.5 py-1 text-[11px] font-semibold shadow-xs transition"
                            >
                              <FileText className="h-3 w-3" />
                              Upload Doc
                            </button>
                            <button
                              onClick={() => {
                                setEnrollFaceEmployeeId(emp._id);
                                setIsEnrollFaceOpen(true);
                              }}
                              className="flex items-center gap-1 rounded-lg border border-[#E2E8E5] bg-white hover:bg-[#EAF5F1] text-[#0F766E] px-2.5 py-1 text-[11px] font-semibold shadow-xs transition"
                            >
                              <Camera className="h-3 w-3" />
                              Enroll Face
                            </button>
                            <button
                              onClick={() => setSelectedEmployeeDetails(emp)}
                              className="rounded-lg border border-[#E2E8E5] bg-[#F8FAF9] hover:bg-[#EAF5F1] text-[#172B2A] px-2.5 py-1 text-[11px] font-semibold shadow-xs transition"
                            >
                              View Full Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-xs text-[#647572]">
                        No employees found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* System Users Section */}
            <div className="mt-8 rounded-xl bg-white border border-[#E2E8E5] shadow-card p-6 overflow-x-auto">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-[#172B2A]">
                  Portal System Accounts
                </h3>
                <p className="text-xs text-[#647572] mt-0.5">
                  Authenticated users with role-based dashboard access
                </p>
              </div>
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="border-b border-[#E2E8E5] text-[11px] font-semibold uppercase tracking-wider text-[#647572]">
                  <tr>
                    <th className="pb-3">User Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Role Tier</th>
                    <th className="pb-3">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E5]">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#EAF5F1]/50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF5F1] text-[#0F766E] font-bold text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[#172B2A]">
                              {u.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-xs text-[#647572] font-medium">{u.email}</td>
                      <td className="py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize bg-[#EAF5F1] text-[#0F766E]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-[#15803D]'
                            : 'bg-rose-50 text-[#DC2626]'
                        }`}>
                          {u.status === 'Active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-xs text-[#647572]">
                        No system users registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )

      case 'Leave Management':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                Leave Requests & Approvals
              </h2>
              <p className="text-xs font-medium text-[#647572] mt-0.5">
                Review, grant or reject all employee leave requests
              </p>
            </div>

            <div className="rounded-xl bg-white border border-[#E2E8E5] shadow-card p-6">
              <h3 className="text-base font-semibold mb-4 text-[#172B2A]">
                All Leave Requests ({leaveRequests.length})
              </h3>

              <div className="space-y-4">
                {leaveRequests.map((req) => (
                  <div
                    key={req._id || req.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-[#E2E8E5] p-4 bg-[#F8FAF9] hover:bg-[#EAF5F1]/30 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-[#172B2A]">
                          {req.employeeName}
                        </h4>
                        <span className="text-xs text-[#647572]">({req.department})</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          req.status === 'Granted' || req.status === 'Approved'
                            ? 'bg-emerald-50 text-[#15803D]'
                            : req.status === 'Rejected'
                            ? 'bg-rose-50 text-[#DC2626]'
                            : 'bg-amber-50 text-[#D97706]'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#172B2A] mt-1">
                        <strong>{req.type}</strong>: {req.dates} ({req.days} days)
                      </p>
                      <p className="text-xs font-medium text-[#647572] mt-0.5">Reason: "{req.reason}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectLeave(req._id || req.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 text-xs font-semibold text-[#DC2626] transition shadow-xs"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleGrantLeave(req._id || req.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold text-[#15803D] border border-emerald-200 shadow-xs transition"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Grant Leave
                      </button>
                    </div>
                  </div>
                ))}
                {leaveRequests.length === 0 && (
                  <p className="py-8 text-center text-xs text-[#647572]">
                    No leave requests found.
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 'Attendance':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                  Attendance Analytics & Logs
                </h2>
                <p className="text-xs font-medium text-[#647572] mt-0.5">
                  Daily presence verification, facial recognition punch, and historical time logs
                </p>
              </div>
              {(!todayAttendance || !todayAttendance.checkInTime) ? (
                <button
                  onClick={() => setIsWebcamCheckInOpen(true)}
                  className="rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.98]"
                >
                  Punch In
                </button>
              ) : (!todayAttendance.checkOutTime) ? (
                <button
                  onClick={() => setIsWebcamCheckInOpen(true)}
                  className="rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition bg-[#DC2626] hover:bg-rose-700 active:scale-[0.98]"
                >
                  Punch Out
                </button>
              ) : (
                <span className="text-[#647572] font-semibold text-xs flex items-center bg-[#F8FAF9] border border-[#E2E8E5] px-4 py-2 rounded-xl">
                  Attendance Completed
                </span>
              )}
            </div>

            {todayStatus && (
              <>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                    <p className="text-xs text-[#647572] font-medium">Present Today</p>
                    <p className="mt-2 text-3xl font-bold text-[#15803D]">
                      {Math.round((todayStatus.stats.presentCount / todayStatus.stats.totalEmployees) * 100) || 0}%
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-[#647572]">
                      {todayStatus.stats.presentCount} / {todayStatus.stats.totalEmployees} employees
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                    <p className="text-xs text-[#647572] font-medium">Late Arrivals</p>
                    <p className="mt-2 text-3xl font-bold text-[#D97706]">
                      {Math.round((todayStatus.stats.lateCount / todayStatus.stats.totalEmployees) * 100) || 0}%
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-[#647572]">
                      {todayStatus.stats.lateCount} employees late
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                    <p className="text-xs text-[#647572] font-medium">On Leave</p>
                    <p className="mt-2 text-3xl font-bold text-[#2563EB]">
                      {Math.round((todayStatus.stats.onLeaveCount / todayStatus.stats.totalEmployees) * 100) || 0}%
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-[#647572]">
                      {todayStatus.stats.onLeaveCount} employees on leave
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                    <p className="text-xs text-[#647572] font-medium">Absent</p>
                    <p className="mt-2 text-3xl font-bold text-[#DC2626]">
                      {Math.round((todayStatus.stats.absentCount / todayStatus.stats.totalEmployees) * 100) || 0}%
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-[#647572]">
                      {todayStatus.stats.absentCount} employees absent
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="bg-white rounded-xl border border-[#E2E8E5] shadow-card p-5">
                    <h3 className="font-semibold text-sm text-[#172B2A] mb-4">Who is Present / Late</h3>
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {[...todayStatus.lists.present, ...todayStatus.lists.late].length === 0 && (
                        <p className="text-xs text-[#647572] text-center py-4">No employees present yet.</p>
                      )}
                      {[...todayStatus.lists.present, ...todayStatus.lists.late].map(emp => {
                        const isLate = todayStatus.lists.late.some(l => l._id === emp._id);
                        return (
                          <div key={emp._id} className="flex justify-between items-center p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E2E8E5]">
                            <div>
                              <p className="text-xs font-semibold text-[#172B2A]">{emp.name}</p>
                              <p className="text-[10px] text-[#647572]">In: {new Date(emp.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                              isLate ? 'bg-amber-50 text-[#D97706]' : 'bg-emerald-50 text-[#15803D]'
                            }`}>
                              {isLate ? 'Late' : 'On Time'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E2E8E5] shadow-card p-5">
                    <h3 className="font-semibold text-sm text-[#172B2A] mb-4">Who is On Leave / Absent</h3>
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {[...todayStatus.lists.onLeave, ...todayStatus.lists.absent].length === 0 && (
                        <p className="text-xs text-[#647572] text-center py-4">Everyone is present.</p>
                      )}
                      {todayStatus.lists.onLeave.map(emp => (
                        <div key={emp._id} className="flex justify-between items-center p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E2E8E5]">
                          <div>
                            <p className="text-xs font-semibold text-[#172B2A]">{emp.name}</p>
                            <p className="text-[10px] text-[#647572]">{emp.leaveType}</p>
                          </div>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-[#2563EB]">
                            On Leave
                          </span>
                        </div>
                      ))}
                      {todayStatus.lists.absent.map(emp => (
                        <div key={emp._id} className="flex justify-between items-center p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E2E8E5]">
                          <div>
                            <p className="text-xs font-semibold text-[#172B2A]">{emp.name}</p>
                            <p className="text-[10px] text-[#647572]">Not checked in</p>
                          </div>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-rose-50 text-[#DC2626]">
                            Absent
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-xl border border-[#E2E8E5] shadow-card overflow-hidden">
              <div className="p-4 border-b border-[#E2E8E5] bg-white">
                <h3 className="font-semibold text-sm text-[#172B2A]">Historical Check-In Logs</h3>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#F8FAF9] border-b border-[#E2E8E5] sticky top-0 text-[11px] font-semibold uppercase tracking-wider text-[#647572]">
                    <tr>
                      <th className="p-3.5">Employee</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Punch In</th>
                      <th className="p-3.5">Punch Out</th>
                      <th className="p-3.5">Working Time</th>
                      <th className="p-3.5">Break Time</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {attendanceLogs.map((log) => {
                      const date = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
                      const punchIn = log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A";
                      const punchOut = log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "In Progress";
                      let duration = "0h 0m";
                      if (log.checkInTime && log.checkOutTime) {
                        duration = log.workingDuration || "0h 0m";
                      }
                      const breakSeconds = log.breakDurationSeconds ??
                        (log.breakDurationMinutes || 0) * 60;
                      const breakHours = Math.floor(breakSeconds / 3600);
                      const breakMinutes = Math.floor((breakSeconds % 3600) / 60);
                      const breakDuration = breakSeconds > 0
                        ? `${breakHours}h ${breakMinutes}m`
                        : "0h 0m";

                      let statusText = log.status || "Present";
                      let badgeClass = "bg-[#EAF5F1] text-[#0F766E]";
                      if (log.checkInTime && log.checkOutTime) {
                        statusText += " (100%)";
                        badgeClass = "bg-emerald-50 text-[#15803D]";
                      } else if (!log.checkInTime && !log.checkOutTime && log.status === "Absent") {
                        statusText += " (0%)";
                        badgeClass = "bg-rose-50 text-[#DC2626]";
                      } else {
                        statusText += " (Incomplete)";
                      }
                      
                      return (
                        <tr key={log._id} className="hover:bg-[#EAF5F1]/50 transition-colors">
                          <td className="p-3.5">
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-[#172B2A]">{log.userId?.name || "Unknown"}</span>
                              <span className="text-[10px] text-[#647572]">{log.userId?.email || ""}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-xs text-[#647572] font-medium">{date}</td>
                          <td className="p-3.5 text-xs text-[#647572] font-medium">{punchIn}</td>
                          <td className="p-3.5 text-xs text-[#647572] font-medium">{punchOut}</td>
                          <td className="p-3.5 text-xs font-semibold text-[#172B2A]">{duration}</td>
                          <td className="p-3.5 text-xs font-semibold text-amber-700">{breakDuration}</td>
                          <td className="p-3.5">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {attendanceLogs.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-4 text-xs text-[#647572] text-center">No attendance logs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'Departments':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                Departments
              </h2>
              <p className="text-xs font-medium text-[#647572] mt-0.5">
                Organizational business units and team leads
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {departments.map((d, i) => (
                <div key={i} className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                  <Building2 className="h-6 w-6 text-[#0F766E] mb-2" />
                  <h4 className="font-semibold text-base text-[#172B2A]">
                    {d.name}
                  </h4>
                  <p className="text-xs font-medium text-[#647572] mt-1">Lead: {d.head}</p>
                  <p className="text-xs font-semibold text-[#0F766E] mt-3">{d.count} Members • {d.budget}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'Tasks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                  Organization Tasks Matrix
                </h2>
                <p className="text-xs font-medium text-[#647572] mt-0.5">
                  Track employee deliverables and deadlines
                </p>
              </div>
              <button
                onClick={() => setIsAssignTaskOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Assign Task
              </button>
            </div>
            <TaskStatisticsCard totalTask={245} overdueTask={17} />
            <div className="rounded-xl border border-[#E2E8E5] bg-white p-6 shadow-card">
              <h3 className="mb-4 text-base font-semibold text-[#172B2A]">
                Assigned Tasks ({tasks.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead className="border-b border-[#E2E8E5] text-[11px] font-semibold uppercase tracking-wider text-[#647572]">
                    <tr>
                      <th className="pb-3">Task</th>
                      <th className="pb-3">Assigned Employee</th>
                      <th className="pb-3">Priority</th>
                      <th className="pb-3">Deadline</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-[#EAF5F1]/50 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-xs text-[#172B2A]">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="mt-0.5 text-[11px] text-[#647572]">
                              {task.description}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs text-[#172B2A]">
                          <p className="font-medium">
                            {task.assignee?.name || "Unknown"}
                          </p>
                          <p className="text-[10px] text-[#647572]">
                            {task.assignee?.email || "No email"}
                          </p>
                        </td>
                        <td className="py-3 text-xs text-[#647572] font-medium">
                          {task.priority}
                        </td>
                        <td className="py-3 text-xs text-[#647572] font-medium">
                          {task.deadline || "Not set"}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              task.status === "Completed"
                                ? "bg-emerald-50 text-[#15803D]"
                                : "bg-amber-50 text-[#D97706]"
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
                <p className="py-6 text-center text-xs text-[#647572]">
                  No tasks have been assigned yet.
                </p>
              )}
            </div>
          </div>
        )

      case 'Performance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                Performance Appraisals
              </h2>
              <p className="text-xs font-medium text-[#647572] mt-0.5">
                Workforce efficiency and evaluation metrics
              </p>
            </div>
            <PerformanceCard />
          </div>
        )

      case 'Documents':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                HR Documents
              </h2>
              <p className="text-xs font-medium text-[#647572] mt-0.5">
                Organizational policies and compliance handbooks
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['HR Compliance Handbook', 'Leave Guidelines', 'Workplace Policy'].map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#E2E8E5] shadow-card flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#172B2A]">
                    {doc}
                  </span>
                  <button className="text-xs font-semibold text-[#0F766E] hover:underline">Download</button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'Announcements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                  Announcements
                </h2>
                <p className="text-xs font-medium text-[#647572] mt-0.5">
                  Publish notices across company channels
                </p>
              </div>
              <button
                onClick={() => setIsNewAnnouncementOpen(true)}
                className="rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                + New Notice
              </button>
            </div>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card text-xs text-[#647572]">
                  No announcements yet.
                </div>
              ) : announcements.map((announcement) => (
                <div key={announcement._id} className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                  <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider bg-[#EAF5F1] px-2 py-0.5 rounded-md">Notice</span>
                  <h4 className="font-semibold text-sm text-[#172B2A] mt-2">
                    {announcement.headline}
                  </h4>
                  <p className="text-xs font-medium text-[#647572] mt-1">
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
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                HR Notifications
              </h2>
              <p className="text-xs font-medium text-[#647572] mt-0.5">
                System events and incoming actions
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E2E8E5] shadow-card flex gap-3">
              <Bell className="h-4 w-4 text-[#0F766E] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-xs text-[#172B2A]">
                  New Leave Applications Received
                </p>
                <p className="text-xs font-medium text-[#647572] mt-0.5">Review pending employee requests in Leave Management.</p>
              </div>
            </div>
          </div>
        )

      case 'Issues':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                Submitted Issues
              </h2>
              <p className="text-xs font-medium text-[#647572] mt-0.5">
                Workplace inquiries and grievance tickets
              </p>
            </div>
            <div className="space-y-4">
              {issues.length === 0 ? (
                <div className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card text-xs text-[#647572]">
                  No issues reported yet.
                </div>
              ) : issues.map((issue) => (
                <div key={issue._id} className="p-5 rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-xs text-[#172B2A]">
                        {issue.name}
                      </h4>
                      <p className="text-[10px] text-[#647572]">{issue.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        issue.status === 'Resolved' ? 'bg-emerald-50 text-[#15803D]' : 'bg-amber-50 text-[#D97706]'
                      }`}>
                        {issue.status}
                      </span>
                      <button
                        onClick={() => handleUpdateIssueStatus(issue._id, issue.status)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          issue.status === 'Resolved' 
                            ? 'bg-gray-100 text-[#647572] hover:bg-gray-200' 
                            : 'bg-[#EAF5F1] text-[#0F766E] hover:bg-[#D5EBE3]'
                        }`}
                      >
                        {issue.status === 'Resolved' ? 'Reopen' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#172B2A] mt-2 p-3 bg-[#F8FAF9] border border-[#E2E8E5] rounded-lg">
                    {issue.issue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'Projects':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172B2A]">
                Project Reviews
              </h2>
              <p className="text-xs font-medium text-[#647572] mt-0.5">
                Review and score employee project submissions
              </p>
            </div>
            {projects.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white border border-[#E2E8E5] shadow-card">
                <p className="text-xs text-[#647572]">
                  No projects available to review.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex flex-col rounded-xl bg-white p-5 border border-[#E2E8E5] shadow-card"
                  >
                    <h3 className="text-sm font-bold text-[#172B2A]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold text-[#0F766E] uppercase">
                      By {project.employeeId?.userId?.name || "Unknown Employee"}
                    </p>
                    <p className="mt-2 text-xs text-[#647572] line-clamp-3">
                      {project.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#E2E8E5] flex flex-wrap gap-3">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-[#0F766E] hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-[#15803D] hover:underline"
                        >
                          Live Link
                        </a>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#E2E8E5]">
                      {project.score ? (
                        <div>
                          <p className="text-xs font-semibold text-[#172B2A]">Score: {project.score}/5</p>
                          <p className="text-xs text-[#647572] mt-1">"{project.feedback}"</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReviewingProject(project);
                            setProjectReviewForm({ score: "", feedback: "" });
                            setIsReviewProjectOpen(true);
                          }}
                          className="w-full rounded-lg bg-[#EAF5F1] py-2 text-xs font-semibold text-[#0F766E] hover:bg-[#D5EBE3] transition"
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

      case "Documents":
        return (
          <div className="mx-auto max-w-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#172B2A]">
                Upload Employee Document
              </h2>
              <p className="text-xs text-[#647572] mt-0.5">Attach contracts, payment slips, and verification files</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-[#E2E8E5] shadow-xs">
              <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[#172B2A] mb-1.5">
                    Select Employee
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 outline-none font-medium text-[#172B2A] focus:border-[#0F766E]"
                    onChange={(e) => setDocEmployeeId(e.target.value)}
                    value={docEmployeeId}
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.userId?.name} ({emp.userId?.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#172B2A] mb-1.5">
                    Document Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024 Offer Letter"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 outline-none font-medium text-[#172B2A] focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#172B2A] mb-1.5">
                    Document Type
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 outline-none font-medium text-[#172B2A] focus:border-[#0F766E]"
                  >
                    <option value="Offer Letter">Offer Letter</option>
                    <option value="Payment Slip">Payment Slip</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#172B2A] mb-1.5">
                    File (PDF, Image, etc.)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setDocFile(e.target.files[0])}
                    className="w-full text-[#172B2A] font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-5 py-2.5 font-medium text-white shadow-xs mt-2 transition"
                >
                  Upload Document
                </button>
              </form>
            </div>

            {docEmployeeId && (
              <div className="mt-8">
                <h3 className="text-base font-bold text-[#172B2A] mb-4">
                  Existing Documents
                </h3>
                <DocumentList key={uploadCount} employeeId={docEmployeeId} />
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
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#647572] hover:bg-[#F8FAF9] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-5 py-2 text-xs font-semibold text-white shadow-xs transition"
            >
              Continue to Employee Details →
            </button>
          </>
        }
      >
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172B2A] mb-1.5">User Full Name</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              placeholder="e.g. Alex Morgan"
              className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#172B2A] mb-1.5">Email Address</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              placeholder="alex@company.com"
              className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
            />
          </div>

          <div>
            <label className="block font-medium text-[#172B2A] mb-1.5">
              Role Tier
            </label>
            <select
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
              className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 text-xs text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
            >
              <option className="bg-white text-[#172B2A]" value="employee">
                Employee
              </option>
            </select>
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
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#647572] hover:bg-[#F8FAF9] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEmployee}
              className="rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-5 py-2 text-xs font-semibold text-white shadow-xs transition"
            >
              Save Employee Profile
            </button>
          </>
        }
      >
        <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Full Name</label>
              <input
                type="text"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                placeholder="Full Name"
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Email Address</label>
              <input
                type="email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Phone Number</label>
              <input
                type="text"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={employeeForm.dateOfBirth}
                onChange={(e) => setEmployeeForm({ ...employeeForm, dateOfBirth: e.target.value })}
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Gender</label>
              <select
                value={employeeForm.gender}
                onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary / Other">Non-Binary / Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Department</label>
              <select
                value={employeeForm.department}
                onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
              >
                <option value="">-- Select Department --</option>
                {departments.map((department) => (
                  <option key={department._id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Designation</label>
              <input
                type="text"
                value={employeeForm.designation}
                onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Joining Date</label>
              <input
                type="date"
                value={employeeForm.joiningDate}
                onChange={(e) => setEmployeeForm({ ...employeeForm, joiningDate: e.target.value })}
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#172B2A] mb-1.5">Salary (Annual)</label>
              <input
                type="text"
                value={employeeForm.salary}
                onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                placeholder="e.g. ₹12,00,000 / yr"
                className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#172B2A] mb-1.5">Permanent Address</label>
            <textarea
              rows={2}
              value={employeeForm.address}
              onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })}
              placeholder="Street address, City, State, PIN"
              className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
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
              className="rounded-xl bg-[#F8FAF9] hover:bg-[#EAF5F1] border border-[#E2E8E5] px-5 py-2 text-xs font-semibold text-[#172B2A] transition"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E2E8E5] flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[#172B2A]">
                  {selectedEmployeeDetails.name}
                </p>
                <p className="text-[#0F766E] font-semibold">{selectedEmployeeDetails.designation}</p>
                <p className="text-[11px] font-medium text-[#647572]">{selectedEmployeeDetails.email}</p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-[#EAF5F1] text-[#15803D] border border-[#C5E5D8] px-3 py-1 text-xs font-semibold">
                  {selectedEmployeeDetails.attendancePercentage}% Attendance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[#E2E8E5] bg-white">
                <p className="text-[#647572] font-medium">Phone Number</p>
                <p className="font-semibold mt-0.5 text-[#172B2A]">
                  {selectedEmployeeDetails.phone || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8E5] bg-white">
                <p className="text-[#647572] font-medium">Date of Birth</p>
                <p className="font-semibold mt-0.5 text-[#172B2A]">
                  {selectedEmployeeDetails.dateOfBirth || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8E5] bg-white">
                <p className="text-[#647572] font-medium">Gender</p>
                <p className="font-semibold mt-0.5 text-[#172B2A]">
                  {selectedEmployeeDetails.gender || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8E5] bg-white">
                <p className="text-[#647572] font-medium">Joining Date</p>
                <p className="font-semibold mt-0.5 text-[#172B2A]">
                  {selectedEmployeeDetails.joiningDate || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8E5] bg-white">
                <p className="text-[#647572] font-medium">Department</p>
                <p className="font-semibold mt-0.5 text-[#172B2A]">
                  {selectedEmployeeDetails.department || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8E5] bg-white">
                <p className="text-[#647572] font-medium">Salary</p>
                <p className="font-semibold text-[#15803D] mt-0.5">{selectedEmployeeDetails.salary || 'N/A'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#E2E8E5] bg-white">
              <p className="text-[#647572] font-medium">Address</p>
              <p className="font-medium mt-0.5 text-[#172B2A]">
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
            <button onClick={() => setIsAssignTaskOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-[#647572] hover:bg-[#F8FAF9] transition">Cancel</button>
            <button onClick={() => { showToast('Task assigned!', 'success'); setIsAssignTaskOpen(false); }} className="rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-5 py-2 text-xs font-semibold text-white shadow-xs transition">Assign</button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172B2A] mb-1">Task Title</label>
            <input type="text" placeholder="Task title..." className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15" />
          </div>
          <div>
            <label className="block font-semibold text-[#172B2A] mb-1">Assignee</label>
            <select className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer">
              {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.department})</option>)}
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
            <button onClick={() => setIsNewAnnouncementOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-[#647572] hover:bg-[#F8FAF9] transition">Cancel</button>
            <button onClick={() => { showToast('Announcement published!', 'success'); setIsNewAnnouncementOpen(false); }} className="rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-5 py-2 text-xs font-semibold text-white shadow-xs transition">Publish</button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172B2A] mb-1">Title</label>
            <input type="text" placeholder="Headline..." className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15" />
          </div>
          <div>
            <label className="block font-semibold text-[#172B2A] mb-1">Message</label>
            <textarea rows={4} placeholder="Content..." className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 px-3 text-sm text-[#172B2A] font-medium outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15" />
          </div>
        </div>
      </Modal>

      {/* Review Project Modal */}
      <Modal
        isOpen={isReviewProjectOpen}
        onClose={() => setIsReviewProjectOpen(false)}
        title="Review Project"
        footer={
          <>
            <button
              onClick={() => setIsReviewProjectOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-[#647572] hover:bg-[#F8FAF9] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleProjectReview}
              className="rounded-xl bg-[#0F766E] hover:bg-[#115E59] px-5 py-2 text-xs font-medium text-white shadow-xs transition"
            >
              Save Review
            </button>
          </>
        }
      >
        <form onSubmit={handleProjectReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#172B2A] mb-1.5">
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
              placeholder="e.g. 5"
              className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 text-[#172B2A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
            />
          </div>
          <div>
            <label className="block font-medium text-[#172B2A] mb-1.5">
              Feedback / Comments
            </label>
            <textarea
              rows={3}
              value={projectReviewForm.feedback}
              onChange={(e) =>
                setProjectReviewForm({ ...projectReviewForm, feedback: e.target.value })
              }
              placeholder="Provide comments on the project..."
              className="w-full rounded-xl border border-[#E2E8E5] bg-[#F8FAF9] p-2.5 text-[#172B2A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
            />
          </div>
        </form>
      </Modal>

      {/* Enroll Face Modal */}
      <Modal
        isOpen={isEnrollFaceOpen}
        onClose={() => {
          setIsEnrollFaceOpen(false);
          setEnrollFaceEmployeeId(null);
        }}
        title="Enroll Face"
        size="md"
        primaryAction={{
          label: "Cancel",
          onClick: () => {
            setIsEnrollFaceOpen(false);
            setEnrollFaceEmployeeId(null);
          },
        }}
      >
        <div className="flex flex-col items-center p-4">
          <p className="text-sm text-gray-500 mb-6 text-center">
            Please position the employee's face in front of the camera. The system will automatically detect and enroll the face.
          </p>
          {isEnrollFaceOpen && (
            <WebcamCapture onCapture={handleEnrollFace} mode="enroll" />
          )}
        </div>
      </Modal>

      {/* Webcam Check-In Modal for HR */}
      <Modal
        isOpen={isWebcamCheckInOpen}
        onClose={() => setIsWebcamCheckInOpen(false)}
        title="Webcam Attendance"
        size="md"
        primaryAction={{
          label: "Close",
          onClick: () => setIsWebcamCheckInOpen(false),
        }}
      >
        <div className="flex flex-col items-center p-4">
          <p className="text-sm text-gray-500 mb-6 text-center">
            Look at the camera to mark your attendance.
          </p>
          {isWebcamCheckInOpen && (
            <WebcamCapture onCapture={handleWebcamPunch} mode="verify" />
          )}
        </div>
      </Modal>
    </>
  )
}

export default HRContent;


