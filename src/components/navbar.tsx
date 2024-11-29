"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import { User } from "next-auth"


export function NavbarComponent() {
  const { data: session } = useSession();
  const user: User = session?.user;

  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-background">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-foreground hover:bg-foreground/10 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                {user?.role == 'admin' &&
                  <Link
                    href="/registeruser"
                    className="text-foreground hover:bg-foreground/10 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                }
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center px-7">
              {session ? (
                <>
                  <Button onClick={() => signOut()} variant='destructive'>
                    Logout
                  </Button>
                </>
              ) : (
                <Button className="hover:bg-black hover:text-white mr-4" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-4"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="-mr-2 flex md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu" className="text-foreground transition-all duration-300 ease-in-out">
                <div className={`transform transition-all duration-300 ease-in-out ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-center justify-center">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-foreground hover:bg-foreground/10 hover:text-primary block px-5 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            {user?.role == 'admin' &&
            <Link
            href="/registeruser"
            className="text-foreground hover:bg-foreground/10 hover:text-primary block px-5 py-2 rounded-md text-base font-medium"
          >
            Register
          </Link>
            }
          </div>
          <div className="pt-3 pb-3 border-t border-foreground/10">


            {session ? (
              <>
                <Button onClick={() => signOut()} className="px-10" variant='destructive'>
                  Logout
                </Button>
              </>
            ) : (
              <Button className="hover:bg-black hover:text-white px-10" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}