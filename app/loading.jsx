import { Loader } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
        <div>
        <Loader className='animate-spin' />
        </div>
    </div>
  )
}

export default loading