"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

interface GroupChatModalProps {
  children: React.ReactNode;
}

interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd: User): void => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      enqueueSnackbar("User already added", { variant: "warning" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query: string): Promise<void> => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const { data } = await axios.get<User[]>(
        `/api/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchResult(data);
    } catch {
      enqueueSnackbar("Failed to load search results", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (delUser: User): void => {
    setSelectedUsers(
      selectedUsers.filter((u) => u._id !== delUser._id)
    );
  };

  const handleSubmit = async (): Promise<void> => {
    if (!groupChatName || selectedUsers.length === 0) {
      enqueueSnackbar("Please fill all the fields", {
        variant: "warning",
      });
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setChats([data, ...chats]);
      enqueueSnackbar("New group chat created", {
        variant: "success",
      });
      setOpen(false);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data || "Failed to create group chat",
        { variant: "error" }
      );
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          <Typography
            fontSize={28}
            fontWeight={600}
            textAlign="center"
          >
            Create Group Chat
          </Typography>
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Chat Name"
            fullWidth
            margin="dense"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />

          <TextField
            label="Add Users (e.g. John, Jane)"
            fullWidth
            margin="dense"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mt: 2,
            }}
          >
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>

          <Box mt={2}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Create Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupChatModal;
