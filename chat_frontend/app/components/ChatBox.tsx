"use client";

import React from "react";
import { Box } from "@mui/material";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chatbox: React.FC<ChatboxProps> = ({
  fetchAgain,
  setFetchAgain,
}) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      sx={{
        display: {
          xs: selectedChat ? "flex" : "none",
          md: "flex",
        },
        alignItems: "center",
        flexDirection: "column",
        p: 2,
        bgcolor: "white",
        width: { xs: "100%", md: "68%" },
        borderRadius: 2,
        border: "1px solid #e0e0e0",
      }}
    >
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  );
};

export default Chatbox;
