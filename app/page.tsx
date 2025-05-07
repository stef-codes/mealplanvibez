import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, ShoppingCart, Calendar, Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center p-2 rounded-full bg-green-100 mb-4">
              <ChefHat className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-green-800">ChefItUp</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-[700px]">
              Plan meals, discover recipes, and get ingredients delivered with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/recipes">Explore Recipes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Everything you need to simplify meal planning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Heart className="h-8 w-8 text-green-600" />}
              title="Discover Recipes"
              description="Browse through hundreds of recipes tailored to your dietary preferences and restrictions."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-green-600" />}
              title="Plan Your Week"
              description="Easily plan your meals for the week with our intuitive calendar interface."
            />
            <FeatureCard
              icon={<ShoppingCart className="h-8 w-8 text-green-600" />}
              title="Order Ingredients"
              description="Generate shopping lists and order ingredients directly through Instacart."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Ready to simplify your meal planning?</h2>
            <p className="text-xl text-gray-600 max-w-[600px]">
              Join ChefItUp today and transform how you plan, shop, and cook.
            </p>
            <Button asChild size="lg" className="mt-6 bg-green-600 hover:bg-green-700">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-3 rounded-full bg-green-100 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
