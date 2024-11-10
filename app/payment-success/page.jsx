import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='pt-20 pb-10 flex justify-center items-center gap-5'>
        <div className='text-center space-y-4'>
            <div className='text-3xl font-semibold'>Thank you for your payment</div>
            <div className='text-xl'>Your order is being processed</div>
            <div>
                <Link href={'/'}>
                <Button>Go to Home</Button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default page