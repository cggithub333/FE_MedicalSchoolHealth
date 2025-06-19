import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";

import NavbarData from "./NavbarData";
import NavbarTheme from "./navbar-theme";
import { MdPadding } from "react-icons/md";
import { ImFontSize } from "react-icons/im";

function DemoPageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
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

    const router = useDemoRouter("/dashboard");

    // Remove this const when copying and pasting into your project.
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        // Remove this provider when copying and pasting into your project.
        <DemoProvider window={demoWindow}>
            {/* preview-start */}
            <AppProvider
                navigation={NavbarData}
                branding={{
                    logo: (
                        <img
                            src="https://marketplace.canva.com/EAGKU6t2llU/2/0/1600w/canva-blue-green-white-simple-modern-medical-logo-enoKffV7vWg.jpg"
                            alt="MUI logo"
                        />
                    ),
                    title: "MUI",
                    homeUrl: "/toolpad/core/introduction",
                }}
                router={router}
                theme={{
                    ...NavbarTheme,
                    palette: {
                        ...NavbarTheme.palette,
                        mode: "dark",
                        primary: {
                            main: "#00bcd4",
                        },
                        background: {
                            default: "#18191A",
                            paper: "#23272F",
                        },
                        sidebar: {
                            background: "#18191A",
                            color: "#fff",
                            activeBackground: "#00bcd4",
                            activeColor: "#fff",
                        },
                    },
                    typography: {
                        ...NavbarTheme.typography,
                        fontFamily: "Poppins, Roboto, Arial, sans-serif",
                        fontWeightBold: 700,
                        h6: {
                            fontWeight: 700,
                            fontSize: "1.2rem",
                        },
                    },
                }}
                window={demoWindow}
                navigationProps={{
                    sx: {
                        "& .MuiDrawer-paper": {
                            background:
                                "linear-gradient(135deg, #23272F 0%, #18191A 100%)",
                            color: "#fff",
                            borderRight: "none",
                        },
                        "& .MuiListItemIcon-root": {
                            color: "#00bcd4",
                        },
                        "& .Mui-selected": {
                            background: "#00bcd4 !important",
                            color: "#fff !important",
                        },
                        "& .MuiListItemText-primary": {
                            fontWeight: 600,
                        },
                    },
                }}
            >
                <DashboardLayout>
                    <DemoPageContent pathname={router.pathname} />
                </DashboardLayout>
            </AppProvider>
            {/* preview-end */}
        </DemoProvider>
    );
}

export default DashboardLayoutBasic;
