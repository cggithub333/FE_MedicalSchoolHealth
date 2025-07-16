// import { createTheme } from "@mui/material/styles";

// const lightPalette = {
//     mode: "light",
//     background: {
//         default: "#f5f5f5",
//         paper: "#ffffff",
//     },
//     text: {
//         primary: "#000000",
//         secondary: "#555555",
//     },
//     primary: {
//         main: "#1976d2",
//     },
// };

// const darkPalette = {
//     mode: "dark",
//     background: {
//         default: "#121212",
//         paper: "#1e1e1e",
//     },
//     text: {
//         primary: "#ffffff",
//         secondary: "#aaaaaa",
//     },
//     primary: {
//         main: "#90caf9",
//     },
// };

// const NavbarTheme = (mode) => createTheme({
//     cssVariables: {
//         colorSchemeSelector: "data-toolpad-color-scheme",
//     },
//     palette: mode === "light" ? lightPalette : darkPalette,
//     components: {
//         MuiDrawer: {
//             styleOverrides: {
//                 paper: ({ theme }) => ({
//                     background: theme.palette.mode === "light" ? "#e3f2fd" : theme.palette.background.paper,
//                     color: theme.palette.text.primary,
//                 }),
//             },
//         },
//         MuiDivider: {
//             styleOverrides: {
//                 root: ({ theme }) => ({
//                     backgroundColor: theme.palette.mode === "light" ? "#e3f2fd" : theme.palette.background.paper,
//                 }),
//             },
//         },
//         MuiListSubheader: {
//             styleOverrides: {
//                 root: ({ theme }) => ({
//                     backgroundColor: theme.palette.mode === "light" ? "#e3f2fd" : theme.palette.background.paper,
//                 }),
//             },
//         },
//     },
//     typography: {
//         fontFamily: "Poppins, Roboto, Arial, sans-serif",
//         fontWeightBold: 700,
//         h6: {
//             fontWeight: 700,
//             fontSize: "1.2rem",
//         },
//     },
// });

// export default NavbarTheme;


// import { createTheme } from "@mui/material/styles";

// const NavbarTheme = createTheme({
//     cssVariables: {
//         colorSchemeSelector: "data-toolpad-color-scheme",
//     },
//     colorSchemes: {
//         light: {
//             palette: {
//                 mode: "light",
//                 background: {
//                     default: "#f5f5f5",
//                     paper: "#EDF2FB",
//                 },
//                 primary: {
//                     main: "#1976d2",
//                 },
//                 text: {
//                     primary: "#000",
//                 },
//             },
//             components: {
//                 MuiDrawer: {
//                     styleOverrides: {
//                         paper: {
//                             background: '#e3f2fd', // Uniform sidebar color
//                             color: '#222',
//                         },
//                     },
//                 },
//                 MuiDivider: {
//                     styleOverrides: {
//                         root: {
//                             backgroundColor: '#e3f2fd', // Match sidebar color for dividers
//                         },
//                     },
//                 },
//                 MuiListSubheader: {
//                     styleOverrides: {
//                         root: {
//                             backgroundColor: '#e3f2fd', // Match sidebar color for subheaders
//                         },
//                     },
//                 },
//             },
//         },
//         dark: {
//             palette: {
//                 mode: "dark",
//                 background: {
//                     default: "#18191A",
//                     paper: "#23272F",
//                 },
//                 primary: {
//                     main: "#00bcd4",
//                 },
//                 text: {
//                     primary: "#fff",
//                 },
//             },
//         },
//     },

//     typography: {
//         fontFamily: "Poppins, Roboto, Arial, sans-serif",
//         fontWeightBold: 700,
//         h6: {
//             fontWeight: 700,
//             fontSize: "1.2rem",
//         },
//     },
// });

// export default NavbarTheme;


import { createTheme } from "@mui/material/styles";

const NavbarTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default NavbarTheme;
