import { Routes, Route, Navigate } from 'react-router-dom';
import SchoolNurseComponentpagePackages from '../../pages/schoolnurse/SchoolNurseComponentPagePackages';
import SchoolNurseDashboard from './SchoolNurseDashboardLayout';

const SchoolNurseDashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SchoolNurseDashboard />}>
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<SchoolNurseComponentpagePackages.DashboardHome />} />
                <Route path="profile" element={<SchoolNurseComponentpagePackages.Profile />} />
                <Route path="notification" element={<SchoolNurseComponentpagePackages.Notification />} />

                <Route path="vaccination-campaign" element={<SchoolNurseComponentpagePackages.VaccinationCampaign />} />
                <Route path="vaccination-campaign/schedule" element={<SchoolNurseComponentpagePackages.ScheduleVaccination />} />
                <Route path="vaccination-campaign/campaigns" element={<SchoolNurseComponentpagePackages.VaccinationCampaign />} />

                <Route path="health-check-campaign/schedule" element={<SchoolNurseComponentpagePackages.ScheduleHealthCheck />} />
                <Route path="health-check-campaign/campaigns" element={<SchoolNurseComponentpagePackages.HealthCheckCampaign />} />

                <Route path="medical-events" element={<SchoolNurseComponentpagePackages.MedicalEvents />} />
                <Route path="prescription" element={<SchoolNurseComponentpagePackages.Prescription />} />
                {/* Add more routes as needed */}

                <Route path="*" element={<Navigate to="dashboard" />} /> {/* Redirect to dashboard for any unknown routes */}
            </Route>
        </Routes>
    );
}

export default SchoolNurseDashboardRoutes;