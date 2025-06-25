import './index.css';

import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AdminDashboardRoutes from "./components/admin/Dashboard/AdminDashboardRoutes";
import ManagerDashboardRoutes from "./components/manager/Dashboard/ManagerDashboardRoutes";
import SchoolNurseDashboardRoutes from "./components/schoolnurse/Dashboard/SchoolNurseDashboardRoutes";
import ParentDashboardRoutes from "./components/parent/Dashboard/ParentDashboardRoutes";

import BuildingImage from './assets/images/building_worker.jpg';
import { Button, FormControl } from '@mui/material';

import useAuth from './hooks/auth/useAuth';
import { updateStatusOfNewestCampaignAction } from './api/manager/manager-requests-action/newest-campaign-request-action';

import { Base64 } from 'js-base64';

function App() {

    // authorize:
    const { success, error, isLoading } = useAuth();

    if (isLoading) {
        return <>Loading ...</>
    }

    if (error) {
        return <LoginFailed/>
    }

    if (success) {

        const token = localStorage.getItem('jwtToken');
        if (token == null) {
            return <>Token null roi</>
        }
        const payloadStr = token.split('.')[1];
        const decodedPayload = Base64.decode(payloadStr);
        return <LoginSuccess />
    }

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/homepage" element={<Homepage />} />
                    <Route path="/admin/*" element={<AdminDashboardRoutes />} />
                    <Route path="/manager/*" element={<ManagerDashboardRoutes />} />
                    <Route path="/schoolnurse/*" element={<SchoolNurseDashboardRoutes />} />
                    <Route path="/parent/*" element={<ParentDashboardRoutes />} />
                    <Route path="/*" element={<BuildingPage />} />
                </Routes>
            </Router>
        </>
    );

    // const handleSubmit = (e) => {

    //     console.log("Form submitted");

    //     e.preventDefault();

    //     try {
    //         const updateStatus = async () => {
    //             const response = await updateStatusOfNewestCampaignAction(5, 'In Progress');
    //             if (response.status === 200) {
    //                 console.log("Status updated successfully");
    //             } else {
    //                 console.error("Failed to update status");
    //             }
    //         }

    //         updateStatus();
    //         console.log("Form submitted successfully");

    //     } catch (error) {
    //         console.error("Error updating status:", error);
    //     }
    // }

    // return (
    //     <FormControl>
    //         <Button type={'submit'} variant="contained" color="primary" onClick={handleSubmit} style={{ margin: "30px" }}>
    //             Submit
    //         </Button>
    //     </FormControl>
    // )
}

const LoginFailed = () => {
    return <>
        Login Failed!
    </>
}

const LoginSuccess = () => {

    // const token = localStorage.getItem('jwtToken');
    // const payloadStr = Base64.decode(token.split('.')[1]);
    // const objInfor = JSON.parse(payloadStr);

    // console.log(objInfor);

    return <>
        Login Success! . Logined as role: `{localStorage.getItem('userRole')}`
    </>
}

const BuildingPage = () => {
    return <>
        <h1 style={{ fontSize: "20px", fontWeight: "700", margin: "30px" }}>Oops! This page's is in building. Comming soon</h1>

        <div style={{ marginLeft: "30px" }} >Back to admin page: <Link to={"/admin/"}>Click!</Link></div>
        <div style={{ marginLeft: "30px" }} >Back to manager page:<Link to={"/manager/"}>Click!</Link></div>
        <div style={{ marginLeft: "30px" }} >Back to school nurse page:<Link to={"/schoolnurse/"}>Click!</Link></div>
        <div style={{ marginLeft: "30px" }} >Back to parent page:<Link to={"/parent/"}>Click!</Link></div>

        <div>
            <img style={{ width: "50vw", height: "auto", margin: "15px 30px" }} src={BuildingImage} alt={"building image"} />
        </div>
    </>
}

const Homepage = () => {
    return <>
        <h1 style={{ fontSize: "20px", fontWeight: "700", margin: "30px" }}>Homepage's in building</h1>

        <div style={{ marginLeft: "30px" }} >Back to admin page: <Link to={"/admin/"}>Click!</Link></div>
        <div style={{ marginLeft: "30px" }} >Back to manager page:<Link to={"/manager/"}>Click!</Link></div>
        <div style={{ marginLeft: "30px" }} >Back to school nurse page:<Link to={"/schoolnurse/"}>Click!</Link></div>
        <div style={{ marginLeft: "30px" }} >Back to parent page:<Link to={"/parent/"}>Click!</Link></div>

        <div>
            <img style={{ width: "50vw", height: "auto", margin: "15px 30px" }} src={BuildingImage} alt={"building image"} />
        </div>
    </>
}

export default App;
