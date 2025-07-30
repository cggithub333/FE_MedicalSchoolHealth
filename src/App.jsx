import './index.css';

import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, Outlet } from "react-router-dom";

import AdminDashboardRoutes from "./components/admin/Dashboard/AdminDashboardRoutes";
import ManagerDashboardRoutes from "./components/manager/Dashboard/ManagerDashboardRoutes";
import SchoolNurseDashboardRoutes from "./components/schoolnurse/Dashboard/SchoolNurseDashboardRoutes";
import ParentDashboardRoutes from "./components/parent/Dashboard/ParentDashboardRoutes";
import Homepage from './pages/homepage/homepage.jsx';
import Blogs from '@pages/blogs/Blogs';
import BlogDetail from '@pages/blogs/BlogDetail';
import Contact from '@pages/contact/Contact';
import BlogManagePage from '@pages/blogs/BlogManagePage';
import BlogCreate from '@pages/blogs/BlogCreate';
import BlogEdit from '@pages/blogs/BlogEdit';

// toastify config:
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';

import { getPayloadResources } from './utils/jwt-utils';
import { isContained } from './utils/string-utils';
import Test from '@pages/test/Test';
import LogoutAction from '@components/Logout';

export const BlogRouteProtecter = ({ children }) => {
    const { role } = getPayloadResources() || {}
    if (!children) return <Navigate to={"/homepage"} replace />
    if (role !== "ADMIN" && role !== "MANAGER") {
        return <Navigate to={"/blogs"} replace />
    }
    return children
} 

const TargetRedirect = ({ target }) => {
    if (target === "logout") {
        // if the target is logout, we will call the LogoutAction component
        return <LogoutAction />;
    }
    const { role } = getPayloadResources() || {};
    switch (role) {
        case "ADMIN":
            return <Navigate to={`/admin/${target}`} replace />;
        case "MANAGER":
            return <Navigate to={`/manager/${target}`} replace />;
        case "SCHOOL_NURSE":
            return <Navigate to={`/schoolnurse/${target}`} replace />;
        case "PARENT":
            return <Navigate to={`/parent/${target}`} replace />;
        default:
            return <Navigate to={"/homepage"} replace />;
    }
}


function App() {

    const RouteProtecter = protecter();
    const { role } = getPayloadResources() || {};

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        padding: '16px',
                        color: '#fff',
                        background: '#333',
                    },
                }}
            />

            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to={"/homepage"} />} /> {/* entry point of the application */}
                    <Route path="/homepage" element={<Homepage />} />
                    
                    {/* Blogs management  - for admin, manager*/}
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogs/view/:blogId" element={<BlogDetail />} />

                    <Route path="/blogs/manage" element={
                        <BlogRouteProtecter>
                            <BlogManagePage />
                        </BlogRouteProtecter>} 
                    />

                    <Route path="/blogs/manage/create" element={
                        <BlogRouteProtecter>
                            <BlogCreate />
                        </BlogRouteProtecter>}
                    />

                    <Route path="/blogs/manage/edit/:blogId" element={
                        <BlogRouteProtecter>
                            <BlogEdit />
                        </BlogRouteProtecter>}
                    />

                    <Route path="/contact" element={<Contact />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/dashboard" element={<TargetRedirect target="dashboard" />} />
                    <Route path="/profile" element={<TargetRedirect target="profile"/>} />
                    <Route path="/settings" element={<TargetRedirect target="settings" />} />
                    <Route path="/logout" element={<TargetRedirect target="logout" />} />

                    {/* Protected routes */}
                    <Route element={<RouteProtecter.forAll />}>

                        <Route path="/admin/*" element={<RouteProtecter.forAdmin>
                            <AdminDashboardRoutes />
                        </RouteProtecter.forAdmin>} />

                        <Route path="/manager/*" element={<RouteProtecter.forManager>
                            <ManagerDashboardRoutes />
                        </RouteProtecter.forManager>} />

                        <Route path="/schoolnurse/*" element={<RouteProtecter.forSchoolNurse>
                            <SchoolNurseDashboardRoutes />
                        </RouteProtecter.forSchoolNurse>} />

                        <Route path="/parent/*" element={<RouteProtecter.forParent>
                            <ParentDashboardRoutes />
                        </RouteProtecter.forParent>} />
                    </Route>
                    <Route path="/*" element={<Navigate to={"/homepage"} />} />
                </Routes>
            </Router>
        </>
    );
}

const protecter = () => {
    const ProtectAllRoute = ({ children }) => {
        const currPath = useLocation().pathname;
        if (!isContained(currPath, "/parent/") && !isContained(currPath, "/schoolnurse/") &&
            !isContained(currPath, "/admin/") && !isContained(currPath, "/manager/")) {

            return <Navigate to={"/homepage"} replace />
        }
        return <Outlet />;
    }

    const ProtectAdminRoute = ({ children }) => {
        const adminPrefix = "AD";
        const currentSeconds = Math.floor(Date.now() / 1000);
        const { role, userId, exp, error } = getPayloadResources();

        if (error) {
            // error happened
            return <Navigate to={"/homepage"} replace />;
        }

        // remove localStorage infor in case session's expired and user didn't enter the 'log out' button:
        if (currentSeconds >= exp) {
            localStorage.clear();
            localStorage.setItem('toopad-mode', 'light');
        }


        if (role != "ADMIN" || currentSeconds >= exp || !isContained(userId, adminPrefix)) {
            return <Navigate to={"/homepage"} replace />;
        }
        //else:
        return children;
    }

    const ProtectParentRoute = ({ children }) => {
        const parentPrefix = "PR";
        const currentSeconds = Math.floor(Date.now() / 1000);
        const { role, userId, exp, error } = getPayloadResources() || {};
        if (error) {
            return <Navigate to={"/homepage"} replace />;
        }

        // remove localStorage infor in case session's expired and user didn't enter the 'log out' button:
        if (currentSeconds >= exp) {
            localStorage.clear();
            localStorage.setItem('toopad-mode', 'light');
        }

        if (role !== "PARENT" || currentSeconds >= exp || !isContained(userId, parentPrefix)) {
            return <Navigate to={"/homepage"} replace />
        }
        return children;
    }

    const ProtectSchoolNurseRoute = ({ children }) => {
        const schoolNursePrefix = "SN";
        const currentSeconds = Math.floor(Date.now() / 1000);
        const { role, userId, exp, error } = getPayloadResources() || {};
        if (error) {
            return <Navigate to={"/homepage"} replace />;
        }

        // remove localStorage infor in case session's expired and user didn't enter the 'log out' button:
        if (currentSeconds >= exp) {
            localStorage.clear();
            localStorage.setItem('toopad-mode', 'light');
        }

        if (role !== "SCHOOL_NURSE" || currentSeconds >= exp || !isContained(userId, schoolNursePrefix)) {
            return <Navigate to={"/homepage"} replace />
        }
        return children;
    }

    const ProtectManagerRoute = ({ children }) => {
        const managerPrefix = "MN";
        const currentSeconds = Math.floor(Date.now() / 1000);
        const { role, userId, exp, error } = getPayloadResources() || {};
        if (error) {
            return <Navigate to={"/homepage"} replace />;
        }

        // remove localStorage infor in case session's expired and user didn't enter the 'log out' button:
        if (currentSeconds >= exp) {
            localStorage.clear();
            localStorage.setItem('toopad-mode', 'light');
        }

        if (role !== "MANAGER" || currentSeconds >= exp || !isContained(userId, managerPrefix)) {
            return <Navigate to={"/homepage"} replace />
        }
        return children;
    }

    return {
        forAdmin: ProtectAdminRoute,
        forParent: ProtectParentRoute,
        forSchoolNurse: ProtectSchoolNurseRoute,
        forManager: ProtectManagerRoute,
        forAll: ProtectAllRoute
    }
}

export default App;
