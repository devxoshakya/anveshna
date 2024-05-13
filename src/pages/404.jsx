import React from 'react'
import logo from '../images/404-desktop.png'

const PageNotFound = () => {
  return (
    <div className='mt-16 '>
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-white mt-16 md:pt-36 justify-center text-2xl md:text-sm md:my-4 my-8 mx-2  md:justify-center font-bold'>No, no, no nothing's here, <a className='text-blue-500' href="/home">let's go home</a></h1>
            <img src={logo} alt='404' className='w-1/4 md:w-1/2 mx-auto' />
        </div>
      
    </div>
  )
}

export default PageNotFound;
