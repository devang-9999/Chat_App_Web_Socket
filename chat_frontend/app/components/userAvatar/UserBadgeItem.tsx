"use client";

import React from "react";
import { Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface User {
  _id: string;
  name: string;
}

interface UserBadgeItemProps {
  user: User;
  handleFunction: () => void;
  admin?: { _id: string };
}

const UserBadgeItem: React.FC<UserBadgeItemProps> = ({
  user,
  handleFunction,
  admin,
}) => {
  return (
    <Chip
      label={
        admin?._id === user._id
          ? `${user.name} (Admin)`
          : user.name
      }
      onDelete={handleFunction}
      deleteIcon={<CloseIcon />}
      color="secondary"
      variant="filled"
      sx={{ m: 0.5 }}
    />
  );
};

export default UserBadgeItem;
