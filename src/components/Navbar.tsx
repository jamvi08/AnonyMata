'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-sm border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl font-bold tracking-tight">
            AnonyMata
          </Link>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-semibold tracking-wide">
            by Janhavi
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {session ? (
            <>
              <span className="text-sm font-medium">
                Welcome, {user.username || user.email}
              </span>
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <ThemeToggle />
                <Button 
                  onClick={() => signOut()} 
                  className="w-full md:w-auto bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200" 
                  variant="outline"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <ThemeToggle />
              <Link href="/sign-in" className="w-full md:w-auto">
                <Button className="w-full md:w-auto bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;