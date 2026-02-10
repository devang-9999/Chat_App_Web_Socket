// utils/chatHelpers.ts

export interface User {
  id: string;
  name: string;
  pic?: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
}

/**
 * Controls left margin of message bubble
 * Used for grouping messages visually
 */
export const isSameSenderMargin = (
  messages: Message[],
  m: Message,
  i: number,
  userId: string,
): number | 'auto' => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender.id === m.sender.id &&
    m.sender.id !== userId
  ) {
    return 33;
  }

  if (
    (i < messages.length - 1 &&
      messages[i + 1].sender.id !== m.sender.id &&
      m.sender.id !== userId) ||
    (i === messages.length - 1 && m.sender.id !== userId)
  ) {
    return 0;
  }

  return 'auto';
};

/**
 * Should we show sender avatar?
 */
export const isSameSender = (
  messages: Message[],
  m: Message,
  i: number,
  userId: string,
): boolean => {
  return (
    i < messages.length - 1 &&
    messages[i + 1].sender.id !== m.sender.id &&
    m.sender.id !== userId
  );
};

/**
 * Is this the last message in the chat?
 */
export const isLastMessage = (
  messages: Message[],
  i: number,
  userId: string,
): boolean => {
  return (
    i === messages.length - 1 &&
    messages[i].sender.id !== userId
  );
};

/**
 * Is the previous message from the same user?
 */
export const isSameUser = (
  messages: Message[],
  m: Message,
  i: number,
): boolean => {
  return i > 0 && messages[i - 1].sender.id === m.sender.id;
};

/**
 * Get sender name for one-to-one chat
 */
export const getSender = (
  loggedUser: User,
  users: User[],
): string => {
  return users[0].id === loggedUser.id
    ? users[1].name
    : users[0].name;
};

/**
 * Get full sender object for one-to-one chat
 */
export const getSenderFull = (
  loggedUser: User,
  users: User[],
): User => {
  return users[0].id === loggedUser.id
    ? users[1]
    : users[0];
};
