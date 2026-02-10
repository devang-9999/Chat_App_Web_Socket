"use client";

import React, { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pic, setPic] = useState<string>("");
  const [picLoading, setPicLoading] = useState<boolean>(false);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async (): Promise<void> => {
    if (!name || !email || !password || !confirmPassword) {
      enqueueSnackbar("Please fill all the fields", { variant: "warning" });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return;
    }

    try {
      setPicLoading(true);

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      enqueueSnackbar("Registration successful", { variant: "success" });
      localStorage.setItem("userInfo", JSON.stringify(data));
      router.push("/chats");
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Something went wrong",
        { variant: "error" }
      );
    } finally {
      setPicLoading(false);
    }
  };

  const postDetails = async (file: File | null): Promise<void> => {
    if (!file) {
      enqueueSnackbar("Please select an image", { variant: "warning" });
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      enqueueSnackbar("Only JPG/PNG images are allowed", {
        variant: "warning",
      });
      return;
    }

    try {
      setPicLoading(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/piyushproj/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      setPic(result.url);
      enqueueSnackbar("Image uploaded successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Image upload failed", { variant: "error" });
    } finally {
      setPicLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Name"
        required
        fullWidth
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Email Address"
        type="email"
        required
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        required
        fullWidth
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

      <TextField
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        required
        fullWidth
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button variant="outlined" component="label">
        Upload Profile Picture
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files?.[0] || null)}
        />
      </Button>

      <Button
        variant="contained"
        fullWidth
        color="primary"
        onClick={submitHandler}
        disabled={picLoading}
        sx={{ mt: 2 }}
      >
        {picLoading ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>
    </Stack>
  );
};

export default Signup;
