import { createTheme } from "@mui/material/styles";

const NavbarTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: {
        light: {
            palette: {
                mode: "light",
                background: {
                    default: "#f5f5f5",
                    paper: "#EDF2FB",
                },
                primary: {
                    main: "#1976d2",
                },
                text: {
                    primary: "#000",
                },
            },
        },
        dark: {
            palette: {
                mode: "dark",
                background: {
                    default: "#18191A",
                    paper: "#23272F",
                },
                primary: {
                    main: "#00bcd4",
                },
                text: {
                    primary: "#fff",
                },
            },
        },
    },
    components: {
        // ✅ This ensures sidebar items & icons follow the theme
        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: "inherit",
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: "inherit",
                },
            },
        },
        // ✅ Sidebar background (Drawer)
        MuiDrawer: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    background: theme.palette.mode === "dark" ? "#263238" : "#e3f2fd",
                    color: theme.palette.text.primary,
                }),
            },
        },
        // ✅ Divider + Subheader if you use them
        MuiDivider: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#263238" : "#e3f2fd",
                }),
            },
        },
        MuiListSubheader: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#263238" : "#e3f2fd",
                }),
            },
        },
    },
    typography: {
        fontFamily: "Poppins, Roboto, Arial, sans-serif",
        fontWeightBold: 700,
        h6: {
            fontWeight: 700,
            fontSize: "1.2rem",
        },
    },
});

export default NavbarTheme;
