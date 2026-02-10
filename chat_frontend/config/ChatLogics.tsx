// Shared types (you can move these to a global types file later)
interface User {
  _id: string;
  name: string;
  email?: string;
  pic?: string;
}

interface Message {
  sender: User;
  content: string;
}

// Used to control left margin of message bubbles
export const isSameSenderMargin = (
  messages: Message[],
  m: Message,
  i: number,
  userId: string
): number | "auto" => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    m.sender._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      m.sender._id !== userId) ||
    (i === messages.length - 1 && m.sender._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

// Determines whether to show avatar for a message
export const isSameSender = (
  messages: Message[],
  m: Message,
  i: number,
  userId: string
): boolean => {
  return (
    i < messages.length - 1 &&
    messages[i + 1].sender._id !== m.sender._id &&
    m.sender._id !== userId
  );
};

// Checks if this is the last message in chat (and not sent by logged-in user)
export const isLastMessage = (
  messages: Message[],
  i: number,
  userId: string
): boolean => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId
  );
};

// Checks if previous message was sent by same user
export const isSameUser = (
  messages: Message[],
  m: Message,
  i: number
): boolean => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// Returns the other user's name in 1–1 chat
export const getSender = (
  loggedUser: User,
  users: User[]
): string => {
  return users[0]._id === loggedUser._id
    ? users[1].name
    : users[0].name;
};

// Returns the full user object of the other user
export const getSenderFull = (
  loggedUser: User,
  users: User[]
): User => {
  return users[0]._id === loggedUser._id
    ? users[1]
    : users[0];
};
