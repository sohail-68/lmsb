import React from 'react';
import { Outlet } from 'react-router-dom';


function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* <Sidebar
        links={[
          { path: '/admin/create-course', label: 'Create Course' },
          // Add more links as needed
        ]}
      /> */}
      <div className="content">
        {/* <Navbar /> */}
        <Outlet /> {/* Child routes will render here */}
      </div>
    </div>
  );
}

export default AdminLayout;
