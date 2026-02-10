"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useSnackbar } from "notistack";
import { io, Socket } from "socket.io-client";
import Lottie from "lottie-react";

import typingAnimation from "../animations/typing.json";
import {
  getSender,
  getSenderFull,
} from "../config/ChatLogics";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT = "http://localhost:5000";

let socket: Socket;
let selectedChatCompare: any;

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    pic?: string;
  };
  chat: any;
}

interface SingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleChat: React.FC<SingleChatProps> = ({
  fetchAgain,
  setFetchAgain,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socketConnected, setSocketConnected] =
    useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();

  // Fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios.get<Message[]>(
        `/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch {
      enqueueSnackbar("Failed to load messages", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = await axios.post<Message>(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch {
        enqueueSnackbar("Failed to send message", {
          variant: "error",
        });
      }
    }
  };

  // Socket setup
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () =>
      setSocketConnected(true)
    );
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () =>
      setIsTyping(false)
    );
  }, [user]);

  // Fetch messages when chat changes
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Receive messages
  useEffect(() => {
    socket.on(
      "message recieved",
      (newMessageRecieved: Message) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !==
            newMessageRecieved.chat._id
        ) {
          if (
            !notification.find(
              (n: any) =>
                n._id === newMessageRecieved._id
            )
          ) {
            setNotification([
              newMessageRecieved,
              ...notification,
            ]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            newMessageRecieved,
          ]);
        }
      }
    );
  });

  // Typing handler
  const typingHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return selectedChat ? (
    <>
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <IconButton
          sx={{ display: { md: "none" } }}
          onClick={() => setSelectedChat(null)}
        >
          <ArrowBackIcon />
        </IconButton>

        {!selectedChat.isGroupChat ? (
          <>
            {getSender(user, selectedChat.users)}
            <ProfileModal
              user={getSenderFull(
                user,
                selectedChat.users
              )}
            />
          </>
        ) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal
              fetchMessages={fetchMessages}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          </>
        )}
      </Typography>

      {/* Chat body */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 2,
          bgcolor: "#E8E8E8",
          width: "100%",
          height: "100%",
          borderRadius: 2,
        }}
      >
        {loading ? (
          <CircularProgress
            sx={{ alignSelf: "center", m: "auto" }}
          />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}

        {isTyping && (
          <Lottie
            animationData={typingAnimation}
            style={{ width: 70 }}
          />
        )}

        <TextField
          fullWidth
          placeholder="Enter a message..."
          variant="filled"
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={sendMessage}
          sx={{ mt: 1 }}
        />
      </Box>
    </>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography variant="h4">
        Click on a user to start chatting
      </Typography>
    </Box>
  );
};

export default SingleChat;
