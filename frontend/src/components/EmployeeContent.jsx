import { useState, useEffect } from "react";
import {
  CalendarCheck,
  Download,
  Plus,
  Bell,
  Megaphone,
  FileText,
  Check,
  ChevronRight,
  Sun,
  ClipboardList,
  Phone,
  CheckSquare,
  Wallet,
  Thermometer,
  Coffee,
  Palmtree,
  Plane,
  Tent,
  Trash2,
  FilePenIcon,
} from "lucide-react";
import { auth, employee } from "../apis/axios";

// Brand Icons
const GithubIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const YoutubeIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
  </svg>
);

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Modal from "../components/Modal";

import { useToast } from "../components/ToastProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeContent = ({ activeSection, setActiveSection, userDetails }) => {
  const { showToast } = useToast();

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isEditLeaveOpen, setIsEditLeaveOpen] = useState(false);
  const [editingLeaveId, setEditingLeaveId] = useState(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: "",
    content: "",
    githubLink: "",
    linkedinLink: "",
    liveLink: "",
  });

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    designation: "",
    empId: "",
    department: "",
    manager: "",
    joinDate: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    salary: "",
    attendancePercentage: 0,
  });

  useEffect(() => {
    if (!userDetails) return;

    const nameParts = (userDetails.name || "Employee").trim().split(/\s+/);
    setProfile((currentProfile) => ({
      ...currentProfile,
      firstName: nameParts[0] || currentProfile.firstName,
      lastName: nameParts.slice(1).join(" "),
      email: userDetails.email || currentProfile.email,
      role: userDetails.role || currentProfile.role,
      phone: userDetails.employee?.phone || currentProfile.phone,
      empId: userDetails.employee?.employeeId || currentProfile.empId,
      department: userDetails.employee?.department || currentProfile.department,
      designation:
        userDetails.employee?.designation || currentProfile.designation,
      manager: currentProfile.manager,
      joinDate: userDetails.employee?.joiningDate || currentProfile.joinDate,
      dateOfBirth:
        userDetails.employee?.dateOfBirth || currentProfile.dateOfBirth,
      gender: userDetails.employee?.gender || currentProfile.gender,
      address: userDetails.employee?.address || currentProfile.address,
      salary: userDetails.employee?.salary ?? currentProfile.salary,
      attendancePercentage: userDetails.attendancePercentage ?? currentProfile.attendancePercentage,
    }));
  }, [userDetails]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const fetchAnnouncements = async () => {
    try {
      const response = await auth.get("/announcements");
      if (response.data.success) {
        setAnnouncements(response.data.announcements || []);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await employee.get("/projects");
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchLeaveHistory = async () => {
    try {
      const response = await employee.get("/leave-history");
      if (response.data.success) {
        setLeaveRequests(response.data.leaveHistory);
      }
    } catch (error) {
      console.error("Error fetching leave history:", error);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (!window.confirm("Delete this leave request?")) return;

    try {
      const response = await employee.delete(`/delete-leave/${leaveId}`);
      if (response.data.success) {
        await fetchLeaveHistory();
        showToast("Leave request deleted successfully.", "success");
      }
    } catch (error) {
      console.error("Error deleting leave request:", error);
      showToast(
        error.response?.data?.message || "Error deleting leave request.",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
    fetchAnnouncements();
    fetchProjects();
  }, []);

  const [newLeave, setNewLeave] = useState({
    type: " ",
    fromDate: "",
    toDate: "",
    reason: "",
    documentLink: "",
  });

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await employee.get("/tasks");
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const [documents, setDocuments] = useState([]);
  
  const fetchDocuments = async () => {
    if (!userDetails?.employee?._id) return;
    try {
      const { api } = await import("../apis/axios.js");
      const response = await api.get(`/documents/${userDetails.employee._id}`);
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDocuments();
  }, [userDetails]);

  const handleTaskStatusChange = async (task) => {
    const nextStatus =
      task.status === "Completed" ? "In Progress" : "Completed";
    try {
      const response = await employee.put(`/tasks/${task._id}/status`, {
        status: nextStatus,
      });
      if (response.data.success) {
        setTasks((currentTasks) =>
          currentTasks.map((currentTask) =>
            currentTask._id === task._id
              ? { ...currentTask, status: nextStatus }
              : currentTask,
          ),
        );
      }
    } catch (error) {
      showToast("Unable to update task status.", "error");
    }
  };

  const [notifications, setNotifications] = useState([]);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      if (newLeave.type === " ") {
        return showToast("Please select a leave type.", "error");
      }
      if (!newLeave.fromDate || !newLeave.reason)
        return showToast("Please fill out the dates and reason.", "error");
      const response = await employee.post("/apply-leave", newLeave);
      if (!response.data.success) {
        return showToast(
          response.data.message || "Error applying leave. Please try again.",
          "error",
        );
      }
      await fetchLeaveHistory();
      setIsApplyLeaveOpen(false);
      setNewLeave({ type: "Sick Leave", fromDate: "", toDate: "", reason: "" });
      showToast(
        "Leave request submitted! HR and Admin can now review it.",
        "success",
      );
    } catch (error) {
      console.error("Error applying leave:", error);
      showToast(
        error.response?.data?.message ||
          "Error applying leave. Please try again.",
        "error",
      );
    }
  };

  const handleEditLeave = (leaveRequest) => {
    setEditingLeaveId(leaveRequest._id || leaveRequest.id);
    setNewLeave({
      type: leaveRequest.type || "",
      fromDate: leaveRequest.fromDate || "",
      toDate: leaveRequest.toDate || "",
      reason: leaveRequest.reason || "",
      documentLink: leaveRequest.documentLink || "",
    });
    setIsEditLeaveOpen(true);
  };

  const handleUpdateLeave = async (e) => {
    e.preventDefault();
    if (
      !newLeave.type ||
      !newLeave.fromDate ||
      !newLeave.toDate ||
      !newLeave.reason
    ) {
      return showToast("Please fill out all leave fields.", "error");
    }

    try {
      const response = await employee.put(
        `/edit-leave/${editingLeaveId}`,
        newLeave,
      );
      if (!response.data.success) {
        return showToast(
          response.data.message ||
            "Error editing leave request. Please try again.",
          "error",
        );
      }
      await fetchLeaveHistory();
      setIsEditLeaveOpen(false);
      setEditingLeaveId(null);
      showToast("Leave request updated successfully!", "success");
    } catch (error) {
      console.error("Error editing leave request:", error);
      showToast(
        error.response?.data?.message ||
          "Error editing leave request. Please try again.",
        "error",
      );
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      if (!projectForm.title || !projectForm.content) {
        return showToast(
          "Please enter a project title and description content.",
          "error",
        );
      }
      if(!projectForm.githubLink && !projectForm.linkedinLink && !projectForm.liveLink) {
        return showToast(
          "Please provide at least one link for the project.",
          "error",
        );
      }
      await employee.post("/create-project", projectForm);
      await fetchProjects();
      setIsAddProjectOpen(false);
      setProjectForm({
        title: "",
        content: "",
        githubLink: "",
        linkedinLink: "",
        liveLink: "",
      });
      showToast("Project added successfully!", "success");
    } catch (error) {
      console.error("Error adding project:", error);
      showToast(
        error.response?.data?.message ||
          "Error adding project. Please try again.",
        "error",
      );
    }
  };

  const statusBadge = (status) => {
    const map = {
      "In Progress":
        "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      Pending:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      "Not Started":
        "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      Completed:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    };
    return (
      map[status] ||
      "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const leaveBadge = (status) => {
    const map = {
      Approved:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      Granted:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      Rejected:
        "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
      Pending:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    };
    return (
      map[status] ||
      "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const renderDashboard = () => {
    const now = new Date();
    const activeTasks = tasks.filter((task) => task.status !== "Completed");
    const pendingLeaves = leaveRequests.filter(
      (leaveRequest) => leaveRequest.status === "Pending",
    );
    const currentSalary =
      typeof profile.salary === "number"
        ? `₹${profile.salary.toLocaleString("en-IN")}`
        : profile.salary || "Not available";
    const timeStr = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = now.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const displayLeaves = leaveRequests.slice(0, 3);

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Good morning, {profile.firstName}!{" "}
              <Sun className="inline-block h-5 w-5 text-amber-500 ml-2 mb-1" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Stay consistent, keep growing.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-3 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft px-4 py-2.5">
              <Sun className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {dateStr}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Have a productive day!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <CalendarCheck className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Attendance Today
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              Present
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Check-in: {isCheckedIn ? "09:12 AM" : "Not checked in"}
            </p>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <FileText className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Leave Requests
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {pendingLeaves.length} Pending
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {leaveRequests.length} submitted
            </p>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <CheckSquare className="h-6 w-6 text-violet-500 dark:text-violet-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              My Tasks
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {activeTasks.length} Active
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {tasks.length - activeTasks.length} completed
            </p>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Wallet className="h-6 w-6 text-amber-500 dark:text-amber-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Next Payroll
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {currentSalary}
            </p>
            <p className="text-xs text-gray-400 mt-1">From employee record</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                Attendance Overview
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                This Month ▾
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <Doughnut
                    data={{
                      labels: ["Present", "Absent", "Late", "Half Day"],
                      datasets: [
                        {
                          data: [20, 2, 1, 1],
                          backgroundColor: [
                            "#6366f1",
                            "#f43f5e",
                            "#f59e0b",
                            "#9ca3af",
                          ],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      cutout: "75%",
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {profile.attendancePercentage}%
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      Present
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="space-y-2.5">
                  {[
                    { label: "Present", count: 20, color: "bg-[#6366f1]" },
                    { label: "Absent", count: 2, color: "bg-[#f43f5e]" },
                    { label: "Late", count: 1, color: "bg-[#f59e0b]" },
                    { label: "Half Day", count: 1, color: "bg-[#9ca3af]" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                        />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 grid grid-cols-2 text-center gap-4">
                  <div>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      24
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      Total Days
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      20
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      Present Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                Payroll Overview
              </h3>
              <button
                onClick={() => setActiveSection("Payroll")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                View Payslips
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
              Current employee record
            </p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {currentSalary}
            </p>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2.5 py-0.5">
                <Check className="h-3 w-3" /> Salary
              </span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                Loaded from employee record
              </p>
            </div>
            <div className="space-y-3.5 border-t border-gray-100 dark:border-gray-800/50 pt-5">
              {[
                {
                  label: "Designation",
                  val: profile.designation || "Not available",
                },
                {
                  label: "Department",
                  val: profile.department || "Not available",
                },
                { label: "Employee ID", val: profile.empId || "Not available" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {r.label}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {r.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                Leave Requests
              </h3>
              <button
                onClick={() => setActiveSection("Leave")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {displayLeaves.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No leave requests yet.
                </p>
              ) : (
                displayLeaves.map((req) => {
                  const leaveIcons = {
                    "Sick Leave": <Thermometer className="h-4 w-4" />,
                    "Casual Leave": <Coffee className="h-4 w-4" />,
                    "Annual Leave": <Palmtree className="h-4 w-4" />,
                    "Earned Leave": <Plane className="h-4 w-4" />,
                  };
                  return (
                    <div key={req._id || req.id} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {leaveIcons[req.type] || (
                          <ClipboardList className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-300">
                          {req.type}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                          {req.dates}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-medium rounded-full px-2 py-0.5 ${leaveBadge(req.status)}`}
                      >
                        {req.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <button
              onClick={() => setIsApplyLeaveOpen(true)}
              className="mt-5 w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition"
            >
              + Apply New Leave
            </button>
          </div>

          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                Announcements
              </h3>
              <button
                onClick={() => setActiveSection("Announcements")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement._id} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-300 leading-snug">
                      {announcement.headline}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(
                        announcement.createdAt || announcement.date,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No announcements yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-5">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: CalendarCheck,
                  label: "Mark Attendance",
                  color: "bg-emerald-50 dark:bg-emerald-900/20",
                  iconColor: "text-emerald-500 dark:text-emerald-400",
                  action: () => setIsCheckedIn(!isCheckedIn),
                },
                {
                  icon: FileText,
                  label: "Apply Leave",
                  color: "bg-blue-50 dark:bg-blue-900/20",
                  iconColor: "text-blue-500 dark:text-blue-400",
                  action: () => setIsApplyLeaveOpen(true),
                },
                {
                  icon: Download,
                  label: "Request Doc",
                  color: "bg-violet-50 dark:bg-violet-900/20",
                  iconColor: "text-violet-500 dark:text-violet-400",
                  action: () => setActiveSection("Documents"),
                },
                {
                  icon: Phone,
                  label: "Contact HR",
                  color: "bg-amber-50 dark:bg-amber-900/20",
                  iconColor: "text-amber-500 dark:text-amber-400",
                  action: () => {},
                },
              ].map((qa, i) => (
                <button
                  key={i}
                  onClick={qa.action}
                  className="flex flex-col items-center gap-2.5 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-gray-100 dark:border-gray-800/50"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${qa.color}`}
                  >
                    <qa.icon className={`h-5 w-5 ${qa.iconColor}`} />
                  </div>
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
                    {qa.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return renderDashboard();

      case "My Profile":
        return (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 sm:p-8 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-800/50">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600 text-3xl font-bold text-white shadow-soft">
                  {profile.firstName.charAt(0)}
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#151d2e]" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {profile.role}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Employee ID:{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {profile.empId}
                    </span>{" "}
                    • Joined {profile.joinDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  disabled={isEditingProfile}
                  className="sm:ml-auto rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                >
                  Edit Profile
                </button>
              </div>

              <form className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      disabled={!isEditingProfile}
                      value={profile.dateOfBirth}
                      onChange={(e) =>
                        setProfile({ ...profile, dateOfBirth: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Gender
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.gender}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Designation
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profile.designation}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2.5 text-xs text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditingProfile}
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!isEditingProfile}
                    onClick={() =>
                      (() => {
                        showToast("Profile updated successfully!", "success");
                        setIsEditingProfile(false);
                      })()
                    }
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "Attendance":
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Monthly Performance Index
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold mt-1 text-gray-800 dark:text-gray-100">
                  {profile.attendancePercentage}% Attendance Rate
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">
                  21 Days Present • 2 Days Late • 1 Day Absent out of 22 Working
                  Days
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCheckedIn(!isCheckedIn)}
                  className={`rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition ${isCheckedIn ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {isCheckedIn ? "Punch Out" : "Punch In"}
                </button>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col items-center justify-center">
                <h3 className="text-base font-semibold mb-4 self-start text-gray-800 dark:text-gray-100">
                  Attendance Ratio
                </h3>
                <div className="h-44 w-44 relative">
                  <Doughnut
                    data={{
                      labels: ["Present", "Late", "Absent"],
                      datasets: [
                        {
                          data: [21, 2, 1],
                          backgroundColor: ["#6366f1", "#f59e0b", "#f43f5e"],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      cutout: "74%",
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {profile.attendancePercentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Score
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-xs font-medium">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    21 Present
                  </span>
                  <span className="text-amber-500 dark:text-amber-400 font-semibold">
                    2 Late
                  </span>
                  <span className="text-rose-500 dark:text-rose-400 font-semibold">
                    1 Absent
                  </span>
                </div>
              </div>
              <div className="lg:col-span-2 rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Detailed Check-In Logs
                </h3>
                <div className="space-y-2.5">
                  {[
                    [
                      "Today, 24 Oct",
                      "09:02 AM",
                      "In Progress",
                      "6h 45m",
                      "Present (100%)",
                      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
                    ],
                    [
                      "Wed, 23 Oct",
                      "08:58 AM",
                      "06:12 PM",
                      "9h 14m",
                      "Present (100%)",
                      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
                    ],
                    [
                      "Tue, 22 Oct",
                      "09:35 AM",
                      "06:40 PM",
                      "9h 05m",
                      "Late (80%)",
                      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
                    ],
                    [
                      "Mon, 21 Oct",
                      "09:01 AM",
                      "06:05 PM",
                      "9h 04m",
                      "Present (100%)",
                      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
                    ],
                    [
                      "Fri, 18 Oct",
                      "09:00 AM",
                      "06:00 PM",
                      "9h 00m",
                      "Present (100%)",
                      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
                    ],
                  ].map(
                    (
                      [date, punchIn, punchOut, duration, status, badgeClass],
                      idx,
                    ) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-xs border border-gray-100/80 dark:border-gray-800/50"
                      >
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {date}
                        </span>
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 font-medium">
                          <span>In: {punchIn}</span>
                          <span>Out: {punchOut}</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {duration}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badgeClass}`}
                        >
                          {status}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "Leave":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Leave Tracker & Applications
                </h2>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5">
                  Apply for leaves and review granted requests
                </p>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-indigo-700 transition"
              >
                <Plus className="h-4 w-4" /> Apply Leave
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Casual Leave", "06 / 12", "6 days available"],
                ["Sick Leave", "05 / 08", "5 days available"],
                ["Earned Leave", "10 / 15", "10 days available"],
              ].map(([type, count, avail]) => (
                <div
                  key={type}
                  className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft"
                >
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {type}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {count}
                  </p>
                  <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    {avail}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">
                My Leave History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="border-b border-gray-100 dark:border-gray-800/50 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Dates</th>
                      <th className="pb-3">Reason</th>
                      <th className="pb-3">Document</th>
                      <th className="pb-3 text-right">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                    {leaveRequests.map((req) => (
                      <tr
                        key={req._id || req.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                      >
                        <td className="py-3.5 font-medium text-gray-700 dark:text-gray-300">
                          {req.type}
                        </td>
                        <td className="py-3.5 text-gray-600 dark:text-gray-300 font-medium">
                          {req.fromDate} - {req.toDate}
                        </td>
                        <td className="py-3.5 text-gray-500 dark:text-gray-400">
                          <div>{req.reason}</div>
                          {req.status === "Rejected" && req.rejectionReason && (
                            <div className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                              Rejection reason: {req.rejectionReason}
                            </div>
                          )}
                        </td>
                        {req.documentLink ? (
                          <td className="py-3.5">
                            <button className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition">
                              <a
                                href={req.documentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                View Document
                              </a>
                            </button>
                          </td>
                        ) : (
                          <td className="py-3.5 text-gray-500 dark:text-gray-400">
                            No document
                          </td>
                        )}
                        <td className="py-3.5 text-right">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${leaveBadge(req.status)}`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {req.status === "Pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteLeave(req._id || req.id)
                                }
                                aria-label={`Delete ${req.type} leave request`}
                                title="Delete leave request"
                                className="inline-flex rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditLeave(req)}
                                aria-label={`Edit ${req.type} leave request`}
                                title="Edit leave request"
                                className="inline-flex rounded-lg p-2 text-blue-500 transition hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                              >
                                <FilePenIcon className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Tasks":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Assigned Deliverables
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Track and update sprint tasks
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Assigned Task
                      </span>
                      <span className="rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 text-[10px] font-semibold">
                        {task.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Deadline: {task.deadline || "Not set"}
                    </span>
                    <button
                      onClick={() => handleTaskStatusChange(task)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-soft transition ${task.status === "Completed" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                    >
                      {task.status === "Completed"
                        ? "Completed"
                        : "Mark Complete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Payroll":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Payroll & Payslips
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Download your salary statements and tax reports
              </p>
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  Recent Payslips
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Year 2025 ▾
                </span>
              </div>
              <div className="space-y-3">
                {["April 2025", "March 2025", "February 2025"].map(
                  (month, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-[#0c1222] hover:bg-gray-100 dark:hover:bg-gray-800/80 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Payslip - {month}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            Generated on 1st {month}
                          </p>
                        </div>
                      </div>
                      <button className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-6">
                CTC Structure Overview
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-100 dark:border-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    Gross Earnings
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                    ₹1,20,833
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-100 dark:border-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    Deductions (PF + Tax)
                  </p>
                  <p className="text-xl font-bold text-rose-500 dark:text-rose-400 mt-1">
                    - ₹18,400
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-100 dark:border-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    Net Take Home
                  </p>
                  <p className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mt-1">
                    ₹1,02,433
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "Documents":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Employee Documents
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official letters and credentials
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {documents.length === 0 ? (
                <div className="col-span-2 text-sm text-gray-500">No documents uploaded yet.</div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-4 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex justify-between items-center"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                          {doc.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 ml-8">{doc.documentType}</span>
                    </div>
                    <a
                      href={`http://localhost:3000${doc.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View / Download
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Alerts & Notifications
            </h2>
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex items-start gap-3"
              >
                <Bell className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                    {n.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {n.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case "Announcements":
        return (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Announcements
            </h2>
            {announcements.length === 0 ? (
              <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft text-sm text-gray-500 dark:text-gray-400">
                No announcements yet.
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft"
                >
                  <span className="text-[10px] font-semibold text-indigo-500 uppercase">
                    Notice
                  </span>
                  <h4 className="text-base font-semibold mt-1 text-gray-800 dark:text-gray-100">
                    {announcement.headline}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">
                    {announcement.body}
                  </p>
                </div>
              ))
            )}
          </div>
        );

      case "Projects":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  My Projects
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showcase your work and uploaded projects
                </p>
              </div>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-indigo-700 transition"
              >
                <Plus className="h-4 w-4" /> Upload Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No projects uploaded yet. Click on "Upload Project" to add
                  one!
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
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                      {project.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex flex-wrap gap-3">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        >
                          <GithubIcon className="h-3.5 w-3.5" />
                          GitHub
                        </a>
                      )}
                      {project.linkedinLink && (
                        <a
                          href={project.linkedinLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <LinkedinIcon className="h-3.5 w-3.5" />
                          LinkedIn
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Live Link
                        </a>
                      )}
                    </div>
                    {project.score && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                          Review Score:{" "}
                          <span className="text-indigo-600 dark:text-indigo-400">
                            {project.score}/5
                          </span>
                        </p>
                        {project.feedback && (
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 italic">
                            "{project.feedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}

      <Modal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        title="Apply for Leave"
        footer={
          <>
            <button
              onClick={() => setIsApplyLeaveOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyLeave}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-soft"
            >
              Submit Application
            </button>
          </>
        }
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Leave Type
            </label>
            <select
              value={newLeave.type}
              onChange={(e) =>
                setNewLeave({ ...newLeave, type: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Select Leave Type</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={newLeave.fromDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, fromDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={newLeave.toDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, toDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Reason for Leave
            </label>
            <textarea
              rows={3}
              value={newLeave.reason}
              onChange={(e) =>
                setNewLeave({ ...newLeave, reason: e.target.value })
              }
              placeholder="Provide reason for time off..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          {newLeave.type === "Sick Leave" && (
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Google Drive link for medical certificate (if any)
              </label>
              <input
                type="text"
                value={newLeave.documentLink}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, documentLink: e.target.value })
                }
                placeholder="Paste the link to your medical certificate..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={isEditLeaveOpen}
        onClose={() => setIsEditLeaveOpen(false)}
        title="Edit Leave Request"
        footer={
          <>
            <button
              onClick={() => setIsEditLeaveOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateLeave}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-soft"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleUpdateLeave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Leave Type
            </label>
            <select
              value={newLeave.type}
              onChange={(e) =>
                setNewLeave({ ...newLeave, type: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Select Leave Type</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={newLeave.fromDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, fromDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={newLeave.toDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, toDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Reason for Leave
            </label>
            <textarea
              rows={3}
              value={newLeave.reason}
              onChange={(e) =>
                setNewLeave({ ...newLeave, reason: e.target.value })
              }
              placeholder="Provide reason for time off..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          {newLeave.type === "Sick Leave" && (
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Google Drive link for medical certificate (if any)
              </label>
              <input
                type="url"
                value={newLeave.documentLink}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, documentLink: e.target.value })
                }
                placeholder="Paste the link to your medical certificate..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        title="Add New Project"
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              onClick={() => setIsAddProjectOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProject}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-soft"
            >
              Upload Project
            </button>
          </>
        }
      >
        <form onSubmit={handleAddProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm({ ...projectForm, title: e.target.value })
              }
              placeholder="e.g. AI-Powered Resume Screener"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Project Content / Overview
            </label>
            <textarea
              rows={3}
              value={projectForm.content}
              onChange={(e) =>
                setProjectForm({ ...projectForm, content: e.target.value })
              }
              placeholder="Describe the project architecture, features, and technologies used..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800/50">
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <GithubIcon className="h-3.5 w-3.5" /> GitHub Repository Link
              </label>
              <input
                type="url"
                value={projectForm.githubLink}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, githubLink: e.target.value })
                }
                placeholder="https://github.com/username/project"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <svg
                  className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>{" "}
                Live Link (Optional)
              </label>
              <input
                type="url"
                value={projectForm.liveLink}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    liveLink: e.target.value,
                  })
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <LinkedinIcon className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />{" "}
                LinkedIn Post Link
              </label>
              <input
                type="url"
                value={projectForm.linkedinLink}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    linkedinLink: e.target.value,
                  })
                }
                placeholder="https://linkedin.com/posts/..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EmployeeContent;
