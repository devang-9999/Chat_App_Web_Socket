"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface User {
  name: string;
  email: string;
  pic: string;
}

interface ProfileModalProps {
  user: User;
  children?: React.ReactNode;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(true)}>{children}</span>
      ) : (
        <IconButton onClick={() => setOpen(true)}>
          <VisibilityIcon />
        </IconButton>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography
            fontSize={32}
            fontWeight={600}
            textAlign="center"
            fontFamily="Work Sans"
          >
            {user.name}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Avatar
              src={user.pic}
              alt={user.name}
              sx={{ width: 150, height: 150 }}
            />

            <Typography fontSize={20}>
              Email: {user.email}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileModal;
