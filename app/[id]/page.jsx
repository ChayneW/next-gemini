'use client'
import React, {useState, useEffect, useRef} from 'react'
import GeminiTalk from '@/components/GeminiTalk'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { GetConvos} from '@/utils/supabaseRequests'
import { getToken, useAuth, auth } from '@clerk/nextjs';
import { supabaseClient } from '@/utils/supabaseClient'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

const ChatPage = () => {
  const {getToken, userId} = useAuth()
  // const {getToken, userId} = auth()

  const pathname = usePathname()
  const chatId = pathname.startsWith('/') ? pathname.substring(1) : pathname;

  const router = useRouter();
  const [conversations, setConversations] = useState([])
  

  // const supabase = supabaseClient
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  // setConversations(GetConvos(chatId))

  // setConversations(newConvos)

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  // useEffect(() => {
  //   router.refresh()
  //   if (chatId) {
  //     GetConvos(chatId).then(setConversations)
  //     // newConvos = GetConvos(chatId)
  //     // setConversations(newConvos)
  //     console.log('dynamic page GetConvos():')
  //   }
  // }, []);


   // Fetch conversation data from Supabase and update state
   const fetchConversations = async () => {    
    console.log('inside getConvos')
    console.log(userId)
    const token = await getToken({"template": 'supabase'})
    const supabase = await supabaseClient(token)
    let { data: convos, error } = await supabase
      .from('conversations')
      // .select('conversation_history')
      .select('*')
      .eq('chat_id', chatId);
      console.log('inside fetchedConversations:')
      console.log(convos)
  
    if (error) {
      console.error('Error fetching conversations', error);
      return [];
    }
  
    setConversations(convos)
  }

  useEffect(() => {
    // Delay the execution of fetchConversations() by 500 milliseconds
    
    const delay = setTimeout(() => {
        fetchConversations();
      }, 500);
    // Clear the timeout on component unmount
      console.log('inside [id] page.jsx useEffect:')
      console.log('calling router.push:', pathname)
      // router.push(`${pathname}`)
      router.refresh()
      return () => clearTimeout(delay);
  }, [chatId]);

  
  console.log('conversations dynamic')
  console.log(conversations)
  
  return (
    // <div className='relative overflow-y-auto px-20' style={{ paddingBottom: '100px' }}>
    // <div className='chat-container relative overflow-y-auto px-20 md:px-10' style={{ paddingBottom: '100px' }}>
    //   <div className='px-10 grid justify-center text-white'>
    //     {conversations.map((conversation, index) => (
    //       <div key={index}
    //         className='grid gap-14 justify-center'>
    //         {/* Render your conversation data here */}
    //         {conversation.conversation_history.map((convo, index) => (
    //           <div 
    //             key={index}
    //             className=' text-left max-md:px-20'>
    //             <br></br>
    //             <h1>user: {convo.user}</h1>
    //             <br></br>
    //             {/* <h1 className="conversation-text" style={{whiteSpace:'pre-wrap'}}> */}
    //             <h1 className="conversation-text" style={{ overflowWrap: 'break-word' }}>

    //               model: {convo.model} 
    //             </h1>
    //             <br></br>
    //           </div>
    //         ))}
    //       </div>
    //     ))}
    //   </div>

    //   <GeminiTalk
    //     path={pathname}
    //   />
    // </div>

    <div className='relative' style={{ paddingBottom: '100px' }}>
      <div>
        {conversations.map((conversation, index) => (
            <div key={index}
              className=''>
              {/* Render your conversation data here */}
              {conversation.conversation_history.map((convo, index) => (
                <div 
                  key={index}
                  className='text-white px-10'>
                  <br></br>
                  {/* <h1>user: {convo.user}</h1> */}
                  <h1 className='py-2'>User:</h1>
                  <h1>{convo.user}</h1>
                  <br></br>
                  <h1 className='py-2'>Model:</h1>
                  <h1 className="conversation-text" style={{whiteSpace:'pre-wrap'}}>
                  {/* <h1 className="conversation-text" style={{ overflowWrap: 'break-word' }}> */}
                  {/* <h1> */}
                   {convo.model} 
                  </h1>
                  <br></br>
                  <div ref={messagesEndRef} />
                  {/* <button onClick={scrollToBottom}>Scroll to Bottom</button> */}
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* <GeminiTalk
        path={pathname}
      /> */}

      {/* Scroll to Bottom button */}
      <button className="fixed top-20 right-10 z-50 bg-[#14CC8F] text-white px-4 py-2 rounded" onClick={scrollToBottom}>
        <Image
          className='rounded-lg'
          src={'/down-arrow.svg'}
          // fill
          // style={{objectFit: 'cover'}}
          width={15}
          height={30}
          alt='arrow-down'
        />
      </button>

      <div className="absolute bottom-0 w-full">
        <GeminiTalk path={pathname} />
      </div>

    </div>
  )
}

export default ChatPage