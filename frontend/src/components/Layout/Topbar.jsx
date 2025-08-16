import React from 'react'
import {TbBrandMeta} from "react-icons/tb";
import {IoLogoInstagram} from "react-icons/io";
import {RiTwitterXLine} from "react-icons/ri";
// wherever you import your other icons
import { FaGithub, FaLinkedin } from "react-icons/fa";


const Topbar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4'>
            <div className='hidden md:flex items-center space-x-4'>
                <a href='https://github.com/akshaychavan23031998' className='hover:text-gray-300'>
                    <FaGithub className='h-5 w-5'/>
                </a>

                <a href='https://www.linkedin.com/in/akshay-chavan23/' className='hover:text-gray-300'>
                    <FaLinkedin className='h-5 w-5'/>
                </a>

                <a href='https://x.com/AkshayC23480775' className='hover:text-gray-300'>
                    <RiTwitterXLine className='h-5 w-5'/>
                </a>
            </div>
            <div className='text-sm text-center flex-grow'>
                <span>We ship worldWide - Fast reliable shipping!</span>
            </div>
            <div className='text-sm hidden md:block'>
                <a href='+00 1234509876' className='hover:text-gray-300'>
                    +00 1234509876
                </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar