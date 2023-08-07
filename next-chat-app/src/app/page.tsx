"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

interface IMessageList {
  message: string;
  username: string;
}

export default function Home() {
  const [messageList, setMessageList] = useState<IMessageList[]>([{ message: "", username: "" }]);
  const [username, setUsername] = useState<String>("");
  const [messageInput, setMessageInput] = useState<string>("");
  const [socket, setSocket] = useState<any>(undefined);
  useEffect(() => {
    // 소켓 초기화
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("receive-message", (data: IMessageList) => {
      setMessageList((pre) => [...pre, data]);
    });

    return () => {
      socket.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 해제
    };
  }, [messageList]);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    socket.emit("send-message", { message: messageInput, username });
    setMessageInput("");
  };

  return (
    <div>
      <h1>채팅 앱</h1>
      <div>
        <label>유저 선택</label>
        <button onClick={() => setUsername("라이언")}>라이언</button>
        <button onClick={() => setUsername("피치")}>피치</button>
      </div>
      <form onSubmit={handleSendMessage}>
        <div>
          <span>유저 : {username}</span>
        </div>
        <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>

      <div>
        {messageList.map(
          ({ message, username }: any, index) =>
            !!username && (
              <p key={index}>
                {username} : {message}
              </p>
            )
        )}
      </div>
    </div>
  );
}
