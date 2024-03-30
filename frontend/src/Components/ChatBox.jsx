import React, { useEffect, useState } from 'react';
import { getUser } from '../API/UserRequest';
import { addMessage, getMessages } from '../API/MessageRequest';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';
import { useRef } from 'react';


const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const scroll = useRef()

  useEffect(() => {
    if(receiveMessage !== null && receiveMessage?.chatId === chat?._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);



  useEffect(() => {
    const getUserData = async () => {
      if (!chat) return;

      const userId = chat?.members?.find((id) => id !== currentUser);
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        console.log("Other userData part -2 ", data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (chat) {
        try {
          const { data } = await getMessages(chat._id);
          setMessages(data);
          console.log("Messages", data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };


  // CODE TO SEND MESSAGE //

  const handleSend = async(e) => {
    e.preventDefault();

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id
    }

    // send message to database

    try{

      const {data} = await addMessage(message);
      setMessages([...messages,data])
      setNewMessage('')

    } catch (error) {
      console.log(error);
    }

    // send message to socket server 
    const receiverId = chat.members.find((id)=> id !== currentUser);
    setSendMessage({...message, receiverId})

  }


  // automatically scroll logic

  useEffect(()=>{
   scroll.current?.scrollIntoView({ behavior: 'smooth'})
  },[messages])


  return (
    <>
      {chat ? (
        <>
          {/* CHAT HEADER */}
          {userData && userData.user && (
            <div className='bg-gray-200 grid justify-center py-2'>
              <img className='w-9' src={userData.user.profilepic} alt={userData.user.username} />
              <span className='font-semibold'>{userData.user.username}</span>
            </div>
          )}

          {/* CHAT MESSAGES */}
          <div className='h-[440px] overflow-auto'>
            {messages.map((message, index) => (
          <div ref={scroll} key={index} className={message.senderId === currentUser ? 'flex justify-end' : 'flex justify-start'}>
           <div className={message.senderId === currentUser ? 'bg-blue-500 text-white p-2 rounded-lg m-2 grid' : 'bg-gray-200 text-black p-2 rounded-lg m-2 grid'}>
          <span>{message.text}</span>
          <span className='text-xs'>{format(message.createdAt)}</span>
          </div>
          </div>
          ))}
          </div>



    
          {/* SENDER LOGIC */}
          <div className='fixed bottom-2 w-[58%] flex items-center gap-2'>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <button  className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded-lg' onClick={handleSend}>Send</button>
          </div>
        </>
      ) : (
        <span className='grid justify-center mt-9'>
            <img className='w-[400px]' src='https://icon-library.com/images/messaging-app-icon/messaging-app-icon-20.jpg' />
            <p className='text-gray-500 font-thin text-2xl'>Select a chat to start the conversation...</p>
        </span>
      )}
    </>
  );
};

export default ChatBox;
