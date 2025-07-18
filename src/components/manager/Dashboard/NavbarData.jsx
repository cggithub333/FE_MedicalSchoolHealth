import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import ProfileIcon from "@mui/icons-material/AssignmentInd";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HealthCheckIcon from "@mui/icons-material/MedicationLiquid";
import MedicalEventIcon from "@mui/icons-material/Accessible";
import ManIcon from '@mui/icons-material/Man';
import SettingsIcon from '@mui/icons-material/SettingsSuggest';
import { GiMedicinePills as PrescriptionIcon } from "react-icons/gi";
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
        segment: "manager/dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
    },
    {
        segment: "manager/profile",
        title: "Profile",
        icon: <ProfileIcon />,
    },
    // {
    //     segment: "manager/notification",
    //     title: "Notification",
    //     icon: <NotificationsActiveIcon />,
    // },

    {
        kind: "divider",

    },

    // -----------------Part 2------------------------//
    {
        kind: 'header',
        title: 'Pupils Management',
    },
    {
        segment: 'manager/pupils-management',
        title: 'Pupils Management',
        icon: <ManIcon />,
    },
    {
        segment: "manager/medical-events",
        title: "Medical Events",
        icon: <MedicalEventIcon />,
    },
    {
        segment: "manager/prescriptions",
        title: "Prescriptions",
        icon: <PrescriptionIcon />,
    },
    {
        kind: 'divider',
    },
    //----------------part 3--------------------//
    {
        kind: "header",
        title: "Campaigns Management",
    },
    {
        segment: "manager/vaccination-campaign",
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
            {
                segment: "new",
                title: "New Vaccination",
                icon: <NewCampaignIcon />,
            },
        ],
    },
    {
        segment: "manager/health-check-campaign",
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
            {
                segment: "new",
                title: "New Health Check",
                icon: <NewCampaignIcon />,
            },
        ],
    },
    {
        kind: "divider",
    },
    //----------------part 3--------------------//
    {
        kind: "header",
        title: "Reports",
    },
    {
        segment: "manager/reports",
        title: "Reports",
        icon: <BarChartIcon />,
        // children: [
        //     {
        //         segment: "sales",
        //         title: "Sales",
        //         icon: <DescriptionIcon />,
        //     },
        //     {
        //         segment: "traffic",
        //         title: "Traffic",
        //         icon: <DescriptionIcon />,
        //     },
        // ],
    },

    {
        segment: "manager/integration",
        title: "Integrations",
        icon: <LayersIcon />,
    },
    {
        kind: "divider",
    },
    {
        segment: 'manager/settings',
        title: 'Settings',
        icon: <SettingsIcon />
    },
];

export default NavbarData;
