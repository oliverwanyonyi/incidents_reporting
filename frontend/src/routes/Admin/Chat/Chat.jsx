import './chat.css'
import { MdOutlineCallEnd,MdCallReceived,MdCallMissed, MdChat  } from "react-icons/md";
import { BsFillChatRightTextFill } from "react-icons/bs";
import ChatArea from '../../../components/Chat/ChatArea';
import { useContext } from 'react';
import { SocketContext } from '../../../store/AuthProvider/SocketProvider';
import { FaUserCircle } from 'react-icons/fa';

const Chat = () => {
    const {chatActive} = useContext(SocketContext)
  return (
    <div  className='call-area'>
        <div className="call-container">
            <div className="call-sidebar">
                <div className="s-title">Chat History</div>
                <ul className="call-history-list">
                    <li className="call-history-item"><div className="icon"><FaUserCircle/></div> <div className="caller">Oliver Wanyonyi</div></li>
                </ul>
            </div>
            <div className="main-call">
                {chatActive? <ChatArea/>:
                <div className="main-call-default">
                    <div className="content">
                    <MdChat className='icon'/>
                    <h1>Click on a chat for more info.</h1>
                    </div>
                    
                </div>
}
            </div>
        </div>
    </div>
  )
}

export default Chat