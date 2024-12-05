'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { Box, Button } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';

const NavBar = () => {
  const currentPath = usePathname();
  const { status } = useSession(); // Destructure status to check auth state

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'About Us', href: '/aboutus' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className='flex items-center border-b mb-5 px-24 h-14'>
      <Link href='/'>
        <Image src='/logo.svg' alt='logo' width={70} height={70} />
      </Link>

      <ul className='flex space-x-6 ml-8'>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className={classNames({
                'border-b-[3px] border-teal-500': link.href === currentPath,
                'text-zinc-500 border-b-transparent': link.href !== currentPath,
                'hover:text-zinc-900 py-4': true,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <Box className="ml-auto"> 
        {status === 'authenticated' && (
          <Link href='/api/auth/signout'>
            <Button variant="solid" color="red">Log Out</Button>
          </Link>
        )}
        {status === 'unauthenticated' && (
          <>
            <Link href='/api/auth/signin'>
              <Button variant="outline" color="green" className='mr-2'>Log In</Button>
            </Link>
            <Link href='/signup'> {/* Adjust the route for your signup page */}
              <Button variant="solid" color="teal">Sign Up</Button>
            </Link>
          </>
        )}
      </Box>
    </nav>
  );
};

export default NavBar;
