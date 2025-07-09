import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import ProfileIcon from "@mui/icons-material/AssignmentInd";
import MedicalEventIcon from "@mui/icons-material/Accessible";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HealthCheckIcon from "@mui/icons-material/MedicationLiquid";
import SettingsIcon from '@mui/icons-material/SettingsSuggest';
import ManIcon from '@mui/icons-material/Man';

import { GiMedicines as Prescriptionicon } from "react-icons/gi";
import { MdCampaign as Campaign } from "react-icons/md";
import { AiOutlineSchedule as ScheduleIcon } from "react-icons/ai";
import { IoAddCircleSharp as NewCampaignIcon } from "react-icons/io5";

const NavbarData = [
    //----------------part 1--------------------//
    {
        kind: "header",
        title: "Main",
    },
    {
        segment: "schoolnurse/dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
    },
    {
        segment: "schoolnurse/profile",
        title: "Profile",
        icon: <ProfileIcon />,
    },
    {
        segment: "schoolnurse/notification",
        title: "Notification",
        icon: <NotificationsActiveIcon />,
    },
    {
        kind: "divider",
    },
    //----------------part 2--------------------//
    {
        kind: "header",
        title: "Health Management",
    },
    {
        segment: 'schoolnurse/pupils-management',
        title: 'Pupils Management',
        icon: <ManIcon />,
    },
    {
        segment: "schoolnurse/medical-events",
        title: "Medical Events",
        icon: <MedicalEventIcon />,
    },
    {
        segment: "schoolnurse/prescription",
        title: "Prescription",
        icon: <Prescriptionicon />,
    },

    {
        kind: "divider",
    },
    //----------------part 3--------------------//
    {
        kind: "header",
        title: "Campaigns Management",
    },
    {
        segment: "schoolnurse/vaccination-campaign",
        title: "Vaccinations Campaign",
        icon: <VaccinesIcon />,
        children: [
            {
                segment: "campaigns",
                title: "Campaigns",
                icon: <Campaign />,
            },
            {
                segment: "schedule",
                title: "Schedule",
                icon: <ScheduleIcon />,
            },
        ],
    },
    {
        segment: "schoolnurse/health-check-campaign",
        title: "Health Check Campaign",
        icon: <HealthCheckIcon />,
        children: [
            {
                segment: "campaigns",
                title: "Campaigns",
                icon: <Campaign />,
            },
            {
                segment: "schedule",
                title: "Schedule",
                icon: <ScheduleIcon />,
            },
        ],
    },
    {
        kind: "divider",
    }, 
    {
        segment: 'schoolnurse/settings',
        title: 'Settings',
        icon: <SettingsIcon />
    },
];

export default NavbarData;
