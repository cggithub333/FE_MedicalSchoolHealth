import './index.css';

import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AdminDashboard from "./components/admin/AdminDashboard";
import ManagerDashboardRoutes from "./components/manager/ManagerDashboardRoutes";
import SchoolNurseDashboard from "./components/schoolnurse/SchoolNurseDashboard";
import ParentDashboard from "./components/parent/ParentDashboard";

import BuildingImage from './assets/images/building_worker.jpg';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/homepage" element={<Homepage/>} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                    <Route path="/manager/*" element={<ManagerDashboardRoutes />} />
                    <Route path="/schoolnurse/*" element={<SchoolNurseDashboard />} />
                    <Route path="/parent/*" element={<ParentDashboard />} />
                    <Route path="/*" element={<BuildingPage/>}/>
                </Routes>
            </Router>
        </>
    );
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
            <img style={{ width: "50vw", height: "auto", margin: "15px 30px"}} src={BuildingImage} alt={"building image"} />
        </div>
    </>
}

export default App;
