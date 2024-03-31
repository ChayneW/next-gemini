// 'use client'
import React from 'react'
import Image from 'next/image'
import GeminiTalk from '@/components/GeminiTalk'
import Conversations from '@/components/Conversations'
import { currentUser } from '@clerk/nextjs';
import ConversationsContainer from '@/components/ConversationsContainer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default async function Home() {
  const user = await currentUser()
  console.log(user)



  if (!user) 
  return (
    <>
      <div className='grid justify-center text-white pt-20'>
        {/* Not logged in */}
        
        <h1 className='text-2xl text-center'> Welcome to Next-Gemini</h1>

        <div className='grid justify-center relative w-[300px] h-[300px]'>
          <Image
            className='rounded-lg'
            src={'/chatgpt-alt-removebg-preview.png'}
            fill
            style={{objectFit: 'cover'}}
            // width={400}
            // height={400}
            alt='logo'
          />
        </div>

      </div>

      <div className='grid justify-center text-white text-center py-10 gap-5'>
        <h1 className='text-2xl'>The Next Generation of AI Excellence!</h1>
        <h1>Powered with Google&apos;s State of the Art AI Gemini and the power of Vercel&apos;s NextJS Framework</h1>
        <h1>Come venture into Gemini&apos;s world. </h1>
      </div>

      <div className='max-md:grid md:hidden justify-center items-center py-10'>
          <div className='grid gap-10 justify-around py-5 text-white'>
            <Button className='bg-black hover:bg-[#14CC8F]'><Link href='/sign-up'>Sign Up</Link></Button>
            <Button className='bg-black hover:bg-[#14CC8F]'><Link href='/sign-in'>Sign In</Link></Button>
          </div>
      </div>
  </>
  )
  
  return (
  <div className='grid justify-center p-20 text-white items-center gap-5'>
    <div className='grid justify-center relative w-[150px] h-[150px] py-5'> 
      <Image
        className='rounded-lg'
        src={"/chatgpt-alt.png"}
        alt='test logo'
        fill
        style={{objectFit: 'cover'}}
      />
    </div>
    
    <div>
      <h1 className='text-center'>Welcome, {user?.firstName}</h1>
    </div>
    <div>
      <Button className='hover:bg-[#14CC8F]'>
        <Link href={'/dashboard'}>
          <h1>Go to Dashboard</h1>
        </Link>
      </Button>
    </div>
  </div>
  )
}
