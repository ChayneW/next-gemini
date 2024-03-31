'use client'
import React, {Suspense} from 'react'
import GeminiTalk from '@/components/GeminiTalk'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { checkUserExists } from '@/utils/hooks/CheckUser';
import { useAuth, useUser } from '@clerk/nextjs';
// import { supabaseClient } from '@/utils/supabaseClient';
import LoadingCard from '@/components/LoadingCard'
import Image from 'next/image'

const SidebarFallback = () => <div>Loading Sidebar...</div>;


const DashboardPage = () => {
    
  console.log('inside Dashboard:')
  const {getToken, userId} = useAuth()
  const {user} = useUser()
  console.log('Dashboard userId:', userId)
  console.log('Dashboard user:', user)
  checkUserExists()
  const pathname = usePathname()
  const router = useRouter()
//   console.log(pathname)

  return (
    <div className='relative w-full h-full text-white'>
      <Suspense fallback={<LoadingCard />}>
        <div className='grid justify-center h-[20%] pt-20 gap-5'>
          <h1 className='text-center text-3xl'>How Can I Help?</h1>
          <div className='grid justify-center py-5'>
            <Image
              className='border rounded-lg grid justify-center'
              src={"/chatgpt-alt.png"}
              alt='test logo'
              height={80} 
              width={80}
            />
          </div>
          <h1 className='text-center'>(Notice: data only relevant up to 2021)</h1>
        </div>

        <div className='flex'>
          <div className='flex w-full'> 
            <GeminiTalk path={pathname}/>
          </div>
        </div>
      </Suspense> 
    </div>
  )
}

export default DashboardPage