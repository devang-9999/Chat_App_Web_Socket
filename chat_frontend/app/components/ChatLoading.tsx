"use client";

import React from "react";
import { Stack, Skeleton } from "@mui/material";

const ChatLoading: React.FC = () => {
  return (
    <Stack spacing={1}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} height={45} />
      ))}
    </Stack>
  );
};

export default ChatLoading;
