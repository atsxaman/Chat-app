import React, { useEffect, useState } from 'react';
import { getUser } from '../API/UserRequest';

const Conversation = ({ data, currentUserId, online }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        console.log("Other userData", data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [data.members, currentUserId]); 

  return (
    <>
      {userData && ( 
        <div className='bg-gray-200 flex items-center p-2 m-4 rounded-lg hover:bg-gray-300'> 
        {
          online ? 
          (
          <div className="avatar online">
          <div className="w-12 rounded-full">
          <img src={userData.user.profilepic} />
          </div>
          </div>
          )
          :
          (
            <>
            <img className='w-12' src={userData.user.profilepic} />
            </>
          )
        }
          <span className='font-semibold ml-12 grid'>
            <span>{userData.user.username}</span>
            <span className='text-gray-500 text-xs'>{online? 'online' : 'offline'}</span>
            </span>
        </div>
      )}
      
    </>
  );
};

export default Conversation;
