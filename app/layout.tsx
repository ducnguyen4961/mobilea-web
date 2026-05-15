'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import BottomNav from '@/components/aBottomNav';
import { Providers } from "./providers"


export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Ẩn thanh Bar trong mục Graph
  const hideBottomNav = pathname === "/graph";

  return (
    <html>
      <body>
        <Providers>
          {children}
          {!hideBottomNav && <BottomNav />}
        </Providers>
      </body>
    </html>
  );
}
