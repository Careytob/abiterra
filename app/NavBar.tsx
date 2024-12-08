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
  const { status, data: session } = useSession();

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'About Us', href: '/aboutus' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="border-b bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Flex justify="between" align="center" className="py-4">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            aria-label="Open Menu"
          >
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-zinc-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
          
          {/* Logo */}
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={70} height={70} />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 ml-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className={classNames(
                    'py-2 text-sm font-medium transition-colors',
                    {
                      'border-b-2 border-teal-500 text-teal-600': link.href === currentPath,
                      'text-zinc-600 hover:text-zinc-900 border-b-transparent': link.href !== currentPath,
                    }
                  )}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Actions */}
          <Box className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Avatar
                    src={
                      session.user?.image ||
                      `https://avatars.dicebear.com/api/initials/${session.user?.name}.svg`
                    }
                    fallback={session.user?.name?.charAt(0).toUpperCase() || '?'}
                    size="2"
                    radius="full"
                    className="cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Label>
                    <Text size="3">{session.user!.email}</Text>
                  </DropdownMenu.Label>
                  <DropdownMenu.Label>
                    <Text>Welcome {session.user!.name}</Text>
                  </DropdownMenu.Label>
                  <DropdownMenu.Item color="teal">
                    <Link href="/api/auth/signout">Log Out</Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              <>
                <Link href="/api/auth/signin">
                  <Button variant="outline" color="green" className="text-sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className='hidden md:inline'>
                  <Button variant="solid" color="teal" className="text-sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Box>

          
        </Flex>
      </div>
    </nav>
  );
};

export default NavBar;
