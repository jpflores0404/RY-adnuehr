import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maternity EHR System',
  description: 'Electronic Health Record System for Maternity and Birthing Home',
};

import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('auth')?.value === 'authenticated';

  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-900 min-h-screen flex selection:bg-red-200/50 relative overflow-x-hidden`}>
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 overflow-y-auto w-full relative z-10 ${isAuthenticated ? 'p-8' : ''}`}>
          {isAuthenticated && (
            <div className="absolute top-6 right-8 z-30">
              <Link
                href="/maternal/new"
                className="inline-flex items-center px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-300/50 transition-all"
              >
                + New Patient
              </Link>
            </div>
          )}
          {children}
        </main>
      </body>
    </html>
  );
}
