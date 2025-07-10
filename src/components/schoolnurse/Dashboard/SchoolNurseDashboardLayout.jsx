import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import LogoBranchImg from '../../../assets/images/health_education_img2.png';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Badge from '@mui/material/Badge';
import HomeIcon from '@mui/icons-material/Home';

import { FaChildReaching as ChildIcon } from "react-icons/fa6";

import NavbarData from './NavbarData';
import NavbarTheme from './navbar-theme';
import { Link, Outlet } from 'react-router-dom';
import Logout from '@components/Logout';

import { useSelector } from 'react-redux';

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

            {/* Homepage icon */}
            <Box component={Link} to="/homepage" sx={{ textDecoration: 'none', color: 'inherit' }}>
                <IconButton
                    color="inherit"
                    sx={{ mr: 1, position: 'relative' }}
                ><HomeIcon fontSize={"23px"} />
                </IconButton>
            </Box>


            {/* Switch mode */}
            {/* <ThemeSwitcher /> */}

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
            {mini ? '© Medical' : `© ${new Date().getFullYear()} Medical Health System`}
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

    // load personal information of the user from state:
    const personalInfor = useSelector((state) => state.personalInfor.information);
      // debug:
    console.log("personalInfor: ", personalInfor);

    const [isLogout, setIsLogout] = React.useState(false);
    const { window } = props;

    const [session, setSession] = React.useState({
        user: {
            name: localStorage.getItem('userFullName') ? localStorage.getItem('userFullName') : "",
            email: personalInfor.email ? personalInfor.email : 'Email has not updated yet',
            image: '/assets/images/user_avatar.jpg', // UserAvatarImage
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: localStorage.getItem('userFullName') ? localStorage.getItem('userFullName') : "",
                        email: personalInfor.email ? personalInfor.email : 'Email has not updated yet',
                        image: '/assets/images/user_avatar.jpg', // UserAvatarImage
                    },
                });
            },
            signOut: () => {
                setSession(null);
                setIsLogout(true);
            },
        };
    }, []);

    if (isLogout) {
        return <Logout />
    }
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
