import React from 'react'
import { redirect } from 'next/navigation'
const HomePage = () => {
  redirect('/products')

  return (
    <div>page</div>
  )
}

export default HomePage