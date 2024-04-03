// 'use client'
import React from 'react'
import Image from 'next/image'
import GeminiTalk from '@/components/GeminiTalk'
import { currentUser } from '@clerk/nextjs'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MotionDiv } from '@/components/MotionDiv';

export default async function Home() {
  const user = await currentUser()
  console.log('Main home page user check:', user)

   // Framer Motion config:
   const variants = {
    hidden: {opacity: 0},
    visible: {opacity: 1},
  }

  if (!user) 
  return (
    <>
    <MotionDiv 
      variants={variants}
      initial='hidden'
      animate='visible'
      transition={{
        // using index of card as a index timer to sequentially show cards:
        delay:0.25,
        ease: 'easeInOut',
        duration: .5
      }}
      viewport={{amount: 0}}
      className='relative'
    >

      <div 
        style={{backgroundImage: `url(/world-map-with-square-dots.png)`}}
        className='details-container z-0 opacity-40 h-[100%]'
        // className='details-container opacity-20 z-0 max-md:h-[80vh] md:h-[100vh]'
      ></div>

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

      <div className='relative'>
        <div className='grid justify-center text-white text-center py-10 gap-5'>
          <h1 className='text-2xl'>The Next Generation of AI Excellence!</h1>
          <h1>Powered with Google&apos;s State of the Art AI Gemini and the power of Vercel&apos;s NextJS Framework</h1>
          <h1>Come venture into Gemini&apos;s world. </h1>
        </div>

        <div className='max-md:grid md:hidden justify-center items-center py-5'>
            <div className='grid gap-5 justify-around py-3 text-white'>
              <Button className='bg-black hover:bg-[#14CC8F]'><Link href='/sign-up'>Sign Up</Link></Button>
              <Button className='bg-black hover:bg-[#14CC8F]'><Link href='/sign-in'>Sign In</Link></Button>
            </div>
        </div>
      </div>

    </MotionDiv>
  </>
  )
  
  return (
    <MotionDiv 
      variants={variants}
      initial='hidden'
      animate='visible'
      transition={{
        // using index of card as a index timer to sequentially show cards:
        delay:0.25,
        ease: 'easeInOut',
        duration: .5
      }}
      viewport={{amount: 0}}
      className='relative h-full'
      >
  
      <div 
        style={{backgroundImage: `url(/world-map-with-square-dots.png)`}}
        className='details-container z-0 opacity-40 h-[100%]'
        // className='details-container opacity-20 z-0 max-md:h-[80vh] md:h-[100vh]'
      ></div>
      
      <div className='relative grid justify-center p-10 text-white items-center gap-5 h-full'>
        <div className='grid justify-center relative w-[150px] h-[150px] py-5'> 
          <Image
            className='rounded-lg'
            src={"/chatgpt-alt.png"}
            alt='test logo'
            fill
            style={{objectFit: 'cover'}}
          />
        </div>
        
        <div className='relative'>
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
      </div>
    </MotionDiv>
  )
}
