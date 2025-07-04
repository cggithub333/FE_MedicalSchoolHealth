import DashboardIcon from '@mui/icons-material/Dashboard';

import ProfileIcon from '@mui/icons-material/AssignmentInd';
import NotificationIcon from '@mui/icons-material/SwitchAccount';
import MedicalEventIcon from '@mui/icons-material/MedicalInformation';
import DeclarationIcon from '@mui/icons-material/Description';

import VaccinationCampaignIcon from '@mui/icons-material/Vaccines';
import HealthCheckCampaignIcon from '@mui/icons-material/HealthAndSafety';

import CampaignsIcon from '@mui/icons-material/ReceiptLong';
import VaccinationHistoryInforIcon from '@mui/icons-material/YoutubeSearchedFor';
import HealthCheckHistoryInforIcon from '@mui/icons-material/YoutubeSearchedFor';
import ScheduleIcon from '@mui/icons-material/CalendarMonth';

import { GiMedicines as PrescriptionIcon } from "react-icons/gi";

import { RiSurveyFill as SurveyIcon } from "react-icons/ri";

const NavbarData = [
  //----------------part 1--------------------//
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'parent/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'parent/profile',
    title: 'Profile',
    icon: <ProfileIcon />,
  },
  {
    segment: 'parent/notification',
    title: 'Notification',
    icon: <NotificationIcon />,
  },
  {
    kind: 'divider',
  },
  //----------------part 2--------------------//
  {
    kind: 'header',
    title: 'Health management',
  },
  {
    segment: 'parent/medical-events',
    title: 'Medical Events',
    icon: <MedicalEventIcon />,
  },
  {
    segment: 'parent/prescription',
    title: 'Prescription',
    icon: <PrescriptionIcon />,
  },
  {
    segment: 'parent/declaration',
    title: 'Declarations',
    icon: <DeclarationIcon />,
    children: [
      {
        segment: 'vaccination-declaration',
        title: 'Vaccination Declaration',
        icon: <DeclarationIcon />,
      },
      {
        segment: 'health-declaration',
        title: 'Health Declaration',
        icon: <DeclarationIcon />,
      }
    ],
  },
  {
    kind: 'divider',
  },
  //----------------part 3--------------------//
  {
    kind: 'header',
    title: 'Campaigns Management',
  },
  {
    segment: 'parent/vaccination-campaign',
    title: 'Vaccination Campaign',
    icon: <VaccinationCampaignIcon />,
    children: [
      {
        segment: 'campaigns',
        title: 'Campaigns',
        icon: <CampaignsIcon />,
      },
      {
        segment: 'surveys',
        title: 'Surveys',
        icon: <SurveyIcon />,
      },
      {
        segment: 'vaccination-history',
        title: 'Vaccination History',
        icon: <VaccinationHistoryInforIcon />,
      },
    ],
  },
  {
    segment: 'parent/health-check-campaign',
    title: 'Health Check Campaign',
    icon: <HealthCheckCampaignIcon />,
    children: [
      {
        segment: 'campaigns',
        title: 'Campaigns',
        icon: <CampaignsIcon />,
      },
      {
        segment: 'surveys',
        title: 'Surveys',
        icon: <SurveyIcon />,
      },
      {
        segment: 'health-check-history',
        title: 'Health Check History',
        icon: <HealthCheckHistoryInforIcon />,
      },
    ],
  },
  {
    segment: 'parent/campaign-schedule',
    title: 'Campaign Schedule',
    icon: <ScheduleIcon />
  }
];

export default NavbarData;