import React, { useState, useEffect } from 'react'
import { Search, Bell, Menu, X } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { api } from '../apis/axios'
import { useToast } from './ToastProvider'

const TopHeader = ({
  user = { name: 'John Wick', role: 'Admin', avatar: null },
  role = null,
  onOpenMobileMenu = () => {},
  actionButton = null,
}) => {
  const currentRole = (role || user.role || 'admin').toLowerCase()
  const accentColor = currentRole === 'hr' ? '#0F766E' : currentRole === 'employee' ? '#4F46E5' : '#2563EB'
  const accentClass = currentRole === 'hr' ? 'bg-[#0F766E]' : currentRole === 'employee' ? 'bg-[#4F46E5]' : 'bg-[#2563EB]'

  const searchPlaceholder =
    currentRole === 'hr'
      ? 'Search employees, leaves, etc...'
      : currentRole === 'admin'
      ? 'Search users, roles, logs...'
      : 'Search here...'

  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { showToast } = useToast();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-notification-container]')) {
        setShowNotifications((prev) => {
          if (prev) {
            setNotifications(n => n.map(item => ({...item, isRead: true})));
          }
          return false;
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newNotification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    });

    return () => {
      socket.off('newNotification');
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async () => {
    try {
      await api.put("/notifications/dismiss-all");
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const toggleNotifications = () => {
    if (!showNotifications) {
      const hasUnread = notifications.some(n => !n.isRead);
      if (hasUnread) {
        api.put("/notifications/dismiss-all").catch(e => console.error(e));
      }
    } else {
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    }
    setShowNotifications(!showNotifications);
  };

  const handleDismiss = async (e, id) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/dismiss`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error("Error dismissing notification", error);
    }
  };

  return (
    <header className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-white p-2.5 sm:px-4 border border-[#E3E7EB] shadow-subtle transition-colors">
      
      {/* Top Row for Mobile (Menu + Actions) / Left Section for Desktop */}
      <div className="flex items-center justify-between sm:w-auto w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-lg p-2 text-[#667085] hover:bg-[#F0F2F4] hover:text-[#172033] lg:hidden transition"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right Actions on Mobile */}
        <div className="flex sm:hidden items-center justify-end gap-2.5 shrink-0 relative" data-notification-container>
          <button
            className="relative rounded-lg p-2 text-[#667085] hover:bg-[#F0F2F4] hover:text-[#172033] transition"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5" />
            {notifications.some(n => !n.isRead) && (
              <span
                style={{ backgroundColor: accentColor }}
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-white"
              />
            )}
          </button>

          <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentClass} text-white text-xs font-semibold overflow-hidden shadow-subtle`}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>{user.name?.charAt(0)}</span>
            )}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="relative flex-1 w-full sm:max-w-md sm:mx-3 order-3 sm:order-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#667085]" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-[#E3E7EB] bg-[#F6F7FB] py-2 pl-9 pr-3 text-xs text-[#172033] placeholder-[#667085] font-medium outline-none transition focus:border-current focus:bg-white focus:ring-2 focus:ring-black/5"
        />
      </div>

      {/* Right: Date Badge, Optional Action CTA, Notifications & Profile */}
      <div className="hidden sm:flex items-center justify-end gap-3 shrink-0 order-2 sm:order-3 relative" data-notification-container>
        
        {/* Dynamic Contextual Date Badge */}
        <div className="text-[11px] font-medium text-[#667085] bg-[#F6F7FB] px-2.5 py-1.5 rounded-md border border-[#E3E7EB]">
          {formattedDate}
        </div>

        {/* Optional Contextual Action Button (e.g., Add Employee) */}
        {actionButton}

        {/* Notifications Icon Button */}
        <button
          className="relative rounded-lg p-2 text-[#667085] hover:bg-[#F0F2F4] hover:text-[#172033] transition"
          onClick={toggleNotifications}
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          {notifications.some(n => !n.isRead) && (
            <span
              style={{ backgroundColor: accentColor }}
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-white"
            />
          )}
        </button>

        {showNotifications && (
          <div className="absolute top-12 right-28 w-80 bg-white rounded-xl shadow-elevated border border-[#E3E7EB] z-50 overflow-hidden">
            <div className="p-3 border-b border-[#E3E7EB] font-semibold text-xs uppercase tracking-wider text-[#172033] flex justify-between items-center">
              <span>Recent Notifications</span>
              {notifications.length > 0 && (
                <button onClick={markAsRead} className="text-[10px] text-[#2563EB] hover:underline normal-case font-medium">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-[#E3E7EB]/60">
              {notifications.length === 0 ? (
                <div className="p-4 text-xs text-[#667085] text-center">No new notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n._id} className="p-3 hover:bg-[#F6F7FB] flex justify-between items-start gap-2 relative">
                    {!n.isRead && <span style={{ backgroundColor: accentColor }} className="absolute top-4 left-1.5 h-1.5 w-1.5 rounded-full" />}
                    <div className="pl-2">
                      <p className="text-xs font-semibold text-[#172033]">{n.title}</p>
                      <p className="text-[11px] text-[#667085] mt-0.5">{n.message}</p>
                    </div>
                    <button onClick={(e) => handleDismiss(e, n._id)} className="text-[#667085] hover:text-red-600 shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E3E7EB]">
          <div className="text-right">
            <p className="text-xs font-semibold text-[#172033] leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] font-medium text-[#667085] capitalize">
              {user.role}
            </p>
          </div>
          <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentClass} text-white text-xs font-bold overflow-hidden shadow-subtle`}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>{user.name?.charAt(0)}</span>
            )}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopHeader

