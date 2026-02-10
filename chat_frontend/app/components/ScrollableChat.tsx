"use client";

import React from "react";
import { Avatar, Tooltip } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    pic?: string;
  };
}

interface ScrollableChatProps {
  messages: Message[];
}

const ScrollableChat: React.FC<ScrollableChatProps> = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            style={{ display: "flex" }}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                title={m.sender.name}
                placement="bottom-start"
                arrow
              >
                <Avatar
                  sx={{
                    mt: "7px",
                    mr: 1,
                    cursor: "pointer",
                  }}
                  src={m.sender.pic}
                  alt={m.sender.name}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor:
                  m.sender._id === user._id
                    ? "#BEE3F8"
                    : "#B9F5D0",
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user._id
                ),
                marginTop: isSameUser(
                  messages,
                  m,
                  i,
                  user._id
                )
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
