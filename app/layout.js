// 'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className=''>
          <div className='max-md:grid md:flex md:h-full md:overflow-hidden'>
          {/* md:overflow-hidden */}
            
            <div className='max-md:hidden md:block'>
              <Sidebar/>
            </div>

            <div className='max-md:block md:hidden'>
              <Navbar/>
            </div>

            <div className='flex-1 h-screen overflow-y-auto bg-[#0D1A1A]'>
              <Toaster position='top-right'/>
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}