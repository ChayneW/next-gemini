'use client'
import React, {useState, Suspense } from 'react'
// import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Sheet, SheetTrigger, SheetContent, SheetHeader} from './ui/sheet'
import { Button } from "./ui/button"
import Image from 'next/image'
import Link from 'next/link'
import { UserButton, useAuth } from "@clerk/nextjs"
import ConversationsContainer from './ConversationsContainer';
// import { Button } from './ui/button'

const Navbar = () => {
  const {userId} = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <nav className='w-full glass-container py-2'>
      {/* Navbar */}
      <div className='chat-glass'>
        <Sheet>
            <SheetTrigger asChild>
              <div className='flex justify-between items-center px-5'>
                <Button variant="outline" className='grid relative w-[50px] h-[50px] py-5'>
                  <Image
                    className='rounded-lg'
                    src={"/chatgpt-alt.png"}
                    alt='test logo'
                    fill
                    style={{objectFit: 'cover'}}
                  />
                </Button>

                {/* <h1 className='text-white'>Next-Gemini</h1> */}
                <UserButton afterSignOutUrl='/'/>
              </div>
            </SheetTrigger>

            <SheetContent side='left' className='hidden max-md:block w-[250px] '>
              <SheetHeader className='bg-transparent'>
                <div className='flex justify-around items-center bg-transparent space-x-3'>
                  <Image
                    className='border rounded-lg'
                    src={"/chatgpt-alt.png"}
                    alt='test logo'
                    height={50} 
                    width={50}
                  />
                  {/* <UserButton afterSignOutUrl='/'/> */}
                </div>
              </SheetHeader>

              {userId ?
                (
                <div className='pl-5 bg-transparent grid space-y-10 pt-10 text-white'>
                  <Link href='/' className='bg-transparent text-center'>Dashboard:</Link>
                  <ConversationsContainer/>
                </div>
                )
                :
                (
                <div className='grid justify-center items-center py-10'>
                    <div className='flex gap-5 justify-around py-5 text-white'>
                      {/* <Link href='/sign-up'>Sign Up</Link>
                      <Link href='/sign-in'>Sign In</Link> */}
                      <Button className='hover:bg-[#14CC8F]'><Link href='/sign-up'>Sign Up</Link></Button>
                      <Button className='hover:bg-[#14CC8F]'><Link href='/sign-in'>Sign In</Link></Button>
                    </div>
                </div>
                )
              }

              <div className='absolute pl-5 gap-20 flex justify-between items-center bottom-5 right-auto'>
                <h1 className='text-center text-white'>Next-Gemini</h1>
                {/* <UserButton afterSignOutUrl='/'/> */}
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </nav>
    
  )
}

export default Navbar