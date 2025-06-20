import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { AppProvider } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import LogoBranchImg from '../../assets/images/health_education_img2.png';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Badge from '@mui/material/Badge';


import NavbarData from './NavbarData';
import NavbarTheme from './navbar-theme';
import { Link, Outlet } from 'react-router-dom';


function ToolbarActionsUtility() {
    return (
        <Stack direction="row" alignItems="center" spacing={3} sx={{ flexGrow: 1 }}>
            {/* search bar */}
            <>
                <Tooltip title="Search" enterDelay={1000}>
                    <div>
                        <IconButton
                            type="button"
                            aria-label="search"
                            sx={{
                                display: { xs: 'inline', md: 'none' },
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </div>
                </Tooltip>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    slotProps={{
                        input: {
                            endAdornment: (
                                <IconButton type="button" aria-label="search" size="small">
                                    <SearchIcon />
                                </IconButton>
                            ),
                            sx: { pr: 0.5 },
                        },
                    }}
                    sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
                />
            </>
            {/* child icon */}
            {/* <IconButton color="inherit" sx={{ mr: 1 }}>
                <ChildIcon fontSize={"20px"} />
            </IconButton> */}

            {/* Notification icon to the right of the search bar */}
            <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge color="secondary" badgeContent={100}>
                    <NotificationsActiveIcon />
                </Badge>
            </IconButton>



            {/* Switch mode */}
            <ThemeSwitcher />

            {/* Account */}
            <Account />
        </Stack>
    );
}

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";

function CustomNavItem({ icon, title, active, ...props }) {
    const theme = useTheme();

    return (
        <ListItemButton
            selected={active}
            sx={{
                color: theme.palette.text.primary,
                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                },
            }}
            {...props}
        >
            {icon && (
                <ListItemIcon sx={{ color: "inherit" }}>
                    {icon}
                </ListItemIcon>
            )}
            <ListItemText
                primary={title}
                primaryTypographyProps={{ color: "inherit" }}
            />
        </ListItemButton>
    );
}


function SidebarFooter({ mini }) {
    return (
        <Typography
            variant="caption"
            sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
            {mini ? '© MUI' : `© ${new Date().getFullYear()} Made with love by MUI`}
        </Typography>
    );
}

SidebarFooter.propTypes = {
    mini: PropTypes.bool.isRequired,
};

function CustomAppTitle() {
    return (
        <Stack direction="row" alignItems="center" spacing={2} >
            <Link to={'/homepage'}><img src={LogoBranchImg} alt="Logo" style={{ width: "auto", height: "40px" }} /></Link>
        </Stack>
    );
}

function DashboardLayoutSlots(props) {
    const { window } = props;

    const [session, setSession] = React.useState({
        user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

    return (
        // Remove this provider when copying and pasting into your project.
        <>
            <ReactRouterAppProvider
                session={session}
                authentication={authentication}
                navigation={NavbarData}
                theme={NavbarTheme}

            >
                {/* preview-start */}
                <DashboardLayout
                    slots={{
                        appTitle: CustomAppTitle,
                        toolbarActions: ToolbarActionsUtility,
                        sidebarFooter: SidebarFooter,
                        navItem: CustomNavItem,
                    }}
                >
                    <Outlet />
                </DashboardLayout>
                {/* preview-end */}
            </ReactRouterAppProvider>
        </>
    );
}

export default DashboardLayoutSlots;
