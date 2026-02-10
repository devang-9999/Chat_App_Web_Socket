"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/* =======================
   Types
======================= */

interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
  token: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: any;
}

interface ChatContextType {
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<
    React.SetStateAction<Chat | null>
  >;
  user: User | null;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
  notification: any[];
  setNotification: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  chats: Chat[] | null;
  setChats: React.Dispatch<
    React.SetStateAction<Chat[] | null>
  >;
}

/* =======================
   Context
======================= */

const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

/* =======================
   Provider
======================= */

const ChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedChat, setSelectedChat] =
    useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<any[]>(
    []
  );
  const [chats, setChats] = useState<Chat[] | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    // localStorage only exists on client
    const storedUser =
      typeof window !== "undefined"
        ? localStorage.getItem("userInfo")
        : null;

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/* =======================
   Hook
======================= */

export const ChatState = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(
      "ChatState must be used within a ChatProvider"
    );
  }
  return context;
};

export default ChatProvider;
