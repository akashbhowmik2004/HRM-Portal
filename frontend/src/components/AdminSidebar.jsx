
import Sidebar from './Sidebar';

const adminSidebarItems = [
  'Dashboard',
  'Users',
  'Employees',
  'HR Management',
  'Departments',
  'Attendance',
  'Leave',
  'Tasks',
  'Performance',
  'Payroll',
  'Projects',
  'Documents',
  'Announcements',
  'Notifications',
  'Audit Logs',
  'System Settings',
  'Logout',
];

const AdminSidebar = (props) => {
  return (
    <Sidebar
      role="admin"
      items={adminSidebarItems}
      {...props}
    />
  );
};

export default AdminSidebar;
