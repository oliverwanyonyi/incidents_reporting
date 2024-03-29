import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { infoToast } from "../../utils/toastMessage";
const socket = io.connect("http://localhost:4000");

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  
  const [chatActive,setChatActive] = useState(false)
  const [agent,setAgent] = useState(null)
  const [reporter,setReporter] = useState(null)
  const[ messages,setMessages] = useState([]);
  const [chat,setChat] = useState(null)
  const axiosPrivate = useAxiosPrivate()
  const [chats,setChats] = useState([])
  const [waiting,setWaiting] = useState(false)
  const [estimatedWaitingTime,setEstimatedTime] = useState()
  const [position,setPosition] = useState()
  const [notifications,setNotifications] = useState([])
  const [authoritiesOnline,setAuthoritiesOnline] = useState([])
 const [usersOnline,setUsersOnline] = useState([]);
  
 async function updateNotification(notifItem){

    setNotifications(prev=>{
      return prev.map(notif=>{
        if(notif.id == notifItem.id){
          
          return {...notif, read:true}
        }else{

          return notif
        }
      })
    })

    if(!notifItem.read){
 
   await axiosPrivate.put(`/incidents/notification/${notifItem.id}/update`)

    }
  }


  async function deleteNotification(notifId){

    setNotifications((prev)=>{
      return prev.filter(notif=>notif.id !== notifId)
    })
    await axiosPrivate.delete(`/notifications/${notifId}/delete`)
  }

  useEffect(()=>{
  

    socket.off('user_assigned').on('user_assigned', (user) => {
    setReporter(user)
    setChatActive(true)
    setMessages([])
    setChat()
    });

    socket.off('agent_assigned').on('agent_assigned', (agent) => {
      setAgent(agent);
      setChatActive(true);
      setMessages([])
      setChat()
    });
    socket.off('new_chat').on('new_chat', (newChat)=>{
     console.log(newChat);
      setChat(newChat)
     setChats(prev=>{
      return [newChat, ...prev]
     })

    
    })

    socket.off('agents_online').on('agents_online' ,data=>{
      console.log(data);
    })
    socket.off('new_incident_notif').on('new_incident_notif', (data)=>{
      setNotifications(prev=>{
        return [...prev, data]
      })
    })

    socket.off('agent_busy').on('agent_busy', data=>{
      setWaiting(true)
      setEstimatedTime(data.maxWaitingTime)
      setPosition(data.position)
      infoToast(`All Authorities are busy, your postion in queue is ${data.position} please try again later after ${data.maxWaitingTime} minutes`)
  })

    socket.off('chat_ended').on('chat_ended',(chatId)=>{
     console.log(chatId);
      setAgent(null)
      setReporter(null)
      setChatActive(false)
      setChat()
      setChats(prev=>{
       return prev.map(chat=>{
          if(chat.id === chatId){
            return {...chat, ended:true}
          }else {
            return chat
          }
        })
      })
    })
  
  },[])

useEffect(()=>{
  socket.off('message_receive').on('message_receive', data=>{
    console.log(data);
    setMessages(prev =>{
       return [...prev, data]
     })
    setChats(prev=>{
      return prev.map(chatItem=> chatItem.id === data?.chatId? {...chatItem, messages:[...chatItem.messages, data]}:chatItem )
    })
   })
},[messages])
  async function retrieveChats(){
    const{data} = await axiosPrivate.get('/chat')
    setChats(data.chats)
  }

  async function retrieveNotifications () {

    const {data} = await axiosPrivate.get('/notifications')

    setNotifications(data.notifications)
  }

  useEffect(()=>{
   retrieveChats()
   retrieveNotifications()
  },[])
  return (
    <SocketContext.Provider value={{ chatActive,setChatActive,socket,agent,setAgent,reporter,setReporter, messages,setMessages,chat,setChat,chats,setChats,estimatedWaitingTime,position, waiting, notifications,setNotifications, updateNotification,deleteNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
