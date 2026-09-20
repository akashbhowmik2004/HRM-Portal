import { useNavigate } from 'react-router'
import { auth } from '../apis/axios'
import useAuth from '../context/useAuth'
import {
  LayoutDashboard,
  User,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckSquare,
  TrendingUp,
  CreditCard,
  FileText,
  Bell,
  Megaphone,
  ShieldCheck,
  Settings,
  LogOut,
  Moon,
  Sun,
  UserCheck,
  FileSpreadsheet,
  Layers,
  X,
  AlertCircle
} from 'lucide-react'

const iconMap = {
  'Dashboard': LayoutDashboard,
  'Attendance': CalendarCheck,
  'Tasks': CheckSquare,
  'Documents': FileText,
  'Notifications': Bell,
  'Announcements': Megaphone,
  'Logout': LogOut,
  'My Profile': User,
  'Leave': CalendarDays,
  'Payroll': CreditCard,
  'Employees': Users,
  'Departments': Building2,
  'Leave Management': CalendarDays,
  'Performance': TrendingUp,
  'Users': UserCheck,
  'HR Management': ShieldCheck,
  'Audit Logs': FileSpreadsheet,
  'System Settings': Settings,
  'Issues': AlertCircle
}

const categorizeItems = (role, items) => {
  if (role === 'employee') {
    return [
      {
        title: 'MAIN',
        items: items.filter(i => ['Dashboard', 'My Profile'].includes(i))
      },
      {
        title: 'COMPANY',
        items: items.filter(i => ['Attendance', 'Leave', 'Tasks', 'Payroll', 'Documents', 'Projects'].includes(i))
      },
      {
        title: 'OTHERS',
        items: items.filter(i => ['Notifications', 'Announcements'].includes(i))
      }
    ]
  }

  if (role === 'hr') {
    return [
      {
        title: 'MAIN',
        items: items.filter(i => ['Dashboard'].includes(i))
      },
      {
        title: 'COMPANY',
        items: items.filter(i => ['Employees', 'Departments', 'Attendance', 'Leave Management', 'Tasks', 'Performance', 'Projects'].includes(i))
      },
      {
        title: 'OTHERS',
        items: items.filter(i => ['Documents', 'Announcements', 'Notifications', 'Issues'].includes(i))
      }
    ]
  }

  return [
    {
      title: 'MAIN',
      items: items.filter(i => ['Dashboard'].includes(i))
    },
    {
      title: 'COMPANY',
      items: items.filter(i => ['Users', 'Employees', 'HR Management', 'Departments', 'Attendance', 'Leave', 'Tasks', 'Performance', 'Payroll', 'Projects'].includes(i))
    },
    {
      title: 'OTHERS',
      items: items.filter(i => ['Documents', 'Announcements', 'Notifications', 'Audit Logs', 'System Settings'].includes(i))
    }
  ]
}

const Sidebar = ({
  role = 'employee',
  items = [],
  activeItem = 'Dashboard',
  onSelect = () => {},
  isOpen = false,
  onClose = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {}
}) => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const sections = categorizeItems(role, items.filter(item => item !== 'Logout'))

  const handleItemClick = (item) => {
    onSelect(item)
    if (onClose) onClose()
  }

  const handleLogout = async () => {
    try {
      await auth.post('/logout')
    } finally {
      setUser(null)
      navigate('/')
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white/90 dark:bg-[#0f1729] backdrop-blur-md border-r border-gray-100 dark:border-gray-800/50 transition-transform duration-300 ease-in-out lg:static lg:flex lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 16-9 5-9-5V8l9-5 9 5v8Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                HRM Portal
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium">
                Enterprise Suite
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((sec) => {
            if (!sec.items.length) return null
            return (
              <div key={sec.title} className="mb-5">
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {sec.title}
                </p>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const IconComponent = iconMap[item] || Layers
                    const isActive = activeItem === item
                    return (
                      <button
                        key={item}
                        onClick={() => handleItemClick(item)}
                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-all duration-150 ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/25 dark:text-indigo-300 font-semibold'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-800 dark:hover:text-gray-200 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComponent
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                            }`}
                          />
                          <span className="truncate">{item}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800/50 space-y-1.5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/15 dark:hover:text-rose-400 transition"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>

          <div className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] text-gray-600 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-[#0c1222]">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? (
                <Moon className="h-3.5 w-3.5 text-gray-400" />
              ) : (
                <Sun className="h-3.5 w-3.5 text-gray-400" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">Dark Mode</span>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                  isDarkMode ? 'translate-x-[18px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
