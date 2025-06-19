
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';

import ProfileIcon from '@mui/icons-material/AssignmentInd';
import NotificationIcon from '@mui/icons-material/SwitchAccount';
import AccountManagementIcon from '@mui/icons-material/NotificationsActive';


const NavbarData = [
  // Title: "Main Items"
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <ProfileIcon />,
  },
  {
    segment: 'notification',
    title: 'Notification',
    icon: <NotificationIcon />,
  },
  {
    segment: 'accounts',
    title: 'Accounts',
    icon: <AccountManagementIcon />,
  },
  {
    kind: 'divider',
  },
  // Title: "Main Items"
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

export default NavbarData;