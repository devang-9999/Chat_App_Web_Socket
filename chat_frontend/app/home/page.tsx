"use client";

import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage: React.FC = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("userInfo") as string
    );

    if (user) {
      router.push("/chats");
    }
  }, [router]);

  return (
    <Container maxWidth="sm">
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 3,
          backgroundColor: "white",
          width: "100%",
          margin: "40px 0 15px 0",
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontFamily: "Work Sans" }}
        >
          Talk-A-Tive
        </Typography>
      </Box>

      {/* Auth Box */}
      <Box
        sx={{
          backgroundColor: "white",
          width: "100%",
          padding: 4,
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          variant="fullWidth"
          sx={{ marginBottom: "1em" }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        {tabIndex === 0 && <Login />}
        {tabIndex === 1 && <Signup />}
      </Box>
    </Container>
  );
};

export default Homepage;
