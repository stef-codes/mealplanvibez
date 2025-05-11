"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const searchExamples = [
  "Quick vegetarian dinner under 30 minutes",
  "Italian recipes without dairy",
  "High protein meal prep ideas",
  "Gluten-free breakfast options",
  "Asian recipes with chicken",
  "Meal ideas for a dinner party",
  "Healthy lunch recipes for work",
  "Desserts without refined sugar",
  "One-pot meals for busy weeknights",
  "Mediterranean diet recipes",
]

export function SearchExamples() {
  const router = useRouter()
  const [examples, setExamples] = useState(searchExamples.slice(0, 5))

  const handleExampleClick = (example: string) => {
    // Navigate to recipes page with the search query
    router.push(`/recipes?query=${encodeURIComponent(example)}`)
  }

  const shuffleExamples = () => {
    const shuffled = [...searchExamples].sort(() => 0.5 - Math.random())
    setExamples(shuffled.slice(0, 5))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Try searching for:</h3>
        <Button variant="ghost" size="sm" onClick={shuffleExamples}>
          Show more
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="rounded-full bg-green-50 border-green-200 hover:bg-green-100"
            onClick={() => handleExampleClick(example)}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  )
}
