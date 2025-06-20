import { Routes, Route, Navigate } from 'react-router-dom';
import ParentComponentPagePackages from '../../pages/parent/ParentComponentPagePackages';
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
        <Route path={"health-declaration"} element={<ParentComponentPagePackages.HealthDeclaration />} />
        <Route path={"prescription"} element={<ParentComponentPagePackages.Prescription />} />
        <Route path={"medical-events"} element={<ParentComponentPagePackages.MedicalEvents />} />

        {/* vaccination-campaign */}
        <Route path={"vaccination-campaign/campaigns"} element={<ParentComponentPagePackages.CampaignsVaccination />} />
        <Route path={"vaccination-campaign/vaccination-history"} element={<ParentComponentPagePackages.VaccinationHistory />} />
        <Route path={"vaccination-campaign/surveys"} element={<ParentComponentPagePackages.SurveysVaccination />} />
        <Route path={"vaccination-campaign/schedule"} element={<ParentComponentPagePackages.ScheduleVaccination />} />

        {/* health-check-campaign */}
        <Route path={"health-check-campaign/campaigns"} element={<ParentComponentPagePackages.CampaignsHealthCheck />} />
        <Route path={"health-check-campaign/health-check-history"} element={<ParentComponentPagePackages.HealthCheckHistory />} />
        <Route path={"health-check-campaign/surveys"} element={<ParentComponentPagePackages.SurveysHealthCheck />} />
        <Route path={"health-check-campaign/schedule"} element={<ParentComponentPagePackages.ScheduleHealthCheck />} />
      </Route>
    </Routes>
  );
};

export default ParentDashboardRoutes; 