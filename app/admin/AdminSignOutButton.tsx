// app/admin/AdminSignOutButton.tsx
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/app/components/ui/button';

export default function AdminSignOutButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
      Sign out
    </Button>
  );
}
