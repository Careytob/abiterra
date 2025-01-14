'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { Avatar, Box, Button, DropdownMenu, Flex, Text } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';

const NavBar = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const { status, data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'About Us', href: '/aboutus' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="border-b bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Flex justify="between" align="center" className="py-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-zinc-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="logo" width={70} height={70} />
          </Link>

          {/* Navigation Links - Desktop */}
          <ul className="hidden md:flex space-x-6 ml-8">
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
              <Button 
                variant="outline" 
                color="green" 
                className="text-sm"
                onClick={() => router.push('/login')}
              >
                Log In
              </Button>
              <Link href="/signup" className="hidden md:inline">
                <Button variant="solid" color="teal" className="text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
            )}
          </Box>
        </Flex>

        {/* Mobile Navigation Menu */}
        <div 
          className={classNames(
            'fixed md:hidden bg-white top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-30',
            {
              'translate-x-0': isMenuOpen,
              '-translate-x-full': !isMenuOpen
            }
          )}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image src="/logo.svg" alt="logo" width={70} height={50} />
            </Link>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-zinc-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <ul className="pt-2 pb-4">
            {links.map((link) => (
              <li key={link.href} className="mb-0">
                <Link
                  className={classNames(
                    'block px-4 py-2 rounded-lg',
                    {
                      'bg-teal-50': link.href === currentPath,
                      'text-zinc-500 hover:bg-gray-50': link.href !== currentPath
                    }
                  )}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {isMenuOpen && (
         <div 
           className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
           onClick={() => setIsMenuOpen(false)}
         />
       )}
      </div>
    </nav>
  );
};

export default NavBar;