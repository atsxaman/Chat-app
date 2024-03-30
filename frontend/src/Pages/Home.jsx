import React, { useEffect, useRef, useState } from 'react'
import { userChats } from '../API/ChatRequests';
import Conversation from '../Components/Conversation';
import ChatBox from '../Components/ChatBox';
import '../App.css';
import {useNavigate} from 'react-router-dom';
import {io} from 'socket.io-client';


const Home = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  console.log("User",user)

  const [chats,setChats] = useState([]);
  const [currentChat,setCurrentChat] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [sendMessage,setSendMessage] = useState(null);
  const [receiveMessage,setReceiveMessage] = useState(null);

  const socket = useRef()

  // send message to socket server
  useEffect(()=> {
    if(sendMessage !== null){
      socket.current.emit('send-message', sendMessage)
    }
  },[sendMessage])


  useEffect(()=> {

    socket.current = io('http://localhost:8800');
    socket.current.emit('new-user-add', user._id)
    socket.current.on('get-users', (users)=> {
      setOnlineUsers(users);
      console.log("ONLINE USERS - ", onlineUsers)
    })

  }, [user._id]);


    // receive message from socket server
    useEffect(()=>{
      socket.current.on('receive-message', (data)=> {
       console.log("DAta received in parent chat.jsx", data)
         setReceiveMessage(data)
      })
     },[])


  useEffect(()=> {
  const token = localStorage.getItem('user');
  if(!token){
    navigate('/login')
  }
  },[])


  useEffect(() => {
    const getChats = async() => {
      try{

        const {data} = await userChats(user._id);
        setChats(data)
        console.log("DATA",data)

      } catch (error) {
        console.log(error)
      }
    }
    getChats()
  },[user._id])


  // check user online status
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id)
    const online = onlineUsers.find((user)=>user.userId === chatMember)
    return online? true : false
  }


  return (
  <>
  
  
  <div className='homeBG p-2 flex items-center justify-center gap-1'>

   {/* LEFT SIDE PART */}
   <div className='bg-white w-[25%] text-black h-[570px]'>
    <h1 className='text-center text-2xl my-4'>Chats</h1>
    <div className='h-[460px] overflow-auto bg-slate-500'>
    {
      chats.map((chat) => (
        <div onClick={()=>setCurrentChat(chat)}>
          <Conversation data={chat} currentUserId = {user._id} online={checkOnlineStatus(chat)} />
        </div>
      ))
    }
    </div>
    <button
  className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-1 flex mx-auto my-2"
  onClick={() => {
    if (window.confirm('Are you sure you want to logout ' + JSON.parse(localStorage.getItem('user')).username + '?')) {
      localStorage.clear();
      // Navigate to login page
      navigate('/login');
    }
  }}
>
  Logout
</button>

   </div>

   {/* RIGHT SIDE PART */}
   <div className='w-[60%] bg-white text-black h-[570px]'>
    <ChatBox chat={currentChat} currentUser = {user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage} />
   </div>

  </div>
  
  
  </>
  )
}

export default Home





