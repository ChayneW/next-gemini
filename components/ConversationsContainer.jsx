'use client'
import React, {useState, useEffect} from 'react'
import { getAllChats, deleteChat } from '@/utils/supabaseRequests'
import Link from 'next/link'
import { FaSpinner } from 'react-icons/fa';
import MiniLoader from './MiniLoader';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'


const ConversationsContainer = () => {

  const path = usePathname()
  const router = useRouter()
  console.log('path for conversations:', path)
  
  const [supaConvos, setSupaConvos] = useState([])
  const [isDeleting, setIsDeleting] = useState(false); // State to track deletion process
  const [isLoading, setIsLoading] = useState(true); // Initialize with true to show loading indicator


  useEffect(() => {
    const fetchConvos = async () => {
      try {
        console.log('inside conversations Container useEffect:')
        const convos = await getAllChats()
        console.log('convos:', convos)
        setSupaConvos(convos)
      } catch (error) {
        console.error('Error fetching conversations:', error.message);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };
    fetchConvos();
  }, [path]);

  const handleDeleteClick = async (chatId) => {
    setIsDeleting(true); // Set isDeleting to true when deletion starts
    try {
      await deleteChat(chatId);
      // Refetch conversations after deletion
      const convos = await getAllChats();
      setSupaConvos(convos);
    } catch (error) {
      console.error('Error deleting chat:', error.message);
    } finally {
      setIsDeleting(false); // Reset isDeleting to false when deletion finishes
      router.push('/dashboard')
    }
  }

  // Function to shorten the title
  const shortenTitle = (title) => {
    const words = title.split(' ');
    if (words.length > 2) {
      return words.slice(0, 3).join(' ') + '...';
    }
    return title;
  };

  if (isLoading) {
    return <div className='grid justify-center text-white'>
      Loading...
      <MiniLoader/>
      </div>;
  }

  // if
  return (
    <div className='max-h-[65vh] overflow-y-auto text-white py-10'>
        {supaConvos?.map((note, _index) => (
          <div key={_index} className={`rounded-lg grid py-5 pl-2 ${path === `/${note.id}` ? 'bg-[#333]' : ''}`}>
            <div className='grid grid-cols-2'>
              <Link href={`/${note.id}`}>
                <h1 className='max-md:text-white  pr-2'>{shortenTitle(note.title)}</h1>
              </Link>
              <button 
                className='grid justify-center self-center'
                onClick={() => handleDeleteClick(note.id)}>
                {isDeleting ? <FaSpinner className="animate-spin" /> : 
                  <div className=''>
                    <div className=''>
                      <Image
                        src='/trash-white.svg'
                        width={20}
                        height={20}
                        alt='delete'
                      />
                    </div>
                  </div>
                }
              </button>
            </div>
          </div>
        ))}

    </div>
  )
}

export default ConversationsContainer