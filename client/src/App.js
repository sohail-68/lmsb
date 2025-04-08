import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import theme from "./theme";

// Lazy-loaded components
const Signup = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));
const CreateCourse = lazy(() => import("./components/CreateCourse"));
const LecturesList = lazy(() => import("./components/LecturesList"));
const Pay = lazy(() => import("./components/pay.js"));
const Lecture = lazy(() => import("./components/Lecture"));
const Dashbaord = lazy(() => import("./components/Dashbaord"));
const LectureAll = lazy(() => import("./components/LectureAll"));
const Details = lazy(() => import("./components/Details"));
const User = lazy(() => import("./components/User"));
const UserLayout = lazy(() => import("./components/UserLayout"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const Lect = lazy(() => import("./components/Lect"));
const Profile = lazy(() => import("./components/Profile"));
const UserCourse = lazy(() => import("./components/UserCourse"));
const GetDetails = lazy(() => import("./components/GetDetails"));
const SearchResultsPage = lazy(() => import("./components/SearchResultsPage"));
const Wish = lazy(() => import("./components/Wish"));
const CreateQuiz = lazy(() => import("./components/CreateQuiz.js"));
const PlayQuizz = lazy(() => import("./components/Play.js"));
const QuizeGame = lazy(() => import("./components/QuizeGame.js"));
const QuizePage = lazy(() => import("./components/QuizePage.js"));
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <AdminLayout />
              </ThemeProvider>
            }
          >
            <Route
              path="create-course"
              element={<ProtectedRoute element={<CreateCourse />} allowedRoles={["admin"]} />}
            />
             <Route
              path="createQuiz/:id"
              element={<ProtectedRoute element={<CreateQuiz />} allowedRoles={["admin"]} />}
            />
               <Route
              path="pay"
              element={<ProtectedRoute element={<Pay/>} allowedRoles={["admin"]} />}
            />
            <Route
              path="userdashb"
              element={<ProtectedRoute element={<User />} allowedRoles={["admin"]} />}
            />
            <Route
              path="create-lecture/:id"
              element={<ProtectedRoute element={<Lecture />} allowedRoles={["admin"]} />}
            />
            <Route
              path="detail/:id"
              element={<ProtectedRoute element={<Details />} allowedRoles={["admin"]} />}
            />
            <Route
              path="lectures/:id"
              element={<ProtectedRoute element={<LecturesList />} allowedRoles={["admin"]} />}
            />
            <Route
              path="dashboard"
              element={<ProtectedRoute element={<Dashbaord />} allowedRoles={["admin"]} />}
            />
            <Route
              path="Lectureall"
              element={<ProtectedRoute element={<LectureAll />} allowedRoles={["admin"]} />}
            />
          </Route>

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route
              path="profile"
              element={<ProtectedRoute element={<Profile />} allowedRoles={["student", "admin"]} />}
            />
            <Route
              path="wish"
              element={<ProtectedRoute element={<Wish />} allowedRoles={["student", "admin"]} />}
            />
            <Route
              path="detail/:id"
              element={<ProtectedRoute element={<GetDetails />} allowedRoles={["student", "admin"]} />}
            />
            <Route
              path="course"
              element={<ProtectedRoute element={<UserCourse />} allowedRoles={["student"]} />}
            />
              <Route
              path="quuize/:id"
              element={<ProtectedRoute element={<QuizeGame />} allowedRoles={["student"]} />}
            />
               <Route
              path="playquiz"
              element={<ProtectedRoute element={<PlayQuizz />} allowedRoles={["student"]} />}
            />

<Route
              path="quiz/:id"
              element={<ProtectedRoute element={<QuizePage />} allowedRoles={["student"]} />}
            />
            <Route path="search" element={<SearchResultsPage />} />
            <Route
              path="lect/:id"
              element={<ProtectedRoute element={<Lect />} allowedRoles={["student"]} />}
            />
          </Route>

          {/* Default Route (Redirect to Login) */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer />
      </Suspense>
    </Router>
  );
}

export default App;