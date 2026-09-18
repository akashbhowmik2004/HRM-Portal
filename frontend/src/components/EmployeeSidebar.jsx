import React from 'react';
import Sidebar from './Sidebar';

const employeeSidebarItems = ['Dashboard', 'My Profile', 'Projects', 'Attendance', 'Leave', 'Tasks', 'Payroll', 'Documents', 'Notifications', 'Announcements', 'Logout'];

const EmployeeSidebar = (props) => {
  return (
    <Sidebar
      role="employee"
      items={employeeSidebarItems}
      {...props}
    />
  );
};

export default EmployeeSidebar;
