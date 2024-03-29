import { useContext, useEffect, useRef, useState } from "react";
import "./chatarea.css";
import { SocketContext } from "../../store/AuthProvider/SocketProvider";
import { useAuth } from "../../store/AuthProvider/AuthProvider";
import { getChatDetails } from "../../utils/getChatHeader";
import { format } from "timeago.js";
const ChatArea = () => {
  const [message, setMessage] = useState("");
  const { authUser, openModal } = useAuth();
  const { socket, chat, agent, reporter, messages, setMessages, chatActive,setChat,setChatActive } =
    useContext(SocketContext);
  const inputRef = useRef();
  const lastMessageRef = useRef();


  function handleCloseChat(){
    setChatActive(false)
    setChat(null)
  }


  function chatMoreDetails(){
    openModal()
  }

  function changeHandler(e) {
    setMessage(e.target.value);
  }

  function submitHandler(e) {
    e.preventDefault();

    if (message.length > 0) {
      const isAgent = authUser?.roles
        .map((role) => role.name)
        .includes("ward-admin");
      if (isAgent) {
        socket.emit("message", {
          message,
          sender_socket: socket.id,
          sender_id: authUser.id,
          sender: authUser?.full_name,
          receiver: reporter.full_name,
          receiver_id: reporter?.id,
          chatId: chat?.id,
          isAgent,
        });
      } else {
        console.log(agent);
        socket.emit("message", {
          message,
          sender_id: authUser.id,
          sender_socket: socket.id,
          sender: authUser?.full_name,
          receiver: agent.full_name,
          receiver_id: agent?.id,
          chatId: chat?.id,
          isAgent,
        });
      }
      setMessages([
        ...messages,
        {
          message: message,
          senderInfo: { full_name: authUser?.full_name, id:authUser?.id },
          createdAt: new Date().toISOString(),
        },
      ]);

      // if (chat.id) {
      //   setChats((prev) => {
      //     return prev.map((chatItem) =>
      //       chatItem.id === chat.id
      //         ? {
      //             ...chatItem,
      //             messages: [
      //               ...chatItem.messages,
      //               { message, senderInfo: { full_name: authUser.full_name },createdAt:new Date().toISOString(),chat_id:chat.id },
      //             ],
      //           }
      //         : chatItem
      //     );
      //   });
      // }
    }
    setMessage("");
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="chat-area">
      <div className="chat-header">
      <span className="chat-user" onClick={chatMoreDetails}>{chat && getChatDetails(authUser, chat?.chat_users)?.chatUser.full_name}</span>

        {/* {getChatDetails(reporter, agent).full_name} (
        {getChatDetails(reporter, agent).roles[0].name.replace("-", " ")}){" "} */}
        <span style={{ color: "#202020" }}> ({chat?.ended ? "Disconnected":"Connected"})</span>
      <button className="close-chat-btn" onClick={handleCloseChat}>Close Chat</button>
      </div>
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((message) => (
            <div className="message">
              <div className="message-content">
                <div className="message-author">
                  {message?.senderInfo?.id === authUser?.id
                    ? "You"
                    : message?.senderInfo.full_name}
                </div>
                <div className="message-text">{message?.message}</div>
              </div>
              <p className="timestamp">{format(message.createdAt)}</p>
            </div>
          ))}
          <div ref={lastMessageRef} />
        </div>
      </div>
      <div className="message-area">
        {chat && chat?.ended  ? (
          <div className="message-box"> <div className="info">Chat Ended</div></div>
        ) : (
          <form action="" onSubmit={submitHandler}>
            <input
              type="text"
              ref={inputRef}
              value={message}
              onChange={changeHandler}
            />

            <button type="submit">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
