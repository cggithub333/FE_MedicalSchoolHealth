import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import ProfileIcon from "@mui/icons-material/AssignmentInd";
import MedicalEventIcon from "@mui/icons-material/Accessible";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HealthCheckIcon from "@mui/icons-material/MedicationLiquid";
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
        segment: "dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
    },
    {
        segment: "profile",
        title: "Profile",
        icon: <ProfileIcon />,
    },
    {
        segment: "notification",
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
        segment: "medical-events",
        title: "Medical Events",
        icon: <MedicalEventIcon />,
    },
    {
        segment: "prescription",
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
        segment: "vaccination-campaign",
        title: "Vaccinations Campaign",
        icon: <VaccinesIcon />,
        children: [
            {
                segment: "campaigns",
                title: "Campaigns",
                icon: <Campaign />,
            },
            {
                segment: "schedule  ",
                title: "Schedule",
                icon: <ScheduleIcon />,
            },
        ],
    },
    {
        segment: "Health Check Campaign",
        title: "Health Check Campaign",
        icon: <HealthCheckIcon />,
        children: [
            {
                segment: "campaigns",
                title: "Campaigns",
                icon: <Campaign />,
            },
            {
                segment: "schedule  ",
                title: "Schedule",
                icon: <ScheduleIcon />,
            },
        ],
    },
];

export default NavbarData;
