import { Authenticator } from "@aws-amplify/ui-react";
import { Box, ThemeProvider, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ReadingApp from "./ReadingApp.tsx";
import theme from "./theme";

function AuthHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        color: "#fff",
        maxWidth: 28 * 16,
        mx: "auto",
        mb: 2,
      }}
    >
      <Box
        component="img"
        src="/reading-comprehension-aj.svg"
        alt=""
        sx={{ width: 48, height: 48, bgcolor: "#fff", borderRadius: 1.5 }}
      />
      <Box>
        <Typography
          variant="overline"
          sx={{ letterSpacing: "0.12em", color: "#90caf9", lineHeight: 1 }}
        >
          ReadingComprehensionAJ
        </Typography>
        <Typography variant="h5" sx={{ color: "#fff" }}>
          Sign in to continue
        </Typography>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Authenticator
        loginMechanisms={["email"]}
        components={{ Header: AuthHeader }}
      >
        {({ signOut, user }) => <ReadingApp user={user} signOut={signOut} />}
      </Authenticator>
    </ThemeProvider>
  );
}
