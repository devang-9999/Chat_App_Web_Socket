"use client";

import { useEffect } from "react";
import { connectWS } from "./ws";

export default function Home() {

  useEffect(() => {
    const socket = connectWS()
  })
  return (
    <div>
      Lets learn socket.io client
    </div>
  )
}
