import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  UserCheck,
  Bell,
  Plus,
  Server,
  CheckCircle2,
  XCircle,
  Percent,
  UserPlus,
  FileText,
  FilePenIcon,
} from "lucide-react";

import MetricStatCard from "../components/MetricStatCard";
import TaskStatisticsCard from "../components/TaskStatisticsCard";
import PerformanceCard from "../components/PerformanceCard";
import Modal from "../components/Modal";
import { admin } from "../apis/axios.js";
import { useToast } from "../components/ToastProvider.jsx";


const AdminContent = ({ activeSection, setActiveSection, userDetails }) => {
  const { showToast } = useToast();

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const [isReviewProjectOpen, setIsReviewProjectOpen] = useState(false);
  const [reviewingProject, setReviewingProject] = useState(null);
  const [projectReviewForm, setProjectReviewForm] = useState({ score: "", feedback: "" });

  const fetchProjects = async () => {
    try {
      const response = await admin.get("/projects");
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [isBroadcastNoticeOpen, setIsBroadcastNoticeOpen] = useState(false);
  const [isProcessPayrollOpen, setIsProcessPayrollOpen] = useState(false);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false);
  const [rejectLeaveId, setRejectLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [departmentForm, setDepartmentForm] = useState({ name: "" });
  const [departments, setDepartments] = useState([]);
  const [assignableEmployees, setAssignableEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [noticesData, setNoticesData] = useState({
    headline: "",
    body: "",
  });
  const [announcements, setAnnouncements] = useState([]);
  const fetchAnnouncements = async () => {
    try {
      const response = await admin.get("/announcements");
      if (response.data.success) {
        setAnnouncements(response.data.announcements || []);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Normal",
    deadline: "",
    assignee: "",
  });
  const [userList, setUserList] = useState([]);

  // Persistent Employees State
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const fetchLeaveRequests = async () => {
    try {
      const response = await admin.get("/leave-requests");
      console.log("Leave Requests Response:", response.data);
      if (!response.data.success) {
        showToast("Failed to fetch leave requests", "error");
        return;
      }
      setLeaveRequests(response.data.leaveRequests);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      showToast("Error fetching leave requests", "error");
    }
  };

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

  const fetchUsers = async () => {
    try {
      const response = await admin.get("/users");
      if (response.data.success) {
        setUserList(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Error fetching users", "error");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await admin.get("/employees");
      if (response.data.success) {
        setEmployees(
          response.data.employees.map((employee) => ({
            ...employee,
            name: employee.userId?.name || "Unnamed employee",
            email: employee.userId?.email || "No email",
            role: employee.userId?.role || "employee",
            status: employee.userId?.isActive === false ? "Inactive" : "Active",
          })),
        );
      }
      console.log("Employees Response:", response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showToast("Error fetching employees", "error");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await admin.get("/departments");
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      showToast("Error fetching departments", "error");
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchTasks();
    fetchUsers();
    fetchEmployees();
    fetchDepartments();
    fetchAnnouncements();
    admin
      .get("/users")
      .then((response) => {
        setAssignableEmployees(
          (response.data.users || []).filter(
            (user) => user.role === "employee",
          ),
        );
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);



  // Users data

  // Add User Form State
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "employee",
  });

  // Add Employee Form State with all required fields
  const [employeeForm, setEmployeeForm] = useState({
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    department: "",
    designation: "",
    joiningDate: "",
    salary: "",
  });

  // Audit logs data
  const [auditLogs, setAuditLogs] = useState([]);

  const toggleUserStatus = async (id) => {
    try {
      await admin.put(`/toggle-user-status/${id}`);
      await fetchUsers();
    } catch (error) {
      showToast("Error toggling user status", "error");
      console.error("Error toggling user status:", error);
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

  // Grant Leave Handler
  const handleGrantLeave = async (leaveId) => {
    try {
      await admin.put(`/leave-requests/accept/${leaveId}`);
      await fetchLeaveRequests(); // Refresh leave requests from the server
      showToast("Leave request Granted!", "success");
    } catch (err) {
      console.error("Error granting leave:", err);
      showToast(err.response?.data?.message || "Error granting leave", "error");
    }
  };

  // Reject Leave Handler
  const handleRejectLeave = (leaveId) => {
    setRejectLeaveId(leaveId);
    setRejectionReason("");
  };

  const submitLeaveRejection = async (event) => {
    event.preventDefault();
    const reason = rejectionReason.trim();
    if (!reason) {
      showToast("Please provide a reason for rejecting this leave request.", "error");
      return;
    }

    try {
      await admin.put(`/leave-requests/reject/${rejectLeaveId}`, {
        rejectionReason: reason,
      });
      await fetchLeaveRequests(); // Refresh leave requests from the server
      setRejectLeaveId(null);
      setRejectionReason("");
      showToast("Leave request Rejected.", "error");
    } catch (err) {
      console.error("Error rejecting leave:", err);
      showToast(
        err.response?.data?.message || "Error rejecting leave",
        "error",
      );
    }
  };

  const handleAssignTask = async (event) => {
    event.preventDefault();
    if (!taskForm.title || !taskForm.assignee) {
      showToast("Task title and employee are required.", "error");
      return;
    }

    try {
      await admin.post("/tasks", taskForm);
      await fetchTasks();
      setTaskForm({
        title: "",
        description: "",
        priority: "Normal",
        deadline: "",
        assignee: "",
      });
      setIsAssignTaskOpen(false);
      showToast("Task assigned successfully.", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Unable to assign task.",
        "error",
      );
    }
  };

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      showToast("Please fill out the name and email address.", "error");
      return;
    }

    try {
      const displayRole =
        userForm.role === "employee"
          ? "Employee"
          : userForm.role === "hr"
            ? "hr"
            : "Admin";
      const payload = { ...userForm, role: displayRole };
      const response = await admin.post("/create-user", payload);

      const newUser = response.data.user || {
        id: Date.now(),
        name: userForm.name,
        email: userForm.email,
        role: displayRole,
        status: "Active",
        twoFa: false,
        lastLogin: "Just now",
      };

      setUserList([newUser, ...userList]);
      setEmployeeForm((prev) => ({
        ...prev,
        name: userForm.name,
        email: userForm.email,
        designation:
          displayRole === "Employee" ? "Software Engineer" : displayRole,
      }));

      setIsAddUserOpen(false);
      setIsAddEmployeeOpen(true);
      showToast(
        "User created successfully! Now add profile details.",
        "success",
      );
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Handle Add Employee Details
  const handleAddEmployee = async (e) => {
    try {
      e.preventDefault();
      if (!employeeForm.email || !employeeForm.phone) {
        showToast("Please fill out all required employee details.", "error");
        return;
      }
      if (editingEmployeeId) {
        await admin.put(`/employees/${editingEmployeeId}`, employeeForm);
      } else {
        const response = await admin.post("/create-employee", employeeForm);
        const selectedDepartment = departments.find(
          (department) => department.name === employeeForm.department,
        );
        if (selectedDepartment && response.data.employee?._id) {
          await admin.post("/assign-department", {
            employeeId: response.data.employee._id,
            departmentId: selectedDepartment._id,
          });
        }
      }
      await fetchEmployees();
      await fetchDepartments();
      setIsAddEmployeeOpen(false);
      setEditingEmployeeId(null);
      setEmployeeForm({
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "Male",
        address: "",
        department: "",
        designation: "",
        joiningDate: "",
        salary: "",
      });
      showToast(
        editingEmployeeId
          ? "Employee details updated successfully!"
          : "Employee details added successfully!",
        "success",
      );
    } catch (error) {
      console.error("Error adding employee details:", error);
      showToast("Error creating employee", "error");
    }
  };

  const onChangeBroadcastNotice = (e) => {
    setNoticesData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendBroadcastNotice = async () => {
    try {
      const response = await admin.post("/announcements", noticesData);
      if (response.data.success) {
        await fetchAnnouncements();
        showToast("Broadcast notice sent successfully!", "success");
        setNoticesData({ headline: "", body: "" });
      }
    } catch (error) {
      console.error("Error sending broadcast notice:", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployeeId(employee._id);
    setEmployeeForm({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      dateOfBirth: employee.dateOfBirth || "",
      gender: employee.gender || "male",
      address: employee.address || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joiningDate: employee.joiningDate || "",
      salary: employee.salary || "",
    });
    setIsAddEmployeeOpen(true);
  };

  const handleCreateDepartment = async (event) => {
    event.preventDefault();
    const name = departmentForm.name.trim();
    if (!name) {
      showToast("Department name is required.", "error");
      return;
    }

    try {
      await admin.post("/departments", { name });
      await fetchDepartments();
      setDepartmentForm({ name: "" });
      setIsCreateDepartmentOpen(false);
      showToast("Department created successfully.", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Unable to create department.",
        "error",
      );
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard": {
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                Good Morning,{" "}
                <span className="text-gray-800 dark:text-gray-100">{userDetails?.name?.split(' ')[0] || "Admin"}</span> !
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
                icon={Percent}
                value={`${employees.length > 0 ? Math.round(employees.reduce((acc, emp) => acc + (emp.attendancePercentage || 0), 0) / employees.length) : 0}%`}
                label="Overall Attendance"
              />
              <MetricStatCard
                icon={UserCheck}
                value={`${userList.length}`}
                label="Active Users"
              />
              <MetricStatCard
                icon={Server}
                value="99.9%"
                label="System Uptime"
              />
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 xl:grid-cols-[1.8fr_1.1fr]">
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      Active Portal Users
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Authenticated system accounts
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddUserOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-xs font-medium text-white transition"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add User / Employee
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-100/80 dark:border-gray-800/50 text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">
                      <tr>
                        <th className="pb-3">User</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">2FA</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/50">
                      {userList.map(
                        (u) => (
                          console.log("Rendering user:", u),
                          (
                            <tr
                              key={u._id}
                              className="text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                            >
                              <td className="py-3.5">
                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                  {u.name}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                  {u.email}
                                </p>
                              </td>
                              <td className="py-3.5 font-medium">{u.role}</td>
                              <td className="py-3.5">
                                <span
                                  className={`text-[10px] font-medium ${u.twoFa ? "text-emerald-500 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}
                                >
                                  {u.twoFa ? "Enabled" : "Off"}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                                    u.status === "Active"
                                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                      : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                  }`}
                                >
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => toggleUserStatus(u._id)}
                                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                  {u.status === "Active"
                                    ? "Suspend"
                                    : "Activate"}
                                </button>
                              </td>
                            </tr>
                          )
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Leave Requests for Admin Grant/Reject */}
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Leave Requests ({leaveRequests.length})
                  </h3>
                  <button
                    onClick={() => setActiveSection("Leave")}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {leaveRequests.map((req) => (
                    <div
                      key={req._id}
                      className="p-3.5 rounded-lg border border-gray-100/80 dark:border-gray-800/50 bg-gray-50/50 dark:bg-[#0c1222] text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {req.employeeId?.name || "Unknown Employee"} (
                            {req.employeeId?.email || "No email"})
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            {req.type} • {req.dates}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                            req.status === "Granted" ||
                            req.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : req.status === "Rejected"
                                ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-end gap-2 pt-2 border-t border-gray-100/80 dark:border-gray-800/50">
                        <button
                          onClick={() => handleRejectLeave(req._id)}
                          className="px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium text-[10px]"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleGrantLeave(req._id)}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[10px]"
                        >
                          Grant
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  Announcements
                </h3>
                <button
                  onClick={() => setActiveSection("Announcements")}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
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
                {announcements.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No announcements yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }

      case "Users":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Portal User Accounts
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add users and manage permissions
                </p>
              </div>
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition"
              >
                <Plus className="h-4 w-4" />
                Add User
              </button>
            </div>

            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="border-b border-gray-100/80 dark:border-gray-800/50 text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">
                  <tr>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">2FA</th>
                    <th className="pb-3">Last Login</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/50">
                  {userList.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                    >
                      <td className="py-3.5">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {u.email}
                        </p>
                      </td>
                      <td className="py-3.5 font-medium text-gray-700 dark:text-gray-300">
                        {u.role}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-medium ${u.twoFa ? "text-emerald-500 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}
                        >
                          {u.twoFa ? "Enforced" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-500 dark:text-gray-400 font-medium">
                        {u.lastLogin}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                            u.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => toggleUserStatus(u._id)}
                          className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Employees":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Organization Master Employee Records
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Complete staff profiles with phone, DOB, address, salary
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-medium text-white shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Add User
                </button>
                <button
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 text-xs font-medium shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Employee Details
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="border-b border-gray-100/80 dark:border-gray-800/50 text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">
                  <tr>
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Designation</th>
                    <th className="pb-3">Attendance %</th>
                    <th className="pb-3">Salary</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/50">
                  {employees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                    >
                      <td className="py-3.5">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {emp.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {emp.email}
                        </p>
                      </td>
                      <td className="py-3.5 text-gray-600 dark:text-gray-300 font-medium">
                        {emp.phone}
                      </td>
                      <td className="py-3.5 text-gray-600 dark:text-gray-300 font-medium">
                        {emp.department || "Unassigned"}
                      </td>
                      <td className="py-3.5 font-medium text-gray-700 dark:text-gray-300">
                        {emp.designation}
                      </td>
                      <td className="py-3.5">
                        <span className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                          {emp.attendancePercentage != null
                            ? `${emp.attendancePercentage}%`
                            : "Not available"}
                        </span>
                      </td>
                      <td className="py-3.5 font-medium text-emerald-600 dark:text-emerald-400">
                        {emp.salary != null ? `₹${emp.salary}` : "Not provided"}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditEmployee(emp)}
                            className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                          >
                            <FilePenIcon className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => setSelectedEmployeeDetails(emp)}
                            className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Leave":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Organization Leave Requests Management
              </h2>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                Admin oversight: Review, Grant or Reject any staff leave
              </p>
            </div>

            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">
                All Submitted Requests ({leaveRequests.length})
              </h3>

              <div className="space-y-4">
                {leaveRequests.map((req) => (
                  <div
                    key={req._id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-[#0c1222]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                          {req.employeeId?.name || "Unknown Employee"} (
                          {req.employeeId?.email || "No email"})
                        </h4>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            req.status === "Granted" ||
                            req.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : req.status === "Rejected"
                                ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">
                        <strong>{req.type}</strong>: {req.dates} ({req.days}{" "}
                        days)
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Reason: "{req.reason}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectLeave(req._id || req.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 transition"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      {req.documentLink && (
                        <a
                          href={req.documentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                        >
                          <FileText className="h-4 w-4" />
                          View Document
                        </a>
                      )}
                      <button
                        onClick={() => handleGrantLeave(req._id || req.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-sm transition"
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
        );

      case "Attendance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Master Attendance & Percentages
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  Average Organization Attendance
                </p>
                <p className="mt-2 text-3xl font-semibold text-emerald-500 dark:text-emerald-400">
                  95.2%
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  Total Work Days This Month
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-gray-100">
                  22 Days
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  Biometric Sync Status
                </p>
                <p className="mt-2 text-xl font-semibold text-indigo-500 dark:text-indigo-400">
                  All Terminals Online
                </p>
              </div>
            </div>
          </div>
        );

      case "HR Management":
        const hrUsers = userList.filter((u) => u.role === "hr");
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  HR Leadership & Permissions
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage Human Resources staff and authorities
                </p>
              </div>
              <button
                onClick={() => {
                  setUserForm({ name: "", email: "", role: "hr" });
                  setIsAddUserOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-medium text-white shadow-sm transition"
              >
                <UserPlus className="h-4 w-4" />
                Add HR Member
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hrUsers.map((hr, idx) => (
                <div
                  key={hr.id || idx}
                  className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col gap-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold">
                        {hr.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                          {hr.name}
                        </p>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            hr.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                          }`}
                        >
                          {hr.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium break-all">
                      {hr.email}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                      {idx === 0
                        ? "Head of HR • Full Authority"
                        : "HR Associate • Standard Authority"}
                    </p>
                  </div>
                </div>
              ))}
              {hrUsers.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm">
                  No HR members found. Add an HR member to delegate permissions.
                </div>
              )}
            </div>
          </div>
        );

      case "Departments":
        return (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Departments
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Create departments and manage employee assignment separately.
                </p>
              </div>
              <button
                onClick={() => setIsCreateDepartmentOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Create Department
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {departments.map((department) => (
                <div
                  key={department._id}
                  className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft"
                >
                  <Building2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mb-2" />
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {department.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {department.employees?.length || 0} employee(s)
                  </p>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="col-span-full rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  No departments created yet.
                </p>
              )}
            </div>
          </div>
        );

      case "Tasks":
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
        );

      case "Performance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Performance Appraisals
            </h2>
            <PerformanceCard />
          </div>
        );

      case "Payroll":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Master Payroll
              </h2>
              <button
                onClick={() => setIsProcessPayrollOpen(true)}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-medium text-white"
              >
                Process Payroll
              </button>
            </div>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                October Payroll Batch: ₹32,45,000 (Ready)
              </p>
            </div>
          </div>
        );

      case "Documents":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Documents
            </h2>
            <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                Company Master Archive (128 Files)
              </p>
            </div>
          </div>
        );

      case "Announcements":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Announcements
              </h2>
              <button
                onClick={() => setIsBroadcastNoticeOpen(true)}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-medium text-white"
              >
                Broadcast Notice
              </button>
            </div>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft text-sm text-gray-500 dark:text-gray-400">
                  No announcements yet.
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement._id} className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                    <span className="text-[10px] font-semibold text-indigo-500 uppercase">Notice</span>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mt-1">
                      {announcement.headline}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      {announcement.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Admin Notifications
            </h2>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex gap-3">
              <Bell className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                  System Security Status
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  All SSL certificates and encryption keys are verified.
                </p>
              </div>
            </div>
          </div>
        );

      case "Audit Logs":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Security & Audit Logs
            </h2>
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="border-b border-gray-100/80 dark:border-gray-800/50 text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">
                  <tr>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Event</th>
                    <th className="pb-3">IP</th>
                    <th className="pb-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 dark:divide-gray-800/50">
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                    >
                      <td className="py-3.5 font-medium text-gray-700 dark:text-gray-300">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 font-medium text-gray-800 dark:text-gray-100">
                        {log.user}
                      </td>
                      <td className="py-3.5 font-medium text-gray-700 dark:text-gray-300">
                        {log.event}
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                        {log.ip}
                      </td>
                      <td
                        className={`py-3.5 text-right font-medium ${
                          log.status === "Success"
                            ? "text-emerald-500 dark:text-emerald-400"
                            : log.status === "Warning"
                              ? "text-amber-500 dark:text-amber-400"
                              : "text-rose-500 dark:text-rose-400"
                        }`}
                      >
                        {log.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "System Settings":
        return (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              System Settings
            </h2>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue="Acme HRM Enterprise"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 outline-none font-medium text-gray-800 dark:text-gray-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => showToast("Settings saved!", "success")}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-medium text-white"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "Projects":
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
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}

      <Modal
        isOpen={Boolean(rejectLeaveId)}
        onClose={() => setRejectLeaveId(null)}
        title="Reject Leave Request"
        footer={
          <>
            <button
              type="button"
              onClick={() => setRejectLeaveId(null)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="reject-leave-form"
              className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-medium text-white hover:bg-rose-700"
            >
              Reject Request
            </button>
          </>
        }
      >
        <form id="reject-leave-form" onSubmit={submitLeaveRejection} className="space-y-2 text-xs">
          <label htmlFor="rejection-reason" className="block font-medium text-gray-700 dark:text-gray-300">
            Reason for rejection
          </label>
          <textarea
            id="rejection-reason"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            rows={4}
            maxLength={500}
            required
            placeholder="Explain why this leave request is being rejected"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 dark:border-gray-700 dark:bg-[#0c1222] dark:text-gray-100"
          />
        </form>
      </Modal>

      <Modal
        isOpen={isCreateDepartmentOpen}
        onClose={() => setIsCreateDepartmentOpen(false)}
        title="Create Department"
        footer={
          <>
            <button
              onClick={() => setIsCreateDepartmentOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateDepartment}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Create Department
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
          <div>
            <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-300">
              Department Name
            </label>
            <input
              type="text"
              value={departmentForm.name}
              onChange={(event) =>
                setDepartmentForm({ name: event.target.value })
              }
              placeholder="e.g. Customer Success"
              autoFocus
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-xs font-medium text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-[#0c1222] dark:text-gray-100 dark:focus:border-indigo-500"
            />
          </div>
        </form>
      </Modal>

      {/* Step 1: Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New Portal User"
        footer={
          <>
            <button
              onClick={() => setIsAddUserOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-medium text-white shadow-sm"
            >
              Next: Employee Profile →
            </button>
          </>
        }
      >
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              User Full Name
            </label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              placeholder="e.g. Robert Howard"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              placeholder="user@company.com"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Role Tier
            </label>
            <select
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
            >
              <option
                className="bg-white dark:bg-[#151d2e] text-gray-800 dark:text-gray-100"
                value="employee"
              >
                Employee
              </option>
              <option
                className="bg-white dark:bg-[#151d2e] text-gray-800 dark:text-gray-100"
                value="hr"
              >
                HR
              </option>
              <option
                className="bg-white dark:bg-[#151d2e] text-gray-800 dark:text-gray-100"
                value="admin"
              >
                Admin
              </option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Step 2: Add Employee Details Modal */}
      <Modal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        title={
          editingEmployeeId
            ? "Edit Employee Profile"
            : "Add Employee Profile Details"
        }
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              onClick={() => setIsAddEmployeeOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEmployee}
              className="rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 px-5 py-2 text-xs font-medium shadow-sm"
            >
              {editingEmployeeId ? "Save Changes" : "Save Employee Profile"}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={employeeForm.name}
                disabled
                placeholder="Full Name"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={employeeForm.email}
                disabled
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, email: e.target.value })
                }
                placeholder="email@company.com"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={employeeForm.phone}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={employeeForm.dateOfBirth}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    dateOfBirth: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Gender
              </label>
              <select
                value={employeeForm.gender}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, gender: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
              >
                <option
                  className="bg-white dark:bg-[#151d2e] text-gray-800 dark:text-gray-100"
                  value="male"
                >
                  Male
                </option>
                <option
                  className="bg-white dark:bg-[#151d2e] text-gray-800 dark:text-gray-100"
                  value="female"
                >
                  Female
                </option>
                <option
                  className="bg-white dark:bg-[#151d2e] text-gray-800 dark:text-gray-100"
                  value="other"
                >
                  Non-Binary / Other
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Department
            </label>
            <select
              value={employeeForm.department}
              onChange={(e) =>
                setEmployeeForm({
                  ...employeeForm,
                  department: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer"
            >
              <option value="">No department</option>
              {departments.map((department) => (
                <option key={department._id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Designation
              </label>
              <input
                type="text"
                disabled
                value={employeeForm.designation}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    designation: e.target.value,
                  })
                }
                placeholder="Designation..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Joining Date
              </label>
              <input
                type="date"
                value={employeeForm.joiningDate}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    joiningDate: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Salary (Annual)
              </label>
              <input
                type="text"
                value={employeeForm.salary}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, salary: e.target.value })
                }
                placeholder="e.g. ₹15,00,000 / yr"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Address
            </label>
            <textarea
              rows={2}
              value={employeeForm.address}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, address: e.target.value })
              }
              placeholder="Residential address..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
        </form>
      </Modal>

      {/* View Full Employee Details Modal */}
      {selectedEmployeeDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEmployeeDetails(null)}
          title={`Employee Record: ${selectedEmployeeDetails.name}`}
          maxWidth="max-w-xl"
          footer={
            <button
              onClick={() => setSelectedEmployeeDetails(null)}
              className="rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-100/80 dark:border-gray-800/50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-base text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.name}
                </p>
                <p className="text-indigo-500 dark:text-indigo-400 font-medium">
                  {selectedEmployeeDetails.designation}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {selectedEmployeeDetails.email}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2.5 py-1 text-xs font-medium">
                {selectedEmployeeDetails.attendancePercentage}% Attendance
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Phone Number
                </p>
                <p className="font-medium mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.phone || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Date of Birth
                </p>
                <p className="font-medium mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.dateOfBirth || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Gender
                </p>
                <p className="font-medium mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.gender || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Joining Date
                </p>
                <p className="font-medium mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.joiningDate || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Department
                </p>
                <p className="font-medium mt-0.5 text-gray-800 dark:text-gray-100">
                  {selectedEmployeeDetails.department || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Salary
                </p>
                <p className="font-medium text-emerald-500 mt-0.5">
                  {selectedEmployeeDetails.salary || "N/A"}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Address
              </p>
              <p className="font-medium mt-0.5 text-gray-800 dark:text-gray-100">
                {selectedEmployeeDetails.address || "N/A"}
              </p>
            </div>
            
            <div className="pt-2">
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">Uploaded Projects</p>
              {projects.filter(p => p.employeeId?._id === selectedEmployeeDetails._id).length === 0 ? (
                <p className="text-xs text-gray-400">No projects uploaded by this employee.</p>
              ) : (
                <div className="space-y-3">
                  {projects.filter(p => p.employeeId?._id === selectedEmployeeDetails._id).map(project => (
                    <div key={project._id} className="p-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">{project.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{project.content}</p>
                      {project.score ? (
                        <p className="text-[11px] font-semibold text-emerald-600 mt-2">Score: {project.score}/5</p>
                      ) : (
                        <p className="text-[11px] font-semibold text-amber-500 mt-2">Pending Review - Go to Projects tab</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Broadcast Notice Modal */}
      <Modal
        isOpen={isBroadcastNoticeOpen}
        onClose={() => setIsBroadcastNoticeOpen(false)}
        title="Broadcast System Notice"
        footer={
          <>
            <button
              onClick={() => setIsBroadcastNoticeOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast("Notice broadcasted to all users!", "success");
                sendBroadcastNotice();
                setIsBroadcastNoticeOpen(false);
              }}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-medium text-white"
            >
              Broadcast
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              value={noticesData.headline}
              onChange={(e) => onChangeBroadcastNotice(e)}
              placeholder="Headline..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 outline-none text-gray-800 dark:text-gray-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Body
            </label>
            <textarea
              rows={4}
              name="body"
              value={noticesData.body}
              onChange={(e) => onChangeBroadcastNotice(e)}
              placeholder="Details..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 outline-none text-gray-800 dark:text-gray-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
            />
          </div>
        </div>
      </Modal>

      {/* Assign Task Modal */}
      <Modal
        isOpen={isAssignTaskOpen}
        onClose={() => setIsAssignTaskOpen(false)}
        title="Assign Task"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAssignTaskOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="assign-task-form"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-medium text-white transition hover:bg-indigo-700"
            >
              Assign Task
            </button>
          </>
        }
      >
        <form
          id="assign-task-form"
          onSubmit={handleAssignTask}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-300">
              Task title
            </label>
            <input
              required
              value={taskForm.title}
              onChange={(event) =>
                setTaskForm({ ...taskForm, title: event.target.value })
              }
              placeholder="e.g. Prepare monthly report"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-gray-800 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-[#0c1222] dark:text-gray-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-300">
              Assign to
            </label>
            <select
              required
              value={taskForm.assignee}
              onChange={(event) =>
                setTaskForm({ ...taskForm, assignee: event.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-gray-800 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-[#0c1222] dark:text-gray-100"
            >
              <option value="">Select an employee</option>
              {assignableEmployees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                value={taskForm.priority}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, priority: event.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-gray-800 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-[#0c1222] dark:text-gray-100"
              >
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-300">
                Deadline
              </label>
              <input
                type="date"
                value={taskForm.deadline}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, deadline: event.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-gray-800 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-[#0c1222] dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows={3}
              value={taskForm.description}
              onChange={(event) =>
                setTaskForm({ ...taskForm, description: event.target.value })
              }
              placeholder="Add task details..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-gray-800 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-[#0c1222] dark:text-gray-100"
            />
          </div>
        </form>
      </Modal>

      {/* Process Payroll Modal */}
      <Modal
        isOpen={isProcessPayrollOpen}
        onClose={() => setIsProcessPayrollOpen(false)}
        title="Execute Payroll Batch"
        footer={
          <>
            <button
              onClick={() => setIsProcessPayrollOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast(
                  "Payroll processing initiated successfully!",
                  "success",
                );
                setIsProcessPayrollOpen(false);
              }}
              className="rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 px-5 py-2 text-xs font-medium"
            >
              Confirm Disbursement
            </button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Initiate salary disbursement for{" "}
            <strong>{employees.length} employees</strong> for{" "}
            <strong>October 2026</strong>.
          </p>
          <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-800 dark:text-gray-100">
              Total Net Amount: ₹32,45,000
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Account: HDFC Corporate Primary (Ending in 9802)
            </p>
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
  );
};

export default AdminContent;
