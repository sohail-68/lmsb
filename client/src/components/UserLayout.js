import React from 'react';
import { useLocation, Outlet } from 'react-router-dom'; // Use Outlet for nested routes
import Home from './Home';        // Import the Home section
import Navbar from './Navbar';    // Import the Navbar section
import Testi from './Testi';      // Import the Testi section
import Courses from './Courses';  // Import the Courses section
import Feature from './Feature';  // Import the Feature section

const UserLayout = () => {
  const location = useLocation();

  // Check if the current path matches specific routes
  const isLecturePage = location.pathname.includes('/user/lect/');
  const isProfilePage = location.pathname === '/user/profile';
  const UserCourse = location.pathname === '/user/course';
  const detail = location.pathname.includes('/user/detail/');
  const search = location.pathname.includes('/user/search');
  const wish = location.pathname.includes('/user/wish');
  const quiz = location.pathname.includes('/user/quiz');
  const quuize = location.pathname.includes('/user/quuize');
  const playquiz = location.pathname.includes('/user/playquiz');

console.log(!isLecturePage);
console.log(search);

  return (
    <div className="user-layout">
      {/* Navbar is always visible */}
      <Navbar />

      {/* Render sections only for non-profile and non-lecture pages */}
      {!isLecturePage && !playquiz && !quiz && !quuize && ! wish && !search && !UserCourse && !detail && !isProfilePage && (
        <div className="content">
          <section>
            <Home />
          </section>
          <section>
            <Feature />
          </section>
          <section>
            <Courses />
          </section>
          <section>
            <Testi />
          </section>
        </div>
      )}

      {/* Render nested routes */}
      <div className="nested-content">
        <Outlet /> {/* This will render the child routes like /user/lect/:id */}
      </div>

      {/* Footer section */}
 
    </div>
  );
};

export default UserLayout;
