import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    // topbar
    <header className='border-b border-gray-200'>
        <Topbar/>
        <Navbar/>
    </header>
    // cartdrower
  )
}

export default Header