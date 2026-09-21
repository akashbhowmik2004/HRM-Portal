import React, { useState, useEffect } from 'react'
import { Search, Bell, Menu, X } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { api } from '../apis/axios'
import { useToast } from './ToastProvider'

const TopHeader = ({
  user = { name: 'John Wick', role: 'Admin', avatar: null },
  onOpenMobileMenu = () => {},
  isDarkMode = false
}) => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = React.useRef(null);
  const { showToast } = useToast();

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
        setNotifications(res.data.notifications);
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

        </div>

        {/* Right Actions (Visible on Mobile in this row) */}
        <div className="flex sm:hidden items-center justify-end gap-3 shrink-0 relative" data-notification-container>
          <button
            className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#151d2e]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-12 right-0 w-72 bg-white dark:bg-[#151d2e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-800 dark:text-gray-200">
                Recent Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className="p-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex justify-between items-start gap-2 relative">
                      {!n.isRead && <span className="absolute top-5 left-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      <div className="pl-3">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
                      </div>
                      <button onClick={(e) => handleDismiss(e, n._id)} className="text-gray-400 hover:text-red-500 shrink-0">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-medium overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>{user.name?.charAt(0)}</span>
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
      <div className="hidden sm:flex items-center justify-end gap-3 shrink-0 order-2 sm:order-3 relative" data-notification-container>
        <button
          className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition"
          onClick={toggleNotifications}
        >
          <Bell className="h-5 w-5" />
          {notifications.some(n => !n.isRead) && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#151d2e]" />
          )}
        </button>

        {showNotifications && (
            <div className="absolute top-12 right-32 w-80 bg-white dark:bg-[#151d2e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-800 dark:text-gray-200">
                Recent Notifications
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className="p-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex justify-between items-start gap-2 relative">
                      {!n.isRead && <span className="absolute top-5 left-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      <div className="pl-3">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
                      </div>
                      <button onClick={(e) => handleDismiss(e, n._id)} className="text-gray-400 hover:text-red-500 shrink-0">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

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
              <span>{user.name?.charAt(0)}</span>
            )}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#151d2e]" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopHeader
