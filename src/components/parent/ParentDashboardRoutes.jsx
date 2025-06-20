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
        <Route path={"vaccination-campaign"}>
          <Route path={"campaigns"} element={<ParentComponentPagePackages.CampaignsVaccination />} />
          <Route path={"vaccination-history"} element={<ParentComponentPagePackages.VaccinationHistory />} />
          <Route path={"surveys"} element={<ParentComponentPagePackages.SurveysVaccination />} />
          <Route path={"schedule"} element={<ParentComponentPagePackages.ScheduleVaccination />} />
        </Route>

        {/* health-check-campaign */}
        <Route path={"health-check-campaign"}>
          <Route path={"campaigns"} element={<ParentComponentPagePackages.CampaignsHealthCheck />} />
          <Route path={"health-check-history"} element={<ParentComponentPagePackages.HealthCheckHistory />} />
          <Route path={"surveys"} element={<ParentComponentPagePackages.SurveysHealthCheck />} />
          <Route path={"schedule"} element={<ParentComponentPagePackages.ScheduleHealthCheck />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default ParentDashboardRoutes; 