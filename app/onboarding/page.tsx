"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

// Dietary restrictions options
const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "nut-free", label: "Nut-Free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
]

// Form validation schema
const onboardingSchema = z.object({
  householdSize: z.coerce
    .number()
    .min(1, "Household size must be at least 1")
    .max(10, "Household size must be 10 or less"),
  dietaryRestrictions: z.array(z.string()).default([]),
  connectInstacart: z.boolean().default(false),
})

type OnboardingFormValues = z.infer<typeof onboardingSchema>

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateUserPreferences } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      householdSize: user?.preferences.householdSize || 1,
      dietaryRestrictions: user?.preferences.dietaryRestrictions || [],
      connectInstacart: user?.preferences.instacartConnected || false,
    },
  })

  // Form submission handler
  const onSubmit = async (values: OnboardingFormValues) => {
    setIsLoading(true)
    try {
      updateUserPreferences({
        householdSize: values.householdSize,
        dietaryRestrictions: values.dietaryRestrictions || [],
        instacartConnected: values.connectInstacart,
      })

      toast({
        title: "Preferences saved!",
        description: "Your preferences have been updated successfully.",
      })

      router.push("/recipes")
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Set Your Preferences</CardTitle>
          <CardDescription>Tell us about your household and dietary preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="householdSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Household Size</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormDescription>How many people are you cooking for?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="mb-2 font-medium">Dietary Restrictions</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Select any dietary restrictions that apply to your household
                </p>
                <div className="space-y-2">
                  {dietaryOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="dietaryRestrictions"
                      render={({ field }) => {
                        return (
                          <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || []
                                  return checked
                                    ? field.onChange([...currentValue, option.id])
                                    : field.onChange(currentValue.filter((value) => value !== option.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="connectInstacart"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Connect to Instacart</FormLabel>
                      <FormDescription>Link your Instacart account to order ingredients directly</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/recipes")} className="text-green-600">
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
