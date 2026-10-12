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

const roleThemeMap = {
  admin: {
    sidebarBg: 'bg-[#202938]',
    sidebarStyle: { backgroundColor: '#202938' },
    accentBg: 'bg-[#2563EB]',
    activeClass: 'bg-[#2563EB] text-white font-semibold shadow-sm',
    activeIcon: 'text-white',
    roleTag: 'System Admin',
  },
  hr: {
    sidebarBg: 'bg-[#0A362C]',
    sidebarStyle: { backgroundColor: '#0A362C' },
    accentBg: 'bg-[#0F766E]',
    activeClass: 'bg-[#0F766E] text-white font-semibold shadow-sm',
    activeIcon: 'text-white',
    roleTag: 'HR Suite',
  },
  employee: {
    sidebarBg: 'bg-[#182234]',
    sidebarStyle: { backgroundColor: '#182234' },
    accentBg: 'bg-[#4F46E5]',
    activeClass: 'bg-[#4F46E5] text-white font-semibold shadow-sm',
    activeIcon: 'text-white',
    roleTag: 'Employee Space',
  },
}

const Sidebar = ({
  role = 'employee',
  items = [],
  activeItem = 'Dashboard',
  onSelect = () => {},
  isOpen = false,
  onClose = () => {},
}) => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const sections = categorizeItems(role, items.filter(item => item !== 'Logout'))
  const theme = roleThemeMap[role] || roleThemeMap.employee

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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={theme.sidebarStyle}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col text-white border-r border-white/10 shadow-elevated transition-transform duration-200 ease-in-out lg:static lg:flex lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${theme.accentBg} text-white shadow-subtle`}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 16-9 5-9-5V8l9-5 9 5v8Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block leading-tight">
                HRM Portal
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-300/70 font-medium">
                {theme.roleTag}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {sections.map((sec) => {
            if (!sec.items.length) return null
            return (
              <div key={sec.title}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/60">
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
                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-colors duration-150 text-left ${
                          isActive
                            ? theme.activeClass
                            : 'text-slate-300 hover:bg-white/[0.08] hover:text-white font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComponent
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? theme.activeIcon : 'text-slate-400 group-hover:text-white'
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

        {/* Footer Actions — No theme toggle, clean logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-rose-500/15 hover:text-rose-200 transition"
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar


