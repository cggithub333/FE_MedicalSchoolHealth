
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';

import ProfileIcon from '@mui/icons-material/AssignmentInd';
import AccountManagementIcon from '@mui/icons-material/SwitchAccount';
import NotificationIcon from '@mui/icons-material/NotificationsActive';


const NavbarData = [
  //----------------part 1--------------------//
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'admin/profile',
    title: 'Profile',
    icon: <ProfileIcon />,
  },
  {
    segment: 'admin/notification',
    title: 'Notification',
    icon: <NotificationIcon />,
  },
  {
    kind: 'divider',
  },
  // -----------------Part 2------------------------//
  {
    kind: 'header',
    title: 'Account Management',
  },
  {
    segment: 'admin/accounts',
    title: 'Accounts',
    icon: <AccountManagementIcon />,
  },
  {
    kind: 'divider',
  },

  // -----------------Part 3------------------------//
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'admin/reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'report-a',
        title: 'Report A',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'report-b',
        title: 'Report B',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'admin/integration',
    title: 'Integration',
    icon: <LayersIcon />,
  },
];

export default NavbarData;