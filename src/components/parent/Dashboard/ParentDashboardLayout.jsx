import * as React from 'react';
import PropTypes from 'prop-types';
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
import { Outlet } from 'react-router-dom';
import LogoBranchImg from '../../../assets/images/health_education_img2.png';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import { FaChildReaching as ChildIcon } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';


import NavbarData from './NavbarData';
import NavbarTheme from './navbar-theme';

import MaleFaceIcon from '@mui/icons-material/Face';
import FemaleFaceIcon from '@mui/icons-material/Face3';
import StarIcon from '@mui/icons-material/Star';

// import custom hooks here..
import usePupils from '../../../hooks/parent/usePupils';

function ToolbarActionsUtility() {

  const { pupils, isLoading } = usePupils();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChildSelect = (child) => {
    // save information of the child to localStorage:
    window.localStorage.setItem("pupilId", child.pupilId);
    window.localStorage.setItem("pupilName", `${child.lastName} ${child.firstName}`);
    window.localStorage.setItem("pupilInfor", JSON.stringify(child));
    handleMenuClose();
  };

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
      {/* child icon as dropdown */}
      <IconButton
        color="inherit"
        sx={{ mr: 1, position: 'relative' }}
        onClick={handleMenuOpen}
      >
        <ChildIcon fontSize={"20px"} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { minWidth: 200 } }}
      >
        {isLoading ? (
          <MenuItem disabled>... loading ...</MenuItem>
        ) : (
          (pupils || []).map((child) => {

            const storedPupilId = window.localStorage.getItem("pupilId");
            const isInStorage = (child && child.pupilId && storedPupilId && (child.pupilId === storedPupilId));

            return (
              <MenuItem sx = {{
                          background: (isInStorage) ? "#1565c0" : "#fff",
                          color: (isInStorage) ? "#f7c27d" : "#000",
                          display: "flex",
                          gap: "10px",
                          alignItems: "center"
                        }}
                        key={child.pupilId} 
                        onClick={() => handleChildSelect(child)}>
                <span style={{ marginRight: 8 }}>
                  {child.gender === "M" ? <MaleFaceIcon fontSize="small" /> : <FemaleFaceIcon fontSize="small" />}
                </span>
                <span>{`${child.lastName} ${child.firstName}`}</span>
                {isInStorage && <span><StarIcon/></span>}
              </MenuItem>
            );
          })
        )}
      </Menu>
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
