import React from 'react';
import Sidebar from './Sidebar';

const hrSidebarItems = [
  'Dashboard',
  'Employees',
  'Departments',
  'Attendance',
  'Leave Management',
  'Tasks',
  'Performance',
  'Documents',
  'Announcements',
  'Notifications',
  'Logout',
];

const HRSidebar = (props) => {
  return (
    <Sidebar
      role="hr"
      items={hrSidebarItems}
      {...props}
    />
  );
};

export default HRSidebar;
