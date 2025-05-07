"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Form validation schema for preferences
const preferencesSchema = z.object({
  householdSize: z.coerce
    .number()
    .min(1, "Household size must be at least 1")
    .max(10, "Household size must be 10 or less"),
  dietaryRestrictions: z.array(z.string()).default([]),
  instacartConnected: z.boolean().default(false),
})

// Form validation schema for account
const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

type PreferencesFormValues = z.infer<typeof preferencesSchema>
type AccountFormValues = z.infer<typeof accountSchema>

export default function ProfilePage() {
  const { toast } = useToast()
  const { user, updateUserPreferences } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Initialize preferences form
  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      householdSize: user?.preferences.householdSize || 1,
      dietaryRestrictions: user?.preferences.dietaryRestrictions || [],
      instacartConnected: user?.preferences.instacartConnected || false,
    },
  })

  // Initialize account form
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  // Preferences form submission handler
  const onPreferencesSubmit = async (values: PreferencesFormValues) => {
    setIsLoading(true)
    try {
      updateUserPreferences({
        householdSize: values.householdSize,
        dietaryRestrictions: values.dietaryRestrictions || [],
        instacartConnected: values.instacartConnected,
      })

      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating preferences",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Account form submission handler
  const onAccountSubmit = async (values: AccountFormValues) => {
    setIsLoading(true)
    try {
      // In a real app, this would update the user's account info
      toast({
        title: "Account updated",
        description: "Your account information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating account",
        description: "There was a problem updating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Not logged in</h1>
        <p className="mb-6">Please log in to view your profile.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <a href="/login">Log In</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Tabs defaultValue="preferences">
        <TabsList className="mb-8">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your household and dietary preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...preferencesForm}>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                  <FormField
                    control={preferencesForm.control}
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
                          control={preferencesForm.control}
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
                    control={preferencesForm.control}
                    name="instacartConnected"
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

                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                  <FormField
                    control={accountForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={accountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update Account"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Change Password</Button>
              <Button variant="destructive">Delete Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
