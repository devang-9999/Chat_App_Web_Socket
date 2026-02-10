"use client";

import { Box } from "@mui/material";
import { useState } from "react";

import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage: React.FC = () => {
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const { user } = ChatState();

  return (
    <Box sx={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "91.5vh",
          padding: "10px",
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}
      </Box>
    </Box>
  );
};

export default Chatpage;
