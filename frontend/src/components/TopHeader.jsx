import React from 'react'
import { Search, Bell, Menu } from 'lucide-react'

const TopHeader = ({
  user = { name: 'John Wick', role: 'Admin', avatar: null },
  onOpenMobileMenu = () => {},
  isDarkMode = false
}) => {
  return (
    <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-white/80 dark:bg-[#151d2e] p-3 sm:px-5 border border-gray-100/80 dark:border-gray-800/50 shadow-soft backdrop-blur-sm transition-colors">
      
      {/* Top Row for Mobile (Menu + Actions) / Left Section for Desktop */}
      <div className="flex items-center justify-between sm:w-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 lg:hidden dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden sm:flex items-center gap-5 text-[13px] font-medium text-gray-500 dark:text-gray-400">
            <button className="text-gray-700 dark:text-gray-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Menu Master
            </button>
            <button className="hover:text-gray-700 dark:hover:text-gray-200 transition">
              Website
            </button>
            <button className="hover:text-gray-700 dark:hover:text-gray-200 transition">
              Reports & analysis
            </button>
          </nav>
        </div>

        {/* Right Actions (Visible on Mobile in this row) */}
        <div className="flex sm:hidden items-center justify-end gap-3 shrink-0">
          <button
            className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#151d2e]" />
          </button>

          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-medium overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#151d2e]" />
          </div>
        </div>
      </div>

      {/* Center/Search: Pill search input (Full width on mobile, flexible on desktop) */}
      <div className="relative flex-1 w-full sm:max-w-md sm:mx-4 order-3 sm:order-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0c1222] py-2 pl-9 pr-4 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 font-medium outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:border-indigo-500"
        />
      </div>

      {/* Right: Notifications & User Profile (Desktop only, mobile rendered above) */}
      <div className="hidden sm:flex items-center justify-end gap-3 shrink-0 order-2 sm:order-3">
        <button
          className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#151d2e]" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100 dark:border-gray-800/50">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">
              {user.name}
            </p>
            <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 capitalize">
              {user.role}
            </p>
          </div>
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-medium overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#151d2e]" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopHeader
