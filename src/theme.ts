import { createTheme } from "@mui/material/styles";

const black = "#000000";
const blue = "#1565c6";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: blue,
      dark: "#0d47a1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: black,
      contrastText: "#ffffff",
    },
    background: {
      default: "#eef3f8",
      paper: "#ffffff",
    },
    text: {
      primary: black,
      secondary: "#1a237e",
    },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 800 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: black,
          color: "#ffffff",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          "&.Mui-selected": {
            backgroundColor: blue,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#0d47a1",
            },
          },
        },
      },
    },
  },
});

export default theme;
