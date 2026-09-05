import React, { useState, useEffect } from 'react'
import {
  Users, Building2, Briefcase, CheckCircle2, CalendarCheck, Clock,
  Download, Upload, Plus, Bell, Megaphone, FileText, DollarSign,
  AlertCircle, MoreVertical, Check, Calendar, Layers, Sparkles,
  ExternalLink, Percent, Video, Share2, Code, ChevronRight, Sun,
  MessageCircle, ClipboardList, Phone, CheckSquare, Wallet, Thermometer,
  Coffee, Palmtree, Plane, Tent
} from 'lucide-react'

// Brand Icons
const GithubIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const YoutubeIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const LinkedinIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"/>
  </svg>
)

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import Modal from '../components/Modal'
import { getStoredEmployees, getStoredLeaves, saveStoredLeaves, getStoredProjects, saveStoredProjects } from '../data/portalData'

ChartJS.register(ArcElement, Tooltip, Legend)

const InlineCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  const today = new Date()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false })
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, cur: true, isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear() })
  const rem = 35 - cells.length
  for (let i = 1; i <= rem; i++) cells.push({ day: i, cur: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{months[month]} {year}</span>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400 mb-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 text-center text-xs gap-y-0.5">
        {cells.slice(0, 35).map((c, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full font-medium transition-colors ${c.isToday ? 'bg-indigo-500 text-white font-semibold' : c.cur ? 'text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer' : 'text-gray-400 dark:text-gray-500'}`}>
              {c.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('hrm_dark_mode') === 'true')

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('hrm_dark_mode', 'true') }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('hrm_dark_mode', 'false') }
  }, [isDarkMode])

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false)
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(true)

  const [profile, setProfile] = useState({
    firstName: 'Akash', lastName: 'Bhowmik', email: 'akash.bhowmik@company.com', phone: '+91 98765 43210', role: 'Employee', empId: 'EMP-2048', department: 'Software Engineering', manager: 'Rahul Nair', joinDate: '15 March 2022', dateOfBirth: '2004-08-14', gender: 'Male', address: '42 Lotus Boulevard, Indiranagar, Bengaluru, KA', salary: '₹14,50,000 / yr', attendancePercentage: 92
  })

  const [leaveRequests, setLeaveRequests] = useState([])
  useEffect(() => { setLeaveRequests(getStoredLeaves()) }, [])

  const [newLeave, setNewLeave] = useState({ type: 'Sick Leave', fromDate: '', toDate: '', reason: '' })
  const [projects, setProjects] = useState([])
  useEffect(() => { setProjects(getStoredProjects()) }, [])

  const [projectForm, setProjectForm] = useState({ title: '', content: '', githubLink: '', youtubeLink: '', linkedinLink: '' })

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete API integration', project: 'Core Platform', priority: 'High', status: 'In Progress', deadline: 'Today, 6:00 PM' },
    { id: 2, title: 'Update documentation', project: 'Design System', priority: 'Normal', status: 'Pending', deadline: 'Tomorrow' },
    { id: 3, title: 'Fix UI bugs', project: 'HR Engine', priority: 'Normal', status: 'Pending', deadline: '5 Sep 2025' },
    { id: 4, title: 'Team meeting preparation', project: 'Management', priority: 'Normal', status: 'Not Started', deadline: '6 Sep 2025' }
  ])

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Leave Application Update', desc: 'Check your leave status in the Leave section.', time: '20 mins ago', read: false },
    { id: 2, title: 'Payroll Released', desc: 'September payslip has been credited and is ready for download.', time: '2 hours ago', read: false },
    { id: 3, title: 'Company Townhall Notice', desc: 'All-hands meeting scheduled for this Friday at 4 PM.', time: '1 day ago', read: true }
  ])

  const employeeSidebarItems = ['Dashboard', 'My Profile', 'Attendance', 'Leave', 'Tasks', 'Payroll', 'Documents', 'Notifications', 'Announcements', 'Logout']

  const handleApplyLeave = (e) => {
    e.preventDefault()
    if (!newLeave.fromDate || !newLeave.reason) return alert('Please fill out the dates and reason.')
    const created = { id: Date.now(), employeeName: `${profile.firstName} ${profile.lastName}`, department: profile.department, type: newLeave.type, dates: `${newLeave.fromDate} to ${newLeave.toDate || newLeave.fromDate}`, days: 1, reason: newLeave.reason, status: 'Pending', appliedOn: 'Just now' }
    const updated = [created, ...leaveRequests]
    setLeaveRequests(updated)
    saveStoredLeaves(updated)
    setIsApplyLeaveOpen(false)
    setNewLeave({ type: 'Sick Leave', fromDate: '', toDate: '', reason: '' })
    alert('Leave request submitted! HR and Admin can now review it.')
  }

  const handleAddProject = (e) => {
    e.preventDefault()
    if (!projectForm.title || !projectForm.content) return alert('Please enter a project title and description content.')
    const newProject = { id: Date.now(), title: projectForm.title, content: projectForm.content, githubLink: projectForm.githubLink || 'https://github.com', youtubeLink: projectForm.youtubeLink || 'https://youtube.com', linkedinLink: projectForm.linkedinLink || 'https://linkedin.com', author: `${profile.firstName} ${profile.lastName}`, progress: 60, status: 'In Progress', createdAt: 'Just now' }
    const updated = [newProject, ...projects]
    setProjects(updated)
    saveStoredProjects(updated)
    setIsAddProjectOpen(false)
    setProjectForm({ title: '', content: '', githubLink: '', youtubeLink: '', linkedinLink: '' })
    alert('Project added successfully!')
  }

  const statusBadge = (status) => {
    const map = {
      'In Progress': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      'Pending': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
      'Not Started': 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      'Completed': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    }
    return map[status] || 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  }

  const leaveBadge = (status) => {
    const map = {
      'Approved': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
      'Granted': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
      'Rejected': 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
      'Pending': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    }
    return map[status] || 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  }

  const renderDashboard = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const recentAnnouncements = [
      { icon: <Megaphone className="h-5 w-5 text-blue-500 dark:text-blue-400" />, title: 'Office Closure on Independence Day', date: '14 Aug 2025', iconBg: 'bg-blue-50 dark:bg-blue-900/20' },
      { icon: <Tent className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />, title: 'Team Outing This Month', date: '10 Aug 2025', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
      { icon: <ClipboardList className="h-5 w-5 text-amber-500 dark:text-amber-400" />, title: 'New HR Policy Update', date: '5 Aug 2025', iconBg: 'bg-amber-50 dark:bg-amber-900/20' }
    ]
    const displayLeaves = leaveRequests.slice(0, 3)

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Good morning, {profile.firstName}! <Sun className="inline-block h-5 w-5 text-amber-500 ml-2 mb-1" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Stay consistent, keep growing.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-3 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft px-4 py-2.5">
              <Sun className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{dateStr}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Have a productive day!</p>
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
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Attendance Today</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">Present</p>
            <p className="text-xs text-gray-400 mt-1">Check-in: {isCheckedIn ? '09:12 AM' : 'Not checked in'}</p>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <FileText className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Leave Balance</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">12 Days</p>
            <p className="text-xs text-gray-400 mt-1">Available</p>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <CheckSquare className="h-6 w-6 text-violet-500 dark:text-violet-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">My Tasks</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">3 Active</p>
            <p className="text-xs text-gray-400 mt-1">1 Due Soon</p>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Wallet className="h-6 w-6 text-amber-500 dark:text-amber-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Next Payroll</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">₹ 58,940</p>
            <p className="text-xs text-gray-400 mt-1">30 Sep 2025</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Attendance Overview</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">This Month ▾</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <Doughnut
                    data={{ labels: ['Present', 'Absent', 'Late', 'Half Day'], datasets: [{ data: [20, 2, 1, 1], backgroundColor: ['#6366f1', '#f43f5e', '#f59e0b', '#9ca3af'], borderWidth: 0 }] }}
                    options={{ cutout: '75%', plugins: { legend: { display: false } }, maintainAspectRatio: false }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile.attendancePercentage}%</span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Present</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="space-y-2.5">
                  {[
                    { label: 'Present', count: 20, color: 'bg-[#6366f1]' },
                    { label: 'Absent', count: 2, color: 'bg-[#f43f5e]' },
                    { label: 'Late', count: 1, color: 'bg-[#f59e0b]' },
                    { label: 'Half Day', count: 1, color: 'bg-[#9ca3af]' }
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{item.label}</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{item.count}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 grid grid-cols-2 text-center gap-4">
                  <div>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">24</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total Days</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">20</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Present Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Payroll Overview</h3>
              <button onClick={() => setActiveSection('Payroll')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View Payslips</button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">April 2025</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">₹ 58,940</p>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2.5 py-0.5">
                <Check className="h-3 w-3" /> Paid
              </span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">Paid on 30 Apr 2025</p>
            </div>
            <div className="space-y-3.5 border-t border-gray-100 dark:border-gray-800/50 pt-5">
              {[
                { label: 'Basic Salary', val: '₹ 50,000' },
                { label: 'Allowances', val: '₹ 10,000' },
                { label: 'Deductions', val: '₹ 1,060' }
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{r.label}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Leave Requests</h3>
              <button onClick={() => setActiveSection('Leave')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {displayLeaves.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No leave requests yet.</p>
              ) : displayLeaves.map(req => {
                const leaveIcons = {
                  'Sick Leave': <Thermometer className="h-4 w-4" />,
                  'Casual Leave': <Coffee className="h-4 w-4" />,
                  'Annual Leave': <Palmtree className="h-4 w-4" />,
                  'Earned Leave': <Plane className="h-4 w-4" />
                }
                return (
                  <div key={req.id} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {leaveIcons[req.type] || <ClipboardList className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-300">{req.type}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{req.dates}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-medium rounded-full px-2 py-0.5 ${leaveBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                )
              })}
            </div>
            <button onClick={() => setIsApplyLeaveOpen(true)} className="mt-5 w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition">
              + Apply New Leave
            </button>
          </div>

          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Announcements</h3>
              <button onClick={() => setActiveSection('Announcements')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentAnnouncements.map((ann, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${ann.iconBg}`}>
                    {ann.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-300 leading-snug">{ann.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{ann.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: CalendarCheck, label: 'Mark Attendance', color: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-500 dark:text-emerald-400', action: () => setIsCheckedIn(!isCheckedIn) },
                { icon: FileText, label: 'Apply Leave', color: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500 dark:text-blue-400', action: () => setIsApplyLeaveOpen(true) },
                { icon: Download, label: 'Request Doc', color: 'bg-violet-50 dark:bg-violet-900/20', iconColor: 'text-violet-500 dark:text-violet-400', action: () => setActiveSection('Documents') },
                { icon: Phone, label: 'Contact HR', color: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-500 dark:text-amber-400', action: () => {} }
              ].map((qa, i) => (
                <button key={i} onClick={qa.action} className="flex flex-col items-center gap-2.5 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-gray-100 dark:border-gray-800/50">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${qa.color}`}>
                    <qa.icon className={`h-5 w-5 ${qa.iconColor}`} />
                  </div>
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">{qa.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return renderDashboard()

      case 'My Profile':
        return (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 sm:p-8 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-800/50">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600 text-3xl font-bold text-white shadow-soft">
                  {profile.firstName.charAt(0)}
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#151d2e]" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{profile.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Employee ID: <span className="font-semibold text-gray-700 dark:text-gray-300">{profile.empId}</span> • Joined {profile.joinDate}
                  </p>
                </div>
              </div>

              <form className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                    <input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                    <input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                    <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
                    <input type="date" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                    <input type="text" value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Designation</label>
                    <input type="text" disabled value={profile.role}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2.5 text-xs text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Residential Address</label>
                  <textarea rows={2} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="button" onClick={() => alert('Profile updated successfully!')}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-indigo-700 transition">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )

      case 'Attendance':
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Monthly Performance Index</span>
                <h3 className="text-3xl sm:text-4xl font-bold mt-1 text-gray-800 dark:text-gray-100">{profile.attendancePercentage}% Attendance Rate</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">21 Days Present • 2 Days Late • 1 Day Absent out of 22 Working Days</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsCheckedIn(!isCheckedIn)}
                  className={`rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition ${isCheckedIn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  {isCheckedIn ? 'Punch Out' : 'Punch In'}
                </button>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col items-center justify-center">
                <h3 className="text-base font-semibold mb-4 self-start text-gray-800 dark:text-gray-100">Attendance Ratio</h3>
                <div className="h-44 w-44 relative">
                  <Doughnut
                    data={{ labels: ['Present', 'Late', 'Absent'], datasets: [{ data: [21, 2, 1], backgroundColor: ['#6366f1', '#f59e0b', '#f43f5e'], borderWidth: 0 }] }}
                    options={{ cutout: '74%', plugins: { legend: { display: false } }, maintainAspectRatio: false }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile.attendancePercentage}%</span>
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Score</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-xs font-medium">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">21 Present</span>
                  <span className="text-amber-500 dark:text-amber-400 font-semibold">2 Late</span>
                  <span className="text-rose-500 dark:text-rose-400 font-semibold">1 Absent</span>
                </div>
              </div>
              <div className="lg:col-span-2 rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">Detailed Check-In Logs</h3>
                <div className="space-y-2.5">
                  {[
                    ['Today, 24 Oct', '09:02 AM', 'In Progress', '6h 45m', 'Present (100%)', 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'],
                    ['Wed, 23 Oct', '08:58 AM', '06:12 PM', '9h 14m', 'Present (100%)', 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'],
                    ['Tue, 22 Oct', '09:35 AM', '06:40 PM', '9h 05m', 'Late (80%)', 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'],
                    ['Mon, 21 Oct', '09:01 AM', '06:05 PM', '9h 04m', 'Present (100%)', 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'],
                    ['Fri, 18 Oct', '09:00 AM', '06:00 PM', '9h 00m', 'Present (100%)', 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400']
                  ].map(([date, punchIn, punchOut, duration, status, badgeClass], idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-xs border border-gray-100/80 dark:border-gray-800/50">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{date}</span>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 font-medium">
                        <span>In: {punchIn}</span>
                        <span>Out: {punchOut}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{duration}</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badgeClass}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'Leave':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Leave Tracker & Applications</h2>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5">Apply for leaves and review granted requests</p>
              </div>
              <button onClick={() => setIsApplyLeaveOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-indigo-700 transition">
                <Plus className="h-4 w-4" /> Apply Leave
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Casual Leave', '06 / 12', '6 days available'],
                ['Sick Leave', '05 / 08', '5 days available'],
                ['Earned Leave', '10 / 15', '10 days available']
              ].map(([type, count, avail]) => (
                <div key={type} className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{type}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">{count}</p>
                  <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{avail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">My Leave History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="border-b border-gray-100 dark:border-gray-800/50 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <tr><th className="pb-3">Type</th><th className="pb-3">Dates</th><th className="pb-3">Reason</th><th className="pb-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                    {leaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                        <td className="py-3.5 font-medium text-gray-700 dark:text-gray-300">{req.type}</td>
                        <td className="py-3.5 text-gray-600 dark:text-gray-300 font-medium">{req.dates}</td>
                        <td className="py-3.5 text-gray-500 dark:text-gray-400">{req.reason}</td>
                        <td className="py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${leaveBadge(req.status)}`}>{req.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'Tasks':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Assigned Deliverables</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Track and update sprint tasks</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{task.project}</span>
                      <span className="rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 text-[10px] font-semibold">{task.priority} Priority</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{task.title}</h3>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Deadline: {task.deadline}</span>
                    <button
                      onClick={() => {
                        const next = task.status === 'Completed' ? 'In Progress' : 'Completed'
                        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: next } : t))
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-soft transition ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                    >
                      {task.status === 'Completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'Payroll':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Payroll & Payslips</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Download your salary statements and tax reports</p>
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Recent Payslips</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Year 2025 ▾</span>
              </div>
              <div className="space-y-3">
                {['April 2025', 'March 2025', 'February 2025'].map((month, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-[#0c1222] hover:bg-gray-100 dark:hover:bg-gray-800/80 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Payslip - {month}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">Generated on 1st {month}</p>
                      </div>
                    </div>
                    <button className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-[#151d2e] p-6 border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-6">CTC Structure Overview</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-100 dark:border-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Gross Earnings</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">₹1,20,833</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-100 dark:border-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Deductions (PF + Tax)</p>
                  <p className="text-xl font-bold text-rose-500 dark:text-rose-400 mt-1">- ₹18,400</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-[#0c1222] border border-gray-100 dark:border-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Net Take Home</p>
                  <p className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mt-1">₹1,02,433</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'Documents':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Employee Documents</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Official letters and credentials</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Offer Letter & NDA', 'Joining Appointment Letter', 'Form 16 Tax Certificate'].map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{doc}</span>
                  </div>
                  <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Download</button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'Notifications':
        return (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Alerts & Notifications</h2>
            {notifications.map(n => (
              <div key={n.id} className="p-4 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft flex items-start gap-3">
                <Bell className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-100">{n.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case 'Announcements':
        return (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Announcements</h2>
            <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <span className="text-[10px] font-semibold text-amber-500 uppercase">Notice</span>
              <h4 className="text-base font-semibold mt-1 text-gray-800 dark:text-gray-100">Quarterly Townhall & Growth Vision</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">All employees are invited to the Q4 Townhall meeting this Friday at 4:00 PM.</p>
            </div>
            <div className="p-5 rounded-xl bg-white/80 dark:bg-[#151d2e] border border-gray-100/80 dark:border-gray-800/50 shadow-soft">
              <span className="text-[10px] font-semibold text-indigo-500 uppercase">Info</span>
              <h4 className="text-base font-semibold mt-1 text-gray-800 dark:text-gray-100">Office Closure on Independence Day</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">The office will remain closed on 15th August in observance of Independence Day.</p>
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
          role="employee"
          items={employeeSidebarItems}
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
              name: `${profile.firstName} ${profile.lastName}`,
              role: profile.role,
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

      <Modal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        title="Apply for Leave"
        footer={
          <>
            <button onClick={() => setIsApplyLeaveOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button onClick={handleApplyLeave}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-soft">
              Submit Application
            </button>
          </>
        }
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Leave Type</label>
            <select value={newLeave.type} onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500 cursor-pointer">
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">From Date</label>
              <input type="date" value={newLeave.fromDate} onChange={(e) => setNewLeave({ ...newLeave, fromDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">To Date</label>
              <input type="date" value={newLeave.toDate} onChange={(e) => setNewLeave({ ...newLeave, toDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Reason for Leave</label>
            <textarea rows={3} value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              placeholder="Provide reason for time off..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        title="Add New Project"
        maxWidth="max-w-xl"
        footer={
          <>
            <button onClick={() => setIsAddProjectOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button onClick={handleAddProject}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-soft">
              Upload Project
            </button>
          </>
        }
      >
        <form onSubmit={handleAddProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Project Title</label>
            <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              placeholder="e.g. AI-Powered Resume Screener"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Project Content / Overview</label>
            <textarea rows={3} value={projectForm.content} onChange={(e) => setProjectForm({ ...projectForm, content: e.target.value })}
              placeholder="Describe the project architecture, features, and technologies used..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
          </div>
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800/50">
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <GithubIcon className="h-3.5 w-3.5" /> GitHub Repository Link
              </label>
              <input type="url" value={projectForm.githubLink} onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                placeholder="https://github.com/username/project"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <YoutubeIcon className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" /> YouTube Demo Video Link
              </label>
              <input type="url" value={projectForm.youtubeLink} onChange={(e) => setProjectForm({ ...projectForm, youtubeLink: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <LinkedinIcon className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" /> LinkedIn Post Link
              </label>
              <input type="url" value={projectForm.linkedinLink} onChange={(e) => setProjectForm({ ...projectForm, linkedinLink: e.target.value })}
                placeholder="https://linkedin.com/posts/..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] p-2.5 text-xs text-gray-800 dark:text-gray-100 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default EmployeeDashboard
