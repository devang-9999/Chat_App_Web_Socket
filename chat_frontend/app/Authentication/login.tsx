"use client";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { ChatState } from "../../Context/ChatProvider";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = ChatState();

  const handleSubmit = async (): Promise<void> => {
    if (!email || !password) {
      enqueueSnackbar("Please fill all the fields", { variant: "warning" });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      enqueueSnackbar("Login successful", { variant: "success" });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      router.push("/chats");
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Something went wrong",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Email Address"
        type="email"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Login"}
      </Button>

      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </Stack>
  );
};

export default Login;
