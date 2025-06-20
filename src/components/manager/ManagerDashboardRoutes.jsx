import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerComponentPagePackages from '../../pages/manager/ManagerComponentPagePackages';
import ManagerDashboardLayout from './ManagerDashboardLayout';

const ManagerDashboardRoutes = () => {

    return (
        <Routes>
            <Route element={<ManagerDashboardLayout />}>
                {/*  main-contents */}
                <Route index element={<Navigate to="dashboard" />} /> {/* Navigate to dashboard right after login */}
                <Route path={"dashboard"} element={<ManagerComponentPagePackages.DashboardHome />} />
                <Route path={"profile"} element={<ManagerComponentPagePackages.Profile />} />
                <Route path={"notification"} element={<ManagerComponentPagePackages.Notification />} />

                {/* vaccination-campaign */}
                <Route path="vaccination-campaign">
                    <Route index element={<Navigate to="campaigns" />} />
                    <Route path="campaigns" element={<ManagerComponentPagePackages.CampaignVaccination />} />
                    <Route path="schedule" element={<ManagerComponentPagePackages.ScheduleVaccination />} />
                    <Route path="new" element={<ManagerComponentPagePackages.NewCampaignVaccination />} />
                </Route>

                {/* health-check-campaign */}
                <Route path="health-check-campaign">
                    <Route index element={<Navigate to="campaigns" />} />
                    <Route path="campaigns" element={<ManagerComponentPagePackages.HealthCheckCampaign />} />
                    <Route path="schedule" element={<ManagerComponentPagePackages.ScheduleHealthCheck />} />
                    <Route path="new" element={<ManagerComponentPagePackages.NewCampaignHealthCheck />} />
                </Route>

                {/* reports */}
                <Route path="reports">
                    <Route index element={<Navigate to="sales" />} />
                    <Route path="sales" element={<ManagerComponentPagePackages.ReportsA />} />
                    <Route path="traffic" element={<ManagerComponentPagePackages.ReportsB />} />
                </Route>

                {/* integration */}
                <Route path="integration" element={<ManagerComponentPagePackages.Integration />} />


            </Route>
        </Routes>
    )
}

export default ManagerDashboardRoutes;