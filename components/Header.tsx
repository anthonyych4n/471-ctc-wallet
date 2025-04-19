import React from 'react'
import { Button } from './ui/button'

const Header = () => {
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
        <div className="flex flex-row items-center">
            <span>*logo here*</span>
            <span className='text-blue-800 font-bold text-xl'>CTC Wallet</span>
        </div>

        {/* Need to add conditional rendering and Link tags */}
        <div className='flex gap-3 items-center'>
            <Button variant="outline" className='rounded-full'>Sign In</Button>
            <Button className='rounded-full bg-blue-800'>Sign Up</Button>
        </div>
    </div>
  )
}

export default Header