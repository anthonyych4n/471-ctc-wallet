import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { LogoIcon } from './icons/Logo'

const Header = () => {
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
        <div className="flex flex-row items-center gap-2">
            <LogoIcon className="ctcIcon" />
            
            {
            <Image 
              src="/logo.svg" 
              alt="CTC Wallet Logo" 
              width={32}
              height={32}
              priority
            />
            }
            
            <span className='text-ctcColourSet-purpleVib font-bold text-xl'>CTC Wallet</span>
        </div>

        {/* Need to add conditional rendering and Link tags */}
        <div className='flex gap-3 items-center'>
            <Button variant="outline" className='rounded-full'>Sign In</Button>
            <Button className='rounded-full bg-ctcColourSet-lavender'>Sign Up</Button>
        </div>
    </div>
  )
}

export default Header