"use client"

import * as React from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {  Menu, Search } from 'lucide-react'

const Navbar = () => {
  const [isSearchVisible, setIsSearchVisible] = React.useState(false)

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold flex gap-2">OpenChess</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/about" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="/services" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                  Services
                </Link>
                <Link href="/contact" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full md:w-[200px] pl-8"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through our site
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 flex flex-col space-y-4">
                  <Link href="/" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </Link>
                  <Link href="/about" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </Link>
                  <Link href="/services" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                    Services
                  </Link>
                  <Link href="/contact" className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium">
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {isSearchVisible && (
        <div className="md:hidden p-4 border-t">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

