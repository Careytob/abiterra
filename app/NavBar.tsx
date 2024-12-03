'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { Button } from '@radix-ui/themes'

const NavBar = () => {
    const currentPath = usePathname();

    const links = [
        {label: 'Home', href: '/'},
        {label: 'Buy', href: '/buy'},
        {label: 'Rent', href: '/rent'},
        {label: 'About Us', href: '/aboutus'},
        {label: 'Blog', href: '/blog'},
        {label: 'Contact', href: '/contact'},
    ]
  return (
    <nav className='flex items-center border-b mb-5 px-24 h-14'>
    
    <Link href='/'>
      <Image src='/logo.svg' alt='logo' width={70} height={70} />
    </Link>
  
    
    <ul className='flex space-x-6 ml-8'> 
      {links.map(link => 
      <li key={link.href} >
        <Link 
          
          className={classNames({
            ' border-b-[3px]  border-teal-500 ' : link.href === currentPath,
            'text-zinc-500 border-b-transparent' : link.href !== currentPath,
            'hover:text-zinc-900 py-4 ': true
            
          })}
          href={link.href}
        >
          {link.label}
        </Link>
        </li>
      )}
    </ul>
  
    
    <div className='flex space-x-4 ml-auto items-center'> 
      <Link 
        href='/login' 
        className='text-zinc-500 hover:text-zinc-900 transition-colors'
      >
        Log In
      </Link>
      <Link 
        href='/signup' 
        //className='text-white font-bold  bg-teal-500 px-4 py-2 rounded-3xl hover:bg-teal-700 transition-colors'
      >
        <Button color='teal'>Sign Up</Button>
        
        
      </Link>
    </div>
  </nav>
  
  )
}

export default NavBar
