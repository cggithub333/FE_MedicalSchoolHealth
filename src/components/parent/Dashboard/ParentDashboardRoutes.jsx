import { Routes, Route, Navigate } from 'react-router-dom';
import ParentComponentPagePackages from '../../../pages/parent/ParentComponentPagePackages';
import ParentDashboardLayout from './ParentDashboardLayout';

const ParentDashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<ParentDashboardLayout />}>
        {/* main-contents  */}
        <Route index element={<Navigate to="dashboard" />} /> {/* Navigate to dashboard right after login */}
        <Route path={"dashboard"} element={<ParentComponentPagePackages.DashboardHome />} />
        <Route path={"profile"} element={<ParentComponentPagePackages.Profile />} />
        <Route path={"notification"} element={<ParentComponentPagePackages.Notification />} />
        {/* health-management */}
        <Route path={"prescription"} element={<ParentComponentPagePackages.Prescription />} />
        <Route path={"prescription/new-prescription"} element={<ParentComponentPagePackages.NewPrescription />} />
        <Route path={"prescription/prescription-logs"} element={<ParentComponentPagePackages.PrescriptionLogs />} />
        <Route path={"medical-events"} element={<ParentComponentPagePackages.MedicalEvents />} />

        {/* Declaration */}
        <Route path={"declaration"}>
          <Route path={"health-declaration"} element={<ParentComponentPagePackages.HealthDeclaration />} />
          <Route path={"vaccination-declaration"} element={<ParentComponentPagePackages.VaccinationDeclaration />} />
        </Route>

        {/* vaccination-campaign */}
        <Route path={"vaccination-campaign"}>
          <Route path={"campaigns"} element={<ParentComponentPagePackages.CampaignsVaccination />} />
          <Route path={"vaccination-history"} element={<ParentComponentPagePackages.VaccinationHistory />} />
          <Route path={"surveys"} element={<ParentComponentPagePackages.SurveysVaccination />} />
        </Route>

        {/* health-check-campaign */}
        <Route path={"health-check-campaign"}>
          <Route path={"campaigns"} element={<ParentComponentPagePackages.CampaignsHealthCheck />} />
          <Route path={"health-check-history"} element={<ParentComponentPagePackages.HealthCheckHistory />} />
          <Route path={"surveys"} element={<ParentComponentPagePackages.SurveysHealthCheck />} />
        </Route>

        {/* campaign schedule */}
        <Route path={"campaign-schedule"} element={<ParentComponentPagePackages.CampaignSchedule/>} />

        {/* for settings */}
        <Route path="settings" element={<ParentComponentPagePackages.Settings />} />

        {/* Fallback route - invalid route -> navigate to dashboard */}
        <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default ParentDashboardRoutes; 