"use client";

import React from "react";
import {
  Avatar,
  Box,
  Typography,
} from "@mui/material";

interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
}

interface UserListItemProps {
  user: User;
  handleFunction: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  handleFunction,
}) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1.5,
        mb: 1,
        borderRadius: 2,
        cursor: "pointer",
        backgroundColor: "#E8E8E8",
        "&:hover": {
          backgroundColor: "#38B2AC",
          color: "white",
        },
      }}
    >
      <Avatar src={user.pic} alt={user.name} />

      <Box>
        <Typography>{user.name}</Typography>
        <Typography variant="caption">
          <b>Email:</b> {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
