import Link from "next/link"
import { ChefHat } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">ChefItUp</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Plan meals, discover recipes, and get ingredients delivered with ease.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/recipes" className="text-sm text-muted-foreground hover:text-green-600">
                  Recipe Discovery
                </Link>
              </li>
              <li>
                <Link href="/meal-planner" className="text-sm text-muted-foreground hover:text-green-600">
                  Meal Planning
                </Link>
              </li>
              <li>
                <Link href="/shopping-list" className="text-sm text-muted-foreground hover:text-green-600">
                  Shopping Lists
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground hover:text-green-600">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-green-600">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-green-600">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-green-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-green-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-green-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ChefItUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
