'use client'
import React from 'react'
import Link from 'next/link'
import { UserButton, auth, useAuth } from "@clerk/nextjs";
import ConversationsContainer from './ConversationsContainer';
import Image from 'next/image';
import { Button } from './ui/button';

const Sidebar = () => {
  const {userId} = useAuth()
  return (
    <div className='h-full w-[300px]'>

      <div className='max-md:hidden md:block w-full h-full glass-container'>

        <div className='p-5 w-full h-full chat-glass'>
          <div className='grid grid-cols-2 justify-center py-5 items-center text-white'>
            <div className='grid relative w-[50px] h-[50px] py-5'> 
              <Image
                className='rounded-lg'
                src={"/chatgpt-alt.png"}
                alt='test logo'
                fill
                style={{objectFit: 'cover'}}
              />
            </div>
            
            <Link href='/dashboard'>Dashboard</Link>
          </div>

          {userId ?
            (
              <div className='grid '>
                <div className='overflow-y-auto'>
                  <ConversationsContainer/>
                </div>
              </div>
            )
            : 
            (
              <div className='flex gap-5 justify-around py-5 text-white'>
                <Button className='hover:bg-[#14CC8F]'><Link href='/sign-up'>Sign Up</Link></Button>
                <Button className='hover:bg-[#14CC8F]'><Link href='/sign-in'>Sign In</Link></Button>
              </div>
            )
          }

          <div className='absolute pl-5 gap-20 flex justify-between items-center bottom-5 right-auto'>
            <h1 className='text-white'>Next-Gemini</h1>
            <UserButton afterSignOutUrl='/'/>
          </div>
           
        </div>
      </div>
    </div>
  )
}

export default Sidebar