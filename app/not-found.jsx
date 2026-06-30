import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className= "flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
        <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
        <h2 className='text-3xl font-semibold mb-4'>Page not found</h2>
        <p className='text-gray-600 mb-8'>
            Oops! The page you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/">
            <Button className="hover: cursor-pointer">Return Home</Button>
        </Link>
    </div>
  )
}

export default NotFound