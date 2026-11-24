import { useState, useEffect } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Calendar,
  Clock,
  ListChecks,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Bell,
  Megaphone,
  FileText,
  Check,
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
  Camera,
  User,
} from "lucide-react";
import { auth, employee, api } from "../apis/axios";
import WebcamCapture from "../components/WebcamCapture";
import { useSocket } from "../context/SocketContext";

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
import MetricStatCard from "../components/MetricStatCard";

import { useToast } from "../components/ToastProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeContent = ({ activeSection, setActiveSection, userDetails }) => {
  const { showToast } = useToast();
  const socket = useSocket();

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
    fetchAttendanceLogs();
    fetchTodayAttendance();
  }, []);

  const [newLeave, setNewLeave] = useState({
    type: " ",
    fromDate: "",
    toDate: "",
    reason: "",
    documentLink: "",
  });

  const [tasks, setTasks] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [clockNow, setClockNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatRealtimeDuration = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getLiveWorkingMilliseconds = () => {
    if (!todayAttendance?.checkInTime || todayAttendance.checkOutTime) {
      return (todayAttendance?.workingDurationSeconds ?? (todayAttendance?.workingDurationMinutes || 0) * 60) * 1000;
    }
    const elapsed = Math.max(0, clockNow - new Date(todayAttendance.checkInTime));
    return Math.max(0, elapsed - getLiveBreakMilliseconds());
  };

  const getLiveBreakMilliseconds = () => {
    if (!todayAttendance?.breaks) {
      return (todayAttendance?.breakDurationSeconds ?? (todayAttendance?.breakDurationMinutes || 0) * 60) * 1000;
    }
    const completed = todayAttendance.breaks
      .filter((item) => item.endTime)
      .reduce((total, item) => {
        const seconds = Number.isFinite(item.durationSeconds)
          ? item.durationSeconds
          : (item.durationMinutes || 0) * 60;
        return total + seconds * 1000;
      }, 0);
    const active = todayAttendance.breaks.find((item) => !item.endTime);
    const activeMilliseconds = active
      ? Math.max(0, clockNow - new Date(active.startTime))
      : 0;
    return completed + activeMilliseconds;
  };

  const fetchAttendanceLogs = async () => {
    try {
      const response = await api.get("/attendance/me");
      if (response.data.success) {
        setAttendanceLogs(response.data.attendance);
      }
    } catch (error) {
      console.error("Error fetching attendance logs:", error);
    }
  };

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

  const [isWebcamCheckInOpen, setIsWebcamCheckInOpen] = useState(false);

  const handlePunch = async () => {
    // Open Webcam Check-in/out Modal
    setIsWebcamCheckInOpen(true);
  };

  const handleStartBreak = async () => {
    try {
      const response = await api.post("/attendance/break/start");
      if (response.data.success) {
        showToast(response.data.message, "success");
        await fetchTodayAttendance();
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Could not start break.", "error");
    }
  };

  const handleEndBreak = async () => {
    try {
      const response = await api.post("/attendance/break/end");
      if (response.data.success) {
        showToast(response.data.message, "success");
        await fetchTodayAttendance();
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Could not end break.", "error");
    }
  };

  const handleWebcamCapture = async (descriptor, setStatus) => {
    try {
      setStatus("Verifying identity...", false);
      const res = await api.post("/attendance/checkin-webcam", {
        faceDescriptor: descriptor,
      });

      if (res.data.success) {
        setStatus("Attendance marked successfully", false);
        showToast(res.data.message || "Attendance updated", "success");
        setTimeout(() => setIsWebcamCheckInOpen(false), 1500);
        fetchTodayAttendance();
        fetchAttendanceLogs();
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

  const openDocument = async (documentId) => {
    try {
      const response = await api.get(`/documents/download/${documentId}`);
      if (response.data.success) {
        window.open(response.data.downloadUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error opening document:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDocuments();
    fetchNotifications();
  }, [userDetails]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((current) => [notification, ...current].slice(0, 5));
      showToast(notification.title || "New notification", "info");
    };

    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, showToast]);

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
  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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
        "bg-blue-50 text-blue-700 border border-blue-200/60",
      Pending:
        "bg-amber-50 text-[#D97706] border border-amber-200/60",
      "Not Started":
        "bg-slate-50 text-[#64748B] border border-slate-200/60",
      Completed:
        "bg-emerald-50 text-[#15803D] border border-emerald-200/60",
    };
    return (
      map[status] ||
      "bg-slate-50 text-[#64748B] border border-slate-200/60"
    );
  };

  const leaveBadge = (status) => {
    const map = {
      Approved:
        "bg-emerald-50 text-[#15803D] border border-emerald-200/60",
      Granted:
        "bg-emerald-50 text-[#15803D] border border-emerald-200/60",
      Rejected:
        "bg-rose-50 text-[#DC2626] border border-rose-200/60",
      Pending:
        "bg-amber-50 text-[#D97706] border border-amber-200/60",
    };
    return (
      map[status] ||
      "bg-slate-50 text-[#64748B] border border-slate-200/60"
    );
  };

  const renderDashboard = () => {
    const now = new Date();
    const activeTasks = tasks.filter((task) => task.status !== "Completed");
    const pendingLeaves = leaveRequests.filter(
      (leaveRequest) => leaveRequest.status === "Pending",
    );
    const approvedLeaves = leaveRequests.filter(
      (leaveRequest) => leaveRequest.status === "Approved" || leaveRequest.status === "Granted",
    );
    const currentSalary =
      typeof profile.salary === "number"
        ? `₹${profile.salary.toLocaleString("en-IN")}`
        : profile.salary || "Not available";
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Calendar grid calculation for current month
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString("en-US", { month: "long" });
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon = 0
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarGrid = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      calendarGrid.push({ day: null });
    }
    for (let day = 1; day <= totalDaysInMonth; day++) {
      // Find if there is an attendance record for this day
      const dayDateStr = new Date(year, month, day).toISOString().slice(0, 10);
      const isPastOrToday = day <= now.getDate();
      const isWeekend = (adjustedFirstDay + day - 1) % 7 >= 5;
      
      let status = "present";
      if (isWeekend) {
        status = "holiday";
      } else if (day === now.getDate() && !isCheckedIn) {
        status = "present";
      } else if (day % 7 === 3) {
        status = "leave";
      } else if (day % 11 === 0) {
        status = "absent";
      }

      calendarGrid.push({
        day,
        status: isPastOrToday ? status : isWeekend ? "holiday" : "none",
        isToday: day === now.getDate(),
      });
    }

    return (
      <div className="space-y-6">
        {/* Welcome Section Matching Reference Image */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Welcome back, {profile.firstName || userDetails?.name || "Akash"}!
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
              Have a productive day at work.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white border border-[#E3E7EB] text-xs font-semibold text-[#172033] shadow-subtle">
            <CalendarDays className="h-4 w-4 text-[#4F46E5]" />
            <span>{dateStr}</span>
          </div>
        </div>

        {/* 4 Summary Stat Cards matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricStatCard
            label="Leave Requests"
            value={`${leaveRequests.length}`}
            subtext="all requests"
            icon={CalendarDays}
            iconBg="bg-blue-50 text-blue-600"
          />
          <MetricStatCard
            label="Used Leave"
            value={`${approvedLeaves.length}`}
            subtext="days"
            icon={CalendarCheck}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <MetricStatCard
            label="Pending Approval"
            value={`${pendingLeaves.length}`}
            subtext={pendingLeaves.length === 1 ? "1 leave request" : `${pendingLeaves.length} leave requests`}
            badge={pendingLeaves.length > 0 ? "Pending" : null}
            badgeType="warning"
            icon={Clock}
            iconBg="bg-amber-50 text-amber-600"
          />
          <MetricStatCard
            label="Assigned Tasks"
            value={`${tasks.length}`}
            subtext={`${activeTasks.length} active tasks`}
            icon={ListChecks}
            iconBg="bg-indigo-50 text-[#4F46E5]"
          />
        </div>

        {/* Middle Row (3-Column Layout from Reference Image) */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          
          {/* 1. Attendance Overview Card */}
          <div className="rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#172033]">
                  Attendance Overview
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#172033]">
                  <span>{monthName} {year}</span>
                </div>
              </div>

              {/* Day header */}
              <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-[#667085] mb-2 border-b border-[#E3E7EB]/70 pb-1.5">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* Mini Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {calendarGrid.slice(0, 28).map((cell, idx) => (
                  <div key={idx} className="h-7 flex items-center justify-center relative">
                    {cell.day && (
                      <span
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-medium transition ${
                          cell.isToday
                            ? 'bg-[#4F46E5] text-white font-bold shadow-xs'
                            : 'text-[#172033] hover:bg-[#F6F7FB]'
                        }`}
                      >
                        {cell.day}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Legend matching reference image */}
            <div className="pt-4 mt-3 border-t border-[#E3E7EB] grid grid-cols-2 gap-2 text-[11px] text-[#667085]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Holiday</span>
              </div>
            </div>
          </div>

          {/* 2. My Tasks Widget matching reference image */}
          <div className="rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#172033]">
                  My Tasks
                </h3>
                <button
                  onClick={() => setActiveSection("Tasks")}
                  className="text-xs font-semibold text-[#4F46E5] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-xs text-[#667085] text-center py-6">
                    No tasks assigned yet.
                  </p>
                ) : (
                  tasks.slice(0, 4).map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#F6F7FB] transition border border-transparent hover:border-[#E3E7EB]"
                    >
                      <label className="flex items-center gap-2.5 min-w-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={task.status === "Completed"}
                          onChange={() => handleTaskStatusChange(task)}
                          className="h-4 w-4 rounded text-[#4F46E5] border-gray-300 focus:ring-[#4F46E5] cursor-pointer"
                        />
                        <span
                          className={`text-xs font-medium truncate ${
                            task.status === "Completed"
                              ? "line-through text-gray-400"
                              : "text-[#172033]"
                          }`}
                        >
                          {task.title}
                        </span>
                      </label>
                      <span
                        className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          task.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {task.status === "Completed" ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveSection("Tasks")}
              className="mt-4 w-full text-center text-xs font-semibold text-[#4F46E5] py-2 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 transition"
            >
              Open Tasks Workspace
            </button>
          </div>

          {/* 3. Recent Announcements Widget matching reference image */}
          <div className="rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#172033]">
                  Recent Announcements
                </h3>
                <button
                  onClick={() => setActiveSection("Announcements")}
                  className="text-xs font-semibold text-[#4F46E5] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3.5">
                {announcements.length === 0 ? (
                  <p className="text-xs text-[#667085] text-center py-6">
                    No announcements published.
                  </p>
                ) : (
                  announcements.slice(0, 3).map((item, idx) => {
                    const iconList = [
                      <PartyPopper key={1} className="h-4 w-4 text-rose-500" />,
                      <CalendarDays key={2} className="h-4 w-4 text-blue-500" />,
                      <FileText key={3} className="h-4 w-4 text-emerald-500" />,
                    ];
                    const bgList = ["bg-rose-50", "bg-blue-50", "bg-emerald-50"];

                    return (
                      <div key={item._id || idx} className="flex items-start gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bgList[idx % 3]}`}>
                          {iconList[idx % 3]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-[#172033] truncate">
                              {item.headline || item.title}
                            </p>
                            <span className="text-[10px] text-[#667085] shrink-0 font-medium">
                              {new Date(item.createdAt || item.date || Date.now()).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#667085] mt-0.5 line-clamp-1">
                            {item.description || item.content || "Important company notification"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveSection("Announcements")}
              className="mt-4 w-full text-center text-xs font-semibold text-[#667085] py-2 rounded-lg bg-[#F6F7FB] hover:bg-[#E3E7EB]/50 transition"
            >
              Browse All Notices
            </button>
          </div>
        </div>

        {/* Bottom Section: Quick Actions & Personal Payroll Info */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card">
            <h3 className="text-sm font-bold text-[#172033] mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: CalendarCheck,
                  label: isCheckedIn ? "Checked In" : "Punch In",
                  sub: isCheckedIn ? "Active" : "Webcam Face",
                  color: "bg-emerald-50 text-emerald-600",
                  action: handlePunch,
                },
                {
                  icon: FileText,
                  label: "Apply Leave",
                  sub: "Request Off",
                  color: "bg-blue-50 text-blue-600",
                  action: () => setIsApplyLeaveOpen(true),
                },
                {
                  icon: Download,
                  label: "Documents",
                  sub: "Payslips & Files",
                  color: "bg-violet-50 text-violet-600",
                  action: () => setActiveSection("Documents"),
                },
                {
                  icon: Phone,
                  label: "Contact HR",
                  sub: "Assistance",
                  color: "bg-amber-50 text-amber-600",
                  action: () => setActiveSection("Help & Support"),
                },
              ].map((qa, i) => (
                <button
                  key={i}
                  onClick={qa.action}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-[#E3E7EB] hover:bg-[#F6F7FB] transition text-center hover:shadow-subtle"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${qa.color}`}>
                    <qa.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#172033]">{qa.label}</p>
                    <p className="text-[10px] text-[#667085] font-medium">{qa.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 border border-[#E3E7EB] shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#172033]">
                Payroll Summary
              </h3>
              <button
                onClick={() => setActiveSection("Payroll")}
                className="text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                Payslips →
              </button>
            </div>
            <p className="text-xs text-[#667085] font-medium">Monthly Compensation</p>
            <p className="text-2xl font-bold text-[#172033] mt-1">{currentSalary}</p>
            <div className="mt-4 pt-3 border-t border-[#E3E7EB] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#667085]">Designation</span>
                <p className="font-semibold text-[#172033] truncate">{profile.designation || "Employee"}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#667085]">Department</span>
                <p className="font-semibold text-[#172033] truncate">{profile.department || "General"}</p>
              </div>
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
            <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 border border-[#E4E7EC] shadow-card">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-[#E4E7EC]">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-[#4F46E5] text-3xl font-bold text-white shadow-soft">
                  {profile.firstName.charAt(0)}
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-[#172033]">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-sm font-semibold text-[#4F46E5]">
                    {profile.role}
                  </p>
                  <p className="text-xs text-[#667085] mt-1 font-medium">
                    Employee ID:{" "}
                    <span className="font-semibold text-[#172033]">
                      {profile.empId}
                    </span>{" "}
                    • Joined {profile.joinDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  disabled={isEditingProfile}
                  className="sm:ml-auto rounded-xl border border-[#4F46E5]/20 bg-[#F1F3FF] px-4 py-2 text-xs font-semibold text-[#4F46E5] transition hover:bg-[#E5E9FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit Profile
                </button>
              </div>

              <form className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 disabled:bg-gray-100 disabled:text-[#667085]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 disabled:bg-gray-100 disabled:text-[#667085]"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 disabled:bg-gray-100 disabled:text-[#667085]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      disabled={!isEditingProfile}
                      value={profile.dateOfBirth}
                      onChange={(e) =>
                        setProfile({ ...profile, dateOfBirth: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 disabled:bg-gray-100 disabled:text-[#667085]"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Gender
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profile.gender}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 disabled:bg-gray-100 disabled:text-[#667085]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                      Designation
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profile.designation}
                      className="w-full rounded-xl border border-[#E4E7EC] bg-gray-100 p-2.5 text-xs text-[#667085] cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditingProfile}
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 disabled:bg-gray-100 disabled:text-[#667085]"
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
                    className="rounded-xl bg-[#4F46E5] px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="rounded-xl bg-white p-4 sm:p-6 border border-[#E4E7EC] shadow-card flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
                  Monthly Performance Index
                </span>
                <h3 className="text-2xl sm:text-4xl font-bold mt-1 text-[#172033]">
                  {profile.attendancePercentage}% Attendance Rate
                </h3>
              </div>
              <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                {(!todayAttendance || !todayAttendance.checkInTime) ? (
                  <button
                    onClick={handlePunch}
                    className="rounded-xl px-5 sm:px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition bg-[#4F46E5] hover:bg-[#4338CA]"
                  >
                    Punch In
                  </button>
                ) : (!todayAttendance.checkOutTime) ? (
                  <>
                    {todayAttendance.isOnBreak ? (
                      <button
                        onClick={handleEndBreak}
                        className="rounded-xl px-4 sm:px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition bg-[#15803D] hover:bg-[#166534]"
                      >
                        End Break
                      </button>
                    ) : (
                      <button
                        onClick={handleStartBreak}
                        className="rounded-xl px-4 sm:px-5 py-2.5 text-xs font-semibold text-[#92400E] shadow-soft transition bg-amber-100 hover:bg-amber-200"
                      >
                        Take Break
                      </button>
                    )}
                    <button
                      onClick={handlePunch}
                      className="rounded-xl px-5 sm:px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition bg-[#DC2626] hover:bg-[#B91C1C]"
                    >
                      Punch Out
                    </button>
                  </>
                ) : (
                  <span className="text-[#15803D] font-semibold text-xs flex items-center bg-emerald-50 border border-emerald-200/60 px-4 py-2 rounded-xl">
                    Attendance Completed
                  </span>
                )}
              </div>
            </div>
            {todayAttendance?.checkInTime && !todayAttendance.checkOutTime && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#667085]">Working Time</p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-[#172033]">{formatRealtimeDuration(getLiveWorkingMilliseconds())}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Break Time</p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-amber-800">{formatRealtimeDuration(getLiveBreakMilliseconds())}</p>
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-4 sm:p-6 border border-[#E4E7EC] shadow-card flex flex-col items-center justify-center">
                <h3 className="text-base font-bold mb-4 self-start text-[#172033]">
                  Attendance Ratio
                </h3>
                <div className="h-44 w-44 relative">
                  <Doughnut
                    data={{
                      labels: ["Present", "Absent"],
                      datasets: [
                        {
                          data: [profile.attendancePercentage, 100 - (profile.attendancePercentage || 0)],
                          backgroundColor: ["#4F46E5", "#F43F5E"],
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
                    <span className="text-2xl font-bold text-[#172033]">
                      {profile.attendancePercentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-[#667085] uppercase">
                      Score
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 rounded-xl bg-white p-4 sm:p-6 border border-[#E4E7EC] shadow-card">
                <h3 className="text-base font-bold mb-4 text-[#172033]">
                  Detailed Check-In Logs
                </h3>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {attendanceLogs.map((log, idx) => {
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
                    let badgeClass = "bg-[#F1F3FF] text-[#4F46E5] border border-indigo-200/60";
                    if (log.checkInTime && log.checkOutTime) {
                      statusText += " (100%)";
                      badgeClass = "bg-emerald-50 text-[#15803D] border border-emerald-200/60";
                    } else if (!log.checkInTime && !log.checkOutTime && log.status === "Absent") {
                      statusText += " (0%)";
                      badgeClass = "bg-rose-50 text-[#DC2626] border border-rose-200/60";
                    } else {
                      statusText += " (Incomplete)";
                    }

                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-[#F8FAFC] p-3 text-xs border border-[#E4E7EC]"
                      >
                        <span className="font-semibold text-[#172033]">
                          {date}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[#667085] font-medium text-xs">
                          <span>In: <strong className="text-[#172033] font-semibold">{punchIn}</strong></span>
                          <span>Out: <strong className="text-[#172033] font-semibold">{punchOut}</strong></span>
                          <span className="font-semibold text-[#172033]">
                            Working: {duration}
                          </span>
                          <span className="font-semibold text-amber-700">
                            Break: {breakDuration}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold self-start sm:self-auto ${badgeClass}`}
                        >
                          {statusText}
                        </span>
                      </div>
                    );
                  })}
                  {attendanceLogs.length === 0 && (
                     <div className="text-sm text-[#667085] text-center py-4">No attendance logs found.</div>
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
                <h2 className="text-2xl font-bold text-[#172033]">
                  Leave Tracker & Applications
                </h2>
                <p className="text-xs font-medium text-[#667085] mt-0.5">
                  Apply for leaves and review granted requests
                </p>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-[#4338CA] transition"
              >
                <Plus className="h-4 w-4" /> Apply Leave
              </button>
            </div>
            
            {/* 3 Leave Summary Cards */}
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
              {[
                { type: "Casual Leave", count: "06 / 12", avail: "6 days available", icon: Coffee, iconColor: "text-blue-600 bg-blue-50" },
                { type: "Sick Leave", count: "05 / 08", avail: "5 days available", icon: Thermometer, iconColor: "text-amber-600 bg-amber-50" },
                { type: "Earned Leave", count: "10 / 15", avail: "10 days available", icon: Palmtree, iconColor: "text-emerald-600 bg-emerald-50" },
              ].map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.type}
                    className="rounded-xl bg-white p-4 sm:p-5 border border-[#E4E7EC] shadow-card hover:shadow-elevated transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#667085]">
                        {card.type}
                      </p>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconColor}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-[#172033]">
                      {card.count}
                    </p>
                    <p className="mt-1 text-[11px] text-[#4F46E5] font-semibold">
                      {card.avail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* My Leave History Section */}
            <div className="rounded-xl bg-white p-4 sm:p-6 border border-[#E4E7EC] shadow-card">
              <h3 className="text-base font-bold mb-4 text-[#172033]">
                My Leave History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="border-b border-[#E4E7EC] text-xs font-semibold uppercase tracking-wider text-[#667085] bg-[#F8FAFC]">
                    <tr>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Dates</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Document</th>
                      <th className="py-3 px-4 text-right">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E7EC]">
                    {leaveRequests.map((req) => (
                      <tr
                        key={req._id || req.id}
                        className="hover:bg-[#F1F3FF] transition"
                      >
                        <td className="py-3.5 px-4 font-semibold text-[#172033]">
                          {req.type}
                        </td>
                        <td className="py-3.5 px-4 text-[#667085] font-medium text-xs">
                          {req.fromDate} - {req.toDate}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B] text-xs">
                          <div>{req.reason}</div>
                          {req.status === "Rejected" && req.rejectionReason && (
                            <div className="mt-1 text-xs text-[#DC2626] font-medium">
                              Rejection reason: {req.rejectionReason}
                            </div>
                          )}
                        </td>
                        {req.documentLink ? (
                          <td className="py-3.5 px-4">
                            <a
                              href={req.documentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F1F3FF] px-2.5 py-1 text-xs font-semibold text-[#4F46E5] hover:bg-[#E5E9FF] transition"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              View Document
                            </a>
                          </td>
                        ) : (
                          <td className="py-3.5 px-4 text-[#667085] text-xs">
                            No document
                          </td>
                        )}
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${leaveBadge(req.status)}`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {req.status === "Pending" ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteLeave(req._id || req.id)
                                }
                                aria-label={`Delete ${req.type} leave request`}
                                title="Delete leave request"
                                className="inline-flex rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditLeave(req)}
                                aria-label={`Edit ${req.type} leave request`}
                                title="Edit leave request"
                                className="inline-flex rounded-lg p-1.5 text-[#4F46E5] transition hover:bg-indigo-50"
                              >
                                <FilePenIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">
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
              <h2 className="text-xl font-bold text-[#172033]">
                Assigned Deliverables
              </h2>
              <p className="text-xs text-[#667085]">
                Track and update sprint tasks
              </p>
            </div>
            <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-xl bg-white p-4 sm:p-5 border border-[#E4E7EC] shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
                        Assigned Task
                      </span>
                      <span className="rounded-full bg-amber-50 text-[#D97706] border border-amber-200/60 px-2 py-0.5 text-[10px] font-semibold">
                        {task.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#172033]">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-xs text-[#64748B]">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#E4E7EC] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-[#667085] font-medium">
                      Deadline: {task.deadline || "Not set"}
                    </span>
                    <button
                      onClick={() => handleTaskStatusChange(task)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-soft transition ${task.status === "Completed" ? "bg-emerald-50 text-[#15803D] border border-emerald-200/60" : "bg-[#4F46E5] hover:bg-[#4338CA] text-white"}`}
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
              <h2 className="text-xl font-bold text-[#172033]">
                Payroll & Payslips
              </h2>
              <p className="text-xs text-[#667085]">
                Download your salary statements and tax reports
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 sm:p-6 border border-[#E4E7EC] shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-[#172033]">
                  Recent Payslips
                </h3>
                <span className="text-xs text-[#667085] font-semibold">
                  Year 2025 ▾
                </span>
              </div>
              <div className="space-y-3">
                {["April 2025", "March 2025", "February 2025"].map(
                  (month, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] hover:bg-[#F1F3FF] transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F3FF] text-[#4F46E5]">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-[#172033] truncate">
                            Payslip - {month}
                          </p>
                          <p className="text-[10px] text-[#667085] truncate">
                            Generated on 1st {month}
                          </p>
                        </div>
                      </div>
                      <button className="flex items-center justify-center h-8 w-8 shrink-0 rounded-lg bg-white border border-[#E4E7EC] text-[#64748B] hover:text-[#4F46E5] hover:bg-[#F1F3FF] transition">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 sm:p-6 border border-[#E4E7EC] shadow-card">
              <h3 className="text-base font-bold text-[#172033] mb-4 sm:mb-6">
                CTC Structure Overview
              </h3>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                  <p className="text-[#667085] text-xs font-semibold">
                    Gross Earnings
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-[#172033] mt-1">
                    ₹1,20,833
                  </p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                  <p className="text-[#667085] text-xs font-semibold">
                    Deductions (PF + Tax)
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-[#DC2626] mt-1">
                    - ₹18,400
                  </p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                  <p className="text-[#667085] text-xs font-semibold">
                    Net Take Home
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-[#15803D] mt-1">
                    ₹1,02,433
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "Documents":
        return (
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#172033]">
                Employee Documents
              </h2>
              <p className="text-xs text-[#667085]">
                Official letters and credentials
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {documents.length === 0 ? (
                <div className="col-span-2 text-sm text-[#667085] p-6 bg-white rounded-xl border border-[#E4E7EC] text-center">No documents uploaded yet.</div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E4E7EC] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F3FF] text-[#4F46E5]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="truncate text-xs font-bold text-[#172033]">
                          {doc.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#667085] ml-10 sm:ml-12 font-medium">{doc.documentType}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openDocument(doc._id)}
                      className="text-xs font-semibold text-[#4F46E5] hover:underline bg-[#F1F3FF] px-3 py-1.5 rounded-lg transition self-start sm:self-auto shrink-0"
                    >
                      View / Download
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-[#172033]">
              Alerts & Notifications
            </h2>
            {notifications.length === 0 ? (
              <div className="p-6 rounded-xl bg-white border border-[#E4E7EC] text-sm text-[#667085] text-center">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="p-4 rounded-xl bg-white border border-[#E4E7EC] shadow-card flex items-start gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F3FF] text-[#4F46E5] mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#172033]">
                      {n.title}
                    </h4>
                    <p className="text-xs text-[#667085] mt-0.5">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case "Announcements":
        return (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold text-[#172033]">
              Announcements
            </h2>
            {announcements.length === 0 ? (
              <div className="p-6 rounded-xl bg-white border border-[#E4E7EC] shadow-card text-sm text-[#667085] text-center">
                No announcements yet.
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="p-5 rounded-xl bg-white border border-[#E4E7EC] shadow-card"
                >
                  <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider bg-[#F1F3FF] px-2 py-0.5 rounded-md">
                    Notice
                  </span>
                  <h4 className="text-base font-bold mt-2 text-[#172033]">
                    {announcement.headline}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1.5 font-medium leading-relaxed">
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
                <h2 className="text-xl font-bold text-[#172033]">
                  My Projects
                </h2>
                <p className="text-xs text-[#667085]">
                  Showcase your work and uploaded projects
                </p>
              </div>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-[#4338CA] transition"
              >
                <Plus className="h-4 w-4" /> Upload Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white border border-[#E4E7EC] shadow-card">
                <p className="text-sm text-[#667085]">
                  No projects uploaded yet. Click on "Upload Project" to add
                  one!
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex flex-col rounded-xl bg-white p-4 sm:p-5 border border-[#E4E7EC] shadow-card hover:shadow-elevated transition"
                  >
                    <h3 className="text-base font-bold text-[#172033]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#64748B] line-clamp-3">
                      {project.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#E4E7EC] flex flex-wrap gap-3">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#172033] hover:text-[#4F46E5] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E4E7EC] transition"
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
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 transition"
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
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition"
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
                      <div className="mt-4 pt-4 border-t border-[#E4E7EC] bg-[#F8FAFC] p-3 rounded-lg">
                        <p className="text-xs font-semibold text-[#172033]">
                          Review Score:{" "}
                          <span className="text-[#4F46E5] font-bold">
                            {project.score}/5
                          </span>
                        </p>
                        {project.feedback && (
                          <p className="text-[11px] text-[#64748B] mt-1.5 italic">
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
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F1F3FF] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyLeave}
              className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] px-5 py-2 text-xs font-semibold text-white shadow-soft transition"
            >
              Submit Application
            </button>
          </>
        }
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172033] mb-1.5">
              Leave Type
            </label>
            <select
              value={newLeave.type}
              onChange={(e) =>
                setNewLeave({ ...newLeave, type: e.target.value })
              }
              className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 cursor-pointer"
            >
              <option value="">Select Leave Type</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={newLeave.fromDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, fromDate: e.target.value })
                }
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={newLeave.toDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, toDate: e.target.value })
                }
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-[#172033] mb-1.5">
              Reason for Leave
            </label>
            <textarea
              rows={3}
              value={newLeave.reason}
              onChange={(e) =>
                setNewLeave({ ...newLeave, reason: e.target.value })
              }
              placeholder="Provide reason for time off..."
              className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>
          {newLeave.type === "Sick Leave" && (
            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">
                Google Drive link for medical certificate (if any)
              </label>
              <input
                type="text"
                value={newLeave.documentLink}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, documentLink: e.target.value })
                }
                placeholder="Paste the link to your medical certificate..."
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
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
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F1F3FF] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateLeave}
              className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] px-5 py-2 text-xs font-semibold text-white shadow-soft transition"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleUpdateLeave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172033] mb-1.5">
              Leave Type
            </label>
            <select
              value={newLeave.type}
              onChange={(e) =>
                setNewLeave({ ...newLeave, type: e.target.value })
              }
              className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 cursor-pointer"
            >
              <option value="">Select Leave Type</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={newLeave.fromDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, fromDate: e.target.value })
                }
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={newLeave.toDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, toDate: e.target.value })
                }
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-[#172033] mb-1.5">
              Reason for Leave
            </label>
            <textarea
              rows={3}
              value={newLeave.reason}
              onChange={(e) =>
                setNewLeave({ ...newLeave, reason: e.target.value })
              }
              placeholder="Provide reason for time off..."
              className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>
          {newLeave.type === "Sick Leave" && (
            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">
                Google Drive link for medical certificate (if any)
              </label>
              <input
                type="url"
                value={newLeave.documentLink}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, documentLink: e.target.value })
                }
                placeholder="Paste the link to your medical certificate..."
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
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
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F1F3FF] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProject}
              className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] px-5 py-2 text-xs font-semibold text-white shadow-soft transition"
            >
              Upload Project
            </button>
          </>
        }
      >
        <form onSubmit={handleAddProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172033] mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm({ ...projectForm, title: e.target.value })
              }
              placeholder="e.g. AI-Powered Resume Screener"
              className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#172033] mb-1.5">
              Project Content / Overview
            </label>
            <textarea
              rows={3}
              value={projectForm.content}
              onChange={(e) =>
                setProjectForm({ ...projectForm, content: e.target.value })
              }
              placeholder="Describe the project architecture, features, and technologies used..."
              className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>
          <div className="space-y-3 pt-2 border-t border-[#E4E7EC]">
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-[#172033] mb-1.5">
                <GithubIcon className="h-3.5 w-3.5" /> GitHub Repository Link
              </label>
              <input
                type="url"
                value={projectForm.githubLink}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, githubLink: e.target.value })
                }
                placeholder="https://github.com/username/project"
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-[#172033] mb-1.5">
                <svg
                  className="h-3.5 w-3.5 text-emerald-600"
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
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-[#172033] mb-1.5">
                <LinkedinIcon className="h-3.5 w-3.5 text-blue-600" />{" "}
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
                className="w-full rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] font-medium outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Webcam Check-In Modal */}
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
          <p className="text-sm text-[#667085] mb-6 text-center">
            Look at the camera to mark your attendance.
          </p>
          {isWebcamCheckInOpen && (
            <WebcamCapture onCapture={handleWebcamCapture} mode="verify" />
          )}
        </div>
      </Modal>
    </>
  );
};

export default EmployeeContent;
