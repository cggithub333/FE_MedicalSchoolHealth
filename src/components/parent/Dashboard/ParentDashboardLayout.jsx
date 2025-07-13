import { useEffect } from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import { Outlet, useLocation } from 'react-router-dom';
import LogoBranchImg from '../../../assets/images/health_education_img2.png';
import { FaChildReaching as ChildIcon } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

import NotificationBell from '@components/magic/NotificationBell/NotificationBell';

import NavbarData from './NavbarData';
import NavbarTheme from './navbar-theme';

import MaleFaceIcon from '@mui/icons-material/Face';
import FemaleFaceIcon from '@mui/icons-material/Face3';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';

// import custom hooks here..
import usePupils from '../../../hooks/parent/usePupils';

// encode/decode service:
import { Base64 } from 'js-base64';
import { useNavigate } from 'react-router-dom';
import useAllNotifications from '@hooks/parent/health-check/useAllNotifications';

import { stylePupilBtn, styleChildItem } from './parent-dashboard-layout-custom-css.js';
import Logout from '../../Logout.jsx';
import { getPayloadResources } from '../../../utils/jwt-utils.js';
import { Box } from '@mui/material';

import useMyInformation from '@hooks/common/useMyInformation.js';

function ToolbarActionsUtility() {

  const location = useLocation();

  // load pupil information from localStorage:
  const { pupils, isLoading } = usePupils();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const { quantity: totalNotificationQuantity } = useAllNotifications();

  // if pupils is defined, store first pupil's information in localStorage:
  React.useEffect(() => {
    if (pupils && pupils.length > 0) {
      const firstPupil = pupils[0];
      if (!window.localStorage.getItem("pupilId")) {
        window.localStorage.setItem("pupilId", firstPupil.pupilId);
        window.localStorage.setItem("pupilName", `${firstPupil.lastName} ${firstPupil.firstName}`);
        window.localStorage.setItem("pupilGender", `${firstPupil.gender}`);
        const encodedStudentInfor = Base64.encode(JSON.stringify(firstPupil));
        window.localStorage.setItem("pupilInfor", encodedStudentInfor);
      }
    }
  }, [pupils]);

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
    window.localStorage.setItem("pupilGender", `${child.gender}`);
    const encodedStudentInfor = Base64.encode(JSON.stringify(child));
    window.localStorage.setItem("pupilInfor", encodedStudentInfor);
    handleMenuClose();
    window.location.reload();
  };

  // for debug:
  // useEffect (() => {
  //   // console.log("Current location:", location.pathname);
  // }, [location]); // reset for each location change

  const forAllChildrenLink = [
    "/parent/declaration/health-declaration",
    "/parent/profile",
    "/parent/notification"
  ]

  return (
    <Stack direction="row" alignItems="center" spacing={3} sx={{ flexGrow: 1 }}>

      {/* show current pupil */}
      <IconButton
        sx={stylePupilBtn(window.localStorage.getItem("pupilGender"))}
      >
        {((forAllChildrenLink || []).some(item => location.pathname.includes(item))) ?
          <span style={{ paddingLeft: "10px", fontSize: "20px" }}>
            <ChildIcon />
          </span>
          :
          <>
            {window.localStorage.getItem("pupilGender") &&
              <span style={{ paddingLeft: "10px", fontSize: "20px" }}>
                {window.localStorage.getItem("pupilGender") === "M" ? <MaleFaceIcon /> : <FemaleFaceIcon />}
              </span>
            }
          </>
        }
        {((forAllChildrenLink || []).some(item => location.pathname.includes(item))) ?
          <span style={{ fontSize: "20px", marginLeft: "10px", padding: "2px", paddingRight: "10px" }}>
            All Children
          </span>
          :
          <>
            {window.localStorage.getItem("pupilName") && window.localStorage.getItem("pupilGender") &&
              <span style={{ fontSize: "20px", marginLeft: "10px", padding: "2px", paddingRight: "10px" }}>
                {window.localStorage.getItem("pupilName")}
              </span>
            }
          </>
        }
      </IconButton>

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
        <ChildIcon fontSize={"23px"} />
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
          <MenuItem disabled>loading..</MenuItem>
        ) : (
          (pupils || []).map((child) => {

            const storedPupilId = window.localStorage.getItem("pupilId");
            const isInStorage = (child && child.pupilId && storedPupilId && (child.pupilId === storedPupilId));

            return (
              <MenuItem sx={styleChildItem(isInStorage)}
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
      <NotificationBell totalNotificationQuantity={totalNotificationQuantity} toLink={'/parent/notification'}/>

      {/* <Box component={Link} to="/parent/notification" sx={{ textDecoration: 'none', color: 'inherit' }}>
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Badge color="secondary" badgeContent={totalNotificationQuantity} max={10}>
            <NotificationsActiveIcon />
          </Badge>
        </IconButton>
      </Box> */}

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
      sx={{ mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', marginLeft: "20px" }}
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
  const { personalInforState, error: errorPersonalInfor, loading: loadingPersonalInfor} = useMyInformation();
  // debug:
  // if (loadingPersonalInfor)
  //   console.log("Loading personal infor...");
  // else 
  //   console.log("personalInfor: ", personalInforState);

  const [ isLogout, setIsLogout ] = React.useState(false);

  const [session, setSession] = React.useState({
    user: {
      name: localStorage.getItem('userFullName') ? localStorage.getItem('userFullName') : "",
      email: personalInforState?.email ? personalInforState?.email : 'Email has not updated yet',
      image: '/assets/images/user_avatar.jpg',
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: localStorage.getItem('userFullName') ? localStorage.getItem('userFullName') : "",
            email: personalInforState?.email ? personalInforState?.email : 'Email has not updated yet',
            image: '/assets/images/user_avatar.jpg',
          },
        });
      },
      signOut: () => {
        setSession(null);
        setIsLogout(true);
      },
    };
  }, []);

  // update session when personal information changes (avoid the null value at first time render);
  React.useEffect(() => {

    if (personalInforState) {
      setSession({
        user: {
          name: localStorage.getItem('userFullName') ? localStorage.getItem('userFullName') : "",
          email: personalInforState?.email ? personalInforState?.email : 'Email has not updated yet',
          image: '/assets/images/user_avatar.jpg',
        },
      });
    }

  }, [personalInforState])

  if (isLogout) {
    return <Logout/>;
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
