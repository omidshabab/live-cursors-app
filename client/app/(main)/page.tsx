"use client"

import LoginForm from "@/components/login-form";
import useWebSocket from "react-use-websocket"
import throttle from "lodash.throttle"
import { useEffect, useRef, useState } from "react";
import { Cursor } from "@/components/cursor";

interface User {
  username: string;
  state: Record<string, any>;
}

const renderCursors = (users: { [uuid: string]: User } | null) => {
  if (!users) {
    return null;
  }

  return Object.keys(users).map((uuid) => {
    const user = users[uuid];

    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
  });
};

const renderUserList = (users: { [uuid: string]: User } | null) => {
  if (!users) {
    return null;
  }

  return (
    <ul>
      {Object.keys(users).map(uuid => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
      })}
    </ul>
  )
}

export default function Home() {
  const [username, setUsername] = useState("")

  const WS_URL = "ws://127.0.0.1:8000/ws"
  const { sendJsonMessage, lastJsonMessage }: {
    sendJsonMessage: any, lastJsonMessage: any
  } = useWebSocket(WS_URL, {
    queryParams: { username }
  })

  const THROTTLE = 1
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0,
    })

    window.addEventListener("mousemove", e => {
      sendJsonMessageThrottled.current({
        x: e.clientX,
        y: e.clientY,
      })
    })
  }, [sendJsonMessage, sendJsonMessageThrottled])

  return (
    <main className="flex w-full h-screen items-center justify-center bg-gray-50">
      {username ? (
        <>
          {renderCursors(lastJsonMessage)}
          {renderUserList(lastJsonMessage)}
        </>
      ) : (
        <LoginForm onSubmit={setUsername} />
      )}
    </main>
  )
}
