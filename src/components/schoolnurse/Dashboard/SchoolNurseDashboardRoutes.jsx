import { Routes, Route, Navigate } from 'react-router-dom';
import SchoolNurseComponentPagePackages from '../../../pages/schoolnurse/SchoolNurseComponentPagePackages';
import SchoolNurseDashboard from './SchoolNurseDashboardLayout';

const SchoolNurseDashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SchoolNurseDashboard />}>
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<SchoolNurseComponentPagePackages.DashboardHome />} />
                <Route path="profile" element={<SchoolNurseComponentPagePackages.Profile />} />
                <Route path="notification" element={<SchoolNurseComponentPagePackages.Notification />} />

                <Route path="vaccination-campaign">
                    <Route path="schedule" element={<SchoolNurseComponentPagePackages.ScheduleVaccination />} />
                    <Route path="campaigns" element={<SchoolNurseComponentPagePackages.VaccinationCampaign />} />
                </Route>

                <Route path="health-check-campaign">
                    <Route path="schedule" element={<SchoolNurseComponentPagePackages.ScheduleHealthCheck />} />
                    <Route path="campaigns" element={<SchoolNurseComponentPagePackages.HealthCheckCampaign />} />
                </Route>

                <Route path="medical-events" element={<SchoolNurseComponentPagePackages.MedicalEvents />} />
                <Route path="pupils-management" element={<SchoolNurseComponentPagePackages.PupilsManagement />} />
                <Route path="prescription" element={<SchoolNurseComponentPagePackages.Prescription />} />
                <Route path="prescription/prescription-requests" element={<SchoolNurseComponentPagePackages.PrescriptionRequestPage />} />
                {/* Add more routes as needed */}

                {/* Settings */}
                <Route path="settings" element={<SchoolNurseComponentPagePackages.Settings />} />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/schoolnurse/dashboard" replace />} />
            </Route>
        </Routes>
    );
}

export default SchoolNurseDashboardRoutes;
