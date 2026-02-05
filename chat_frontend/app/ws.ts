"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectWS() {
    socket = io("http://localhost:5000")
    return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
