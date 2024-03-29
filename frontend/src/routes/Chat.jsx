import { BsFillChatRightTextFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdCallReceived, MdChat, MdOutlineCallEnd } from "react-icons/md";
import { useAuth } from "../store/AuthProvider/AuthProvider";
import { useContext } from "react";
import { SocketContext } from "../store/AuthProvider/SocketProvider";
import ChatArea from "../components/Chat/ChatArea";
import chatuser from "../assets/chat_user.png";
import { format } from "timeago.js";
import { getChatDetails } from "../utils/getChatHeader";
import Modal from '../components/Modal/Modal'

const Chat = () => {
  const { authUser } = useAuth();
  const {
    socket,
    chatActive,
    agent,
    chats,
    reporter,
    setMessages,
    setChat,
    setChatActive,
    chat,
    authoritiesOnline,
    setAgent
  } = useContext(SocketContext);

  function handleJoin() {
    
    if (authUser?.roles?.map((role) => role.name).includes("user")) {
      socket.emit("user_join_chat");
    }
  }

  function handleChatClick(chat) {
    console.log(chat);
    setChat(chat);
    setChatActive(true);
    setMessages(chat.messages);
  }

  function handleAuthorityClick(authority){
      setAgent(authority);
      setChatActive(true);
      setMessages([]);
      const chat = chats.find(ch=>ch.chat_users[0].user === authority?.id || ch.chat_users[1].user == authority.id)
      setChat(chat);
      setMessages(chat.messages||[])
  }

  function handleEndChat(){
   

   let isAgent = authUser?.roles.map(role=>role.name).includes('ward-admin')
    let data;
    if(isAgent){
     data = {reporter:reporter?.id, isAgent, agent:authUser?.id }
    }else{
        data = {isAgent, agent:agent.id}
    }
    socket.emit('end_chat',{
      ...data,
        chatId:chat?.id
    })
  }

  
  return (
    <div className={`call-area ${chatActive &&  'chat-open'}`}>

<Modal title="Contact Info">
      
<div className="user-info">


<div class="info-row">
        <label class="info-label">Name:</label>
        <span class="info-value">{chat && getChatDetails(authUser, chat?.chat_users)?.chatUser.full_name}</span>
      </div>
    
     
     
</div>
 
         
      </Modal>
      <div className="call-container">
        <div className="call-sidebar">

    
        
          <div className="calls-log">
            <h3 className="s-title" style={{ textAlign: "center" }}>
              Chats
            </h3>
            <div className="chats-scrollable">

            <ul className="call-history-list">
              {chats.map((chatItem) => (
                <li
                  className={`${
                    chatItem?.id === chat?.id
                      ? "call-history-item selected"
                      : "call-history-item"
                  }`}
                  key={chatItem?.id}
                  onClick={() => handleChatClick(chatItem)}
                >
                  <div className="avatar-icon">
                    <img src={chatuser} alt="avatar" />
                  </div>{" "}
                  <div className="caller">
                    {/* {chatItem?.messages[0]?.senderInfo?.id !== authUser?.id
                      ? authUser.full_name
                      : chatItem?.messages[0]?.receiverInfo?.full_name} */}
                      {getChatDetails(authUser, chatItem?.chat_users)?.chatUser.full_name}
                    <div className="timestamp">
                      {format(chatItem?.createdAt)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            </div>

          </div>

      {authUser?.roles.map(role=>role.name).includes('user') &&    <div className="calls-log">
            <h3 className="s-title" style={{ textAlign: "center" }}>
          Authorities Online
            </h3>

            <div className="chats-scrollable">

            <ul className="call-history-list">
              {authoritiesOnline.map((authority) => (
                <li
                  className={`
                  call-history-item`}
                  key={authority?.id}
                  onClick={() => handleAuthorityClick(authority)}
                >
                  <div className="avatar-icon">
                    <img src={chatuser} alt="avatar" />
                  </div>
                  <div className="caller">
                    {/* {chatItem?.messages[0]?.senderInfo?.id !== authUser?.id
                      ? authUser.full_name
                      : chatItem?.messages[0]?.receiverInfo?.full_name} */}
                      {authority.full_name}
                    <div className="timestamp">
                     Department ({authority?.ward_authority.designation})
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            </div>
            </div>}
        </div>
        <div className="main-call">
             {chatActive ? (
            <ChatArea />
          ) : (
            <div className="main-call-default">
              <div className="content">
                <MdChat className="icon" />
                <h1>Click on a chat for more info.</h1>
                {chatActive && <p>Chat is active</p>}
              </div>
            </div>
          )}

          {/* {authUser?.roles.map((role) => role.name).includes("user") ? (
            agent ? (
              <button className="initate-chat" onClick={handleEndChat}>Leave Chat</button>
            ) : (
                <button className="initate-chat" type="button" onClick={handleJoin}>
                
                  <>
                    Talk to an Authority <BsFillChatRightTextFill />
                  </>
              </button>
            )
          ) : null} */}


{authUser?.roles.map((role) => role.name).includes("ward-admin") ? (
            reporter ? (
              <button className="initate-chat" onClick={()=>handleEndChat(reporter)}>Leave Chat</button>
            ) :null
          ) : null}

          

          {/* {authUser?.roles.map((role) => role.name).includes("ward-admin") &&
            chatActive && (
              <button
                className="initate-chat"
                type="button"
                onClick={handleJoin}
              >
                End Chat
              </button>
            )} */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
