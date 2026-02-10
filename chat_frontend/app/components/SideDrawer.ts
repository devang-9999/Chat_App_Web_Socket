"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Drawer,
  Box,
  TextField,
  Avatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import { useSnackbar } from "notistack";
import NotificationBadge, { Effect } from "react-notification-badge";
import { useRouter } from "next/navigation";

import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
}

function SideDrawer() {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    router.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      enqueueSnackbar("Please enter something to search", {
        variant: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get<User[]>(
        `/api/user?search=${search}`,
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

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setDrawerOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error?.message || "Error fetching chat", {
        variant: "error",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Tooltip title="Search users to chat">
            <Button
              startIcon={<SearchIcon />}
              onClick={() => setDrawerOpen(true)}
            >
              Search User
            </Button>
          </Tooltip>

          <Typography variant="h6" fontFamily="Work Sans">
            Talk-A-Tive
          </Typography>

          <Box display="flex" alignItems="center">
            {/* Notifications */}
            <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <NotificationsIcon />
            </IconButton>

            <Menu
              anchorEl={notifAnchor}
              open={Boolean(notifAnchor)}
              onClose={() => setNotifAnchor(null)}
            >
              {!notification.length && (
                <MenuItem>No new messages</MenuItem>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n !== notif)
                    );
                    setNotifAnchor(null);
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(
                        user,
                        notif.chat.users
                      )}`}
                </MenuItem>
              ))}
            </Menu>

            {/* Profile */}
            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
              <Avatar src={user.pic} />
              <ArrowDropDownIcon />
            </IconButton>

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
            >
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <Divider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box width={300} p={2}>
          <Typography variant="h6" mb={2}>
            Search Users
          </Typography>

          <Box display="flex" gap={1} mb={2}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="contained" onClick={handleSearch}>
              Go
            </Button>
          </Box>

          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.map((u) => (
              <UserListItem
                key={u._id}
                user={u}
                handleFunction={() => accessChat(u._id)}
              />
            ))
          )}

          {loadingChat && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default SideDrawer;
