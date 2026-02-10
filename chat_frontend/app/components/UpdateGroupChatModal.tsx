"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useSnackbar } from "notistack";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
}

interface UpdateGroupChatModalProps {
  fetchMessages: () => void;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateGroupChatModal: React.FC<UpdateGroupChatModalProps> = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [renameLoading, setRenameLoading] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query: string): Promise<void> => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const { data } = await axios.get<User[]>(
        `/api/user?search=${query}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
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

  const handleRename = async (): Promise<void> => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      enqueueSnackbar("Group name updated", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Rename failed",
        { variant: "error" }
      );
    } finally {
      setRenameLoading(false);
      setGroupChatName("");
    }
  };

  const handleAddUser = async (userToAdd: User): Promise<void> => {
    if (selectedChat.users.find((u: User) => u._id === userToAdd._id)) {
      enqueueSnackbar("User already in group", { variant: "warning" });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      enqueueSnackbar("Only admins can add users", {
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to add user",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userToRemove: User): Promise<void> => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      enqueueSnackbar("Only admins can remove users", {
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      userToRemove._id === user._id
        ? setSelectedChat(undefined)
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to remove user",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <VisibilityIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          <Typography fontSize={26} textAlign="center">
            {selectedChat.chatName}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {selectedChat.users.map((u: User) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>

          <Box display="flex" gap={1} mb={2}>
            <TextField
              size="small"
              fullWidth
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleRename}
              disabled={renameLoading}
            >
              {renameLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Update"
              )}
            </Button>
          </Box>

          <TextField
            size="small"
            fullWidth
            placeholder="Add user to group"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Box mt={2}>
            {loading ? (
              <CircularProgress />
            ) : (
              searchResult.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleRemove(user)}
          >
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateGroupChatModal;
