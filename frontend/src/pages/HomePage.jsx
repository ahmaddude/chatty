import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import NoChatSelected from '../components/NoChatSelected.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import Sidebar from '../components/Sidebar.jsx';
const HomePage = () => {
  const {selectedUser}=useChatStore();
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='b-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] '>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar/>

            {!selectedUser ? <NoChatSelected/>: <ChatContainer/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
