
import { Routes, Route, Navigate } from "react-router-dom";
import ParentDashboardLayout from './AdminDashboardLayout';
import AdminComponentPagePackages from '../../../pages/admin/AdminComponentPagePackages';

const AdminDashboardRoutes = () => {

  return (
    <Routes>
      <Route element={<ParentDashboardLayout/>}>

        {/* main-contents */}
        <Route index element={<Navigate to="dashboard" />} /> {/* Navigate to dashboard right after login */}
        <Route path="dashboard" element={<AdminComponentPagePackages.DashboardHome/>}/>
        <Route path="profile" element={<AdminComponentPagePackages.Profile />} />
        <Route path="notification" element={<AdminComponentPagePackages.Notification/>}/>

        {/* account-management */}
        <Route path="accounts" element={<AdminComponentPagePackages.Accounts />}/>

        {/* analytics */}
        <Route path="reports">
          <Route path="report-a" element={ <AdminComponentPagePackages.ReportsA/> } />
          <Route path="report-b" element={ <AdminComponentPagePackages.ReportsB/> } />
        </Route>
        <Route path="integration" element={<AdminComponentPagePackages.Integration/>}/>
        
      </Route>
    </Routes>
  )
}

export default AdminDashboardRoutes;