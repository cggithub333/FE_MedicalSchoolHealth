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
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import { useDemoRouter } from '@toolpad/core/internal';


import LogoBranchImg from '../../assets/images/health_education_img2.png';
import AvatarImg from '../../assets/images/avatar.png';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import { FaChildReaching as ChildIcon } from "react-icons/fa6";

import NavbarData from './NavbarData';
import NavbarTheme from './navbar-theme';
import { Link } from 'react-router-dom';



function DemoPageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Typography>Dashboard content for {pathname}</Typography>
        </Box>
    );
}

DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

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
            <a href='/homepage'><img src={LogoBranchImg} alt="Logo" style={{ width: "auto", height: "40px" }} /></a>
        </Stack>
    );
}

function DashboardLayoutSlots(props) {
    const { window } = props;

    const [session, setSession] = React.useState({
        user: {
            name: 'Ha Hai Cuong',
            email: 'hhc9104@gmail.com',
            image: AvatarImg,
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: AvatarImg,
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

    const router = useDemoRouter('/dashboard');


    return (
        // Remove this provider when copying and pasting into your project.
        <>
            <AppProvider
                session={session}
                authentication={authentication}
                navigation={NavbarData}
                router={router}
                theme={NavbarTheme}

            >
                {/* preview-start */}
                <DashboardLayout
                    slots={{
                        appTitle: CustomAppTitle,
                        toolbarActions: ToolbarActionsUtility,
                        sidebarFooter: SidebarFooter,
                    }}
                >
                    <DemoPageContent pathname={router.pathname} />
                </DashboardLayout>
                {/* preview-end */}
            </AppProvider>
        </>
    );
}

export default DashboardLayoutSlots;
