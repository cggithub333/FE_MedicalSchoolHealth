import CampaignsHealthCheck from './health-check-campaign/Campaigns.jsx';
import HealthCheckHistory from './health-check-campaign/HealthCheckHistory.jsx';
import SurveysHealthCheck from './health-check-campaign/Surveys.jsx';
import ScheduleHealthCheck from './health-check-campaign/Schedule.jsx';

import CampaignsVaccination from './vaccination-campaign/Campaigns.jsx';
import VaccinationHistory from './vaccination-campaign/VaccinationHistory.jsx';
import SurveysVaccination from './vaccination-campaign/Surveys.jsx';
import ScheduleVaccination from './vaccination-campaign/Schedule.jsx';

import HealthDeclaration from './health-management/HealthDeclaration.jsx';
import Prescription from './health-management/Prescription.jsx';
import MedicalEvents from './health-management/MedicalEvents.jsx';

import Notification from './main-contents/Notification.jsx';
import DashboardHome from './main-contents/DashboardHome.jsx';
import Profile from './main-contents/Profile.jsx';

const ParentComponentPagePackages = {
  CampaignsHealthCheck,
  HealthCheckHistory,
  SurveysHealthCheck,
  ScheduleHealthCheck,
  CampaignsVaccination,
  VaccinationHistory,
  SurveysVaccination,
  ScheduleVaccination,
  HealthDeclaration,
  Prescription,
  MedicalEvents,
  Notification,
  DashboardHome,
  Profile,
};

export default ParentComponentPagePackages; 