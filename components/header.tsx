"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChefHat, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()
  const { user, signOut } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleSignOut = () => {
    signOut()
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    })
    closeMenu()
  }

  const navItems = [
    { name: "Recipes", href: "/recipes" },
    { name: "Meal Planner", href: "/meal-planner" },
    { name: "Shopping List", href: "/shopping-list" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <ChefHat className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-green-800">ChefItUp</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-green-600",
                pathname === item.href ? "text-green-600" : "text-foreground/60",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  My Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background border-t">
          <div className="container py-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-green-600 py-2",
                    pathname === item.href ? "text-green-600" : "text-foreground/60",
                  )}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-4 mt-4">
              {user ? (
                <>
                  <Link href="/profile" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      My Profile
                    </Button>
                  </Link>
                  <Button variant="default" className="w-full bg-green-600 hover:bg-green-700" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={closeMenu}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
