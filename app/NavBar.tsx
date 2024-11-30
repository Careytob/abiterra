import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const NavBar = () => {

    const links = [
        {label: 'Home', href: '/'},
        {label: 'Buy', href: '/buy'},
        {label: 'Rent', href: '/rent'},
        {label: 'About Us', href: '/aboutUs'},
        {label: 'Blog', href: '/blog'},
        {label: 'Contact', href: '/contact'},
    ]
  return (
   <nav className='flex space-x-6 border-b mb-5 px-5 h-14 items-center'>
        <Link href='/'>
          <Image src='/logo.svg' alt='logo' width={70} height={70} />
        </Link>
        <ul className='flex space-x-6'>
            {links.map(link => 
            <Link 
            key={link.href} 
            className=' text-zinc-500 hover:text-zinc-900 transition-colors' 
            href={link.href}>{link.label}
            </Link> )}

           
            
        </ul>
    </nav>
  )
}

export default NavBar
