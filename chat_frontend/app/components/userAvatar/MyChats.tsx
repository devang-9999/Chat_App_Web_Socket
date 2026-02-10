"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useSnackbar } from "notistack";

import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
}

interface Message {
  content: string;
  sender: User;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: Message;
}

interface MyChatsProps {
  fetchAgain: boolean;
}

const MyChats: React.FC<MyChatsProps> = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const { enqueueSnackbar } = useSnackbar();

  const fetchChats = async (): Promise<void> => {
    try {
      const { data } = await axios.get<Chat[]>("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(data);
    } catch {
      enqueueSnackbar("Failed to load chats", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      sx={{
        display: {
          xs: selectedChat ? "none" : "flex",
          md: "flex",
        },
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        bgcolor: "white",
        width: { xs: "100%", md: "31%" },
        borderRadius: 2,
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          pb: 2,
        }}
      >
        <Typography variant="h5" fontFamily="Work Sans">
          My Chats
        </Typography>

        <GroupChatModal>
          <Button
            variant="contained"
            size="small"
            endIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat list */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          bgcolor: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: 2,
          overflowY: "hidden",
        }}
      >
        {chats ? (
          <Stack spacing={1} sx={{ overflowY: "auto" }}>
            {chats.map((chat) => {
              const isSelected =
                selectedChat?._id === chat._id;

              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  sx={{
                    cursor: "pointer",
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: isSelected
                      ? "#38B2AC"
                      : "#E8E8E8",
                    color: isSelected
                      ? "white"
                      : "black",
                  }}
                >
                  <Typography fontWeight={500}>
                    {!chat.isGroupChat && loggedUser
                      ? getSender(
                          loggedUser,
                          chat.users
                        )
                      : chat.chatName}
                  </Typography>

                  {chat.latestMessage && (
                    <Typography variant="caption">
                      <b>
                        {chat.latestMessage.sender.name} :
                      </b>{" "}
                      {chat.latestMessage.content.length >
                      50
                        ? chat.latestMessage.content.slice(
                            0,
                            51
                          ) + "..."
                        : chat.latestMessage.content}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
