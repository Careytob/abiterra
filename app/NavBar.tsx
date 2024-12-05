'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { Avatar, Box, Button, DropdownMenu, Flex, Text } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';


const NavBar = () => {
  const currentPath = usePathname();
  const { status,data: session } = useSession(); 

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'About Us', href: '/aboutus' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className=' border-b mb-5 px-24 py-3'>
      <Flex justify='between'>
        <Flex align='center'>
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
        </Flex>
      <Box className=""> 
        {status === 'authenticated' && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Avatar src={session.user!.image!} fallback='?'
              size='2'
              radius='full'
              className='cursor-pointer'/>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
            <DropdownMenu.Label>
            <Text size="3">
              {session.user!.email}
              </Text> 
            </DropdownMenu.Label>
            <DropdownMenu.Label>
              <Text>
                Welcome {session.user!.name}
              </Text>
            </DropdownMenu.Label>
            <DropdownMenu.Item color='teal'>
            <Link href='/api/auth/signout'>Log Out</Link>
            </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
         
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
      </Flex>
    </nav>
  );
};

export default NavBar;
