import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

import LogoBranchImg from '../../assets/images/health_education_img2.png';


import NavbarData from './NavbarData';
import NavbarTheme from './navbar-theme';

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

function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  return (
    <>
      {/* preview-start */}
      <AppProvider
        navigation={NavbarData}
        router={router}
        theme={NavbarTheme}
        branding={{
          logo: <img src={LogoBranchImg}
            alt="School Medical logo"
            style={{
              // the width and height are fixed in their parent div, can over the parent's size
              height: '40px',
              width: 'auto',
            }}
          />,
          title: '',
          homeUrl: '/homepage',
        }}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
      {/* preview-end */}
    </>
  );
}

export default DashboardLayoutBasic;