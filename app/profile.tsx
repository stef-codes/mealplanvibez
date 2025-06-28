"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Title, Button, Card, List, Switch, Divider, Avatar, Paragraph, TextInput, Chip, Menu } from "react-native-paper"
import { useAuth } from "../lib/auth/AuthContext"
import { router } from "expo-router"
import { theme } from "../lib/theme"

export default function StandaloneProfileScreen() {
  const { user, signOut } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  
  // Diabetes-specific state
  const [diabetesType, setDiabetesType] = useState("type-2")
  const [showDiabetesMenu, setShowDiabetesMenu] = useState(false)
  const [targetBloodSugar, setTargetBloodSugar] = useState("120")
  const [insulinSensitivity, setInsulinSensitivity] = useState("50")
  const [carbRatio, setCarbRatio] = useState("15")
  const [medications, setMedications] = useState("Metformin")
  const [allergies, setAllergies] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [showActivityMenu, setShowActivityMenu] = useState(false)

  const diabetesTypes = [
    { label: "Type 1 Diabetes", value: "type-1" },
    { label: "Type 2 Diabetes", value: "type-2" },
    { label: "Gestational Diabetes", value: "gestational" },
    { label: "Pre-diabetes", value: "pre-diabetes" },
  ]

  const activityLevels = [
    { label: "Sedentary (little or no exercise)", value: "sedentary" },
    { label: "Lightly active (light exercise 1-3 days/week)", value: "light" },
    { label: "Moderately active (moderate exercise 3-5 days/week)", value: "moderate" },
    { label: "Very active (hard exercise 6-7 days/week)", value: "very-active" },
    { label: "Extremely active (very hard exercise, physical job)", value: "extremely-active" },
  ]

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut()
            router.replace("/login")
          } catch (error) {
            Alert.alert("Error", "Failed to sign out")
          }
        },
      },
    ])
  }

  const saveProfile = () => {
    Alert.alert("Success", "Profile settings saved successfully!")
  }

  const getDiabetesTypeLabel = (value: string) => {
    const type = diabetesTypes.find(t => t.value === value)
    return type ? type.label : "Select diabetes type"
  }

  const getActivityLevelLabel = (value: string) => {
    const level = activityLevels.find(l => l.value === value)
    return level ? level.label : "Select activity level"
  }

  // If user is not logged in, show demo version
  if (!user) {
    return (
      <ScrollView style={styles.container}>
        {/* Demo Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label="D"
              style={styles.avatar}
            />
            <Title style={styles.userName}>Demo User</Title>
            <Paragraph style={styles.userEmail}>demo@example.com</Paragraph>
            <Chip 
              icon="heart-pulse" 
              style={styles.diabetesChip}
              textStyle={{ color: theme.colors.primary }}
            >
              Type 2 Diabetes
            </Chip>
            <Card style={styles.signInPrompt}>
              <Card.Content style={styles.signInPromptContent}>
                <Paragraph style={styles.signInPromptText}>
                  Sign in to save your profile and access personalized features
                </Paragraph>
                <Button mode="contained" onPress={() => router.push("/login")} style={styles.loginButton}>
                  Sign In
                </Button>
              </Card.Content>
            </Card>
          </Card.Content>
        </Card>

        {/* Demo Diabetes Health Information */}
        <Card style={styles.healthCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Diabetes Health Profile</Title>
            <Paragraph style={styles.demoText}>This is a demo profile. Sign in to customize your settings.</Paragraph>
            
            {/* Diabetes Type */}
            <View style={styles.inputGroup}>
              <Paragraph style={styles.inputLabel}>Diabetes Type *</Paragraph>
              <Button
                mode="outlined"
                onPress={() => Alert.alert("Sign In Required", "Please sign in to customize your diabetes type.")}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownContent}
              >
                Type 2 Diabetes
              </Button>
            </View>

            {/* Blood Sugar Target */}
            <View style={styles.inputGroup}>
              <Paragraph style={styles.inputLabel}>Target Blood Sugar (mg/dL)</Paragraph>
              <TextInput
                value="120"
                mode="outlined"
                keyboardType="numeric"
                placeholder="120"
                style={styles.input}
                disabled
              />
            </View>

            {/* Insulin Sensitivity */}
            <View style={styles.inputGroup}>
              <Paragraph style={styles.inputLabel}>Insulin Sensitivity (mg/dL per unit)</Paragraph>
              <TextInput
                value="50"
                mode="outlined"
                keyboardType="numeric"
                placeholder="50"
                style={styles.input}
                disabled
              />
            </View>

            {/* Carb Ratio */}
            <View style={styles.inputGroup}>
              <Paragraph style={styles.inputLabel}>Carb Ratio (grams per unit insulin)</Paragraph>
              <TextInput
                value="15"
                mode="outlined"
                keyboardType="numeric"
                placeholder="15"
                style={styles.input}
                disabled
              />
            </View>

            {/* Medications */}
            <View style={styles.inputGroup}>
              <Paragraph style={styles.inputLabel}>Current Medications</Paragraph>
              <TextInput
                value="Metformin"
                mode="outlined"
                placeholder="e.g., Metformin, Insulin"
                style={styles.input}
                disabled
              />
            </View>

            {/* Allergies */}
            <View style={styles.inputGroup}>
              <Paragraph style={styles.inputLabel}>Food Allergies</Paragraph>
              <TextInput
                value="None"
                mode="outlined"
                placeholder="e.g., Peanuts, Gluten"
                style={styles.input}
                disabled
              />
            </View>
          </Card.Content>
        </Card>

        {/* Demo Physical Information */}
        <Card style={styles.physicalCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Physical Information</Title>
            <Paragraph style={styles.demoText}>Sign in to enter your personal measurements.</Paragraph>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Paragraph style={styles.inputLabel}>Weight (lbs)</Paragraph>
                <TextInput
                  value="150"
                  mode="outlined"
                  keyboardType="numeric"
                  placeholder="150"
                  style={styles.input}
                  disabled
                />
              </View>
              <View style={styles.halfInput}>
                <Paragraph style={styles.inputLabel}>Height (inches)</Paragraph>
                <TextInput
                  value="68"
                  mode="outlined"
                  keyboardType="numeric"
                  placeholder="68"
                  style={styles.input}
                  disabled
                />
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.inputGroup}>
              <Paragraph style={styles.inputLabel}>Activity Level</Paragraph>
              <Button
                mode="outlined"
                onPress={() => Alert.alert("Sign In Required", "Please sign in to set your activity level.")}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownContent}
              >
                Moderately active (moderate exercise 3-5 days/week)
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Demo Dietary Preferences */}
        <Card style={styles.preferencesCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Dietary Preferences</Title>
            <Paragraph style={styles.demoText}>Sign in to manage your dietary preferences.</Paragraph>
            <List.Item
              title="Manage Dietary Restrictions"
              description="Set your food preferences and restrictions"
              left={() => <List.Icon icon="food-apple" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert("Sign In Required", "Please sign in to manage your dietary preferences.")}
            />
            <Divider />
            <List.Item
              title="Favorite Recipes"
              description="View your saved and favorite recipes"
              left={() => <List.Icon icon="heart" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert("Sign In Required", "Please sign in to view your favorite recipes.")}
            />
          </Card.Content>
        </Card>

        {/* Demo App Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>App Settings</Title>
            <Paragraph style={styles.demoText}>Sign in to customize your app settings.</Paragraph>
            <List.Item
              title="Blood Sugar Reminders"
              description="Get notifications to check your blood sugar"
              left={() => <List.Icon icon="bell" />}
              right={() => <Switch value={true} disabled />}
            />
            <Divider />
            <List.Item
              title="Meal Planning Reminders"
              description="Get notifications about meal planning"
              left={() => <List.Icon icon="calendar" />}
              right={() => <Switch value={true} disabled />}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              description="Switch to dark theme"
              left={() => <List.Icon icon="theme-light-dark" />}
              right={() => <Switch value={false} disabled />}
            />
          </Card.Content>
        </Card>

        {/* Demo Support */}
        <Card style={styles.supportCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Support</Title>
            <List.Item
              title="Diabetes Management Tips"
              description="Get personalized tips for managing your diabetes"
              left={() => <List.Icon icon="lightbulb" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert("Demo", "This would show diabetes management tips.")}
            />
            <Divider />
            <List.Item
              title="Contact Healthcare Provider"
              description="Get in touch with your healthcare team"
              left={() => <List.Icon icon="medical-bag" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert("Demo", "This would help you contact your healthcare provider.")}
            />
            <Divider />
            <List.Item
              title="Help & FAQ"
              description="Get help and find answers to common questions"
              left={() => <List.Icon icon="help-circle" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert("Demo", "This would show help and FAQ information.")}
            />
          </Card.Content>
        </Card>

        {/* Sign In Card */}
        <Card style={styles.signInCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Get Started</Title>
            <Paragraph style={styles.signInDescription}>
              Sign in to save your profile, customize your diabetes management settings, and access personalized meal recommendations.
            </Paragraph>
            <Button mode="contained" onPress={() => router.push("/login")} style={styles.loginButton}>
              Sign In
            </Button>
            <Button mode="outlined" onPress={() => router.push("/signup")} style={styles.signupButton}>
              Create Account
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Paragraph style={styles.version}>ChefItUp v1.0.0</Paragraph>
        </View>
      </ScrollView>
    )
  }

  // If user is logged in, show full profile
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            style={styles.avatar}
          />
          <Title style={styles.userName}>{user.user_metadata?.full_name || "User"}</Title>
          <Paragraph style={styles.userEmail}>{user.email}</Paragraph>
          <Chip 
            icon="heart-pulse" 
            style={styles.diabetesChip}
            textStyle={{ color: theme.colors.primary }}
          >
            {getDiabetesTypeLabel(diabetesType)}
          </Chip>
        </Card.Content>
      </Card>

      {/* Diabetes Health Information */}
      <Card style={styles.healthCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Diabetes Health Profile</Title>
          
          {/* Diabetes Type */}
          <View style={styles.inputGroup}>
            <Paragraph style={styles.inputLabel}>Diabetes Type *</Paragraph>
            <Menu
              visible={showDiabetesMenu}
              onDismiss={() => setShowDiabetesMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowDiabetesMenu(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownContent}
                >
                  {getDiabetesTypeLabel(diabetesType)}
                </Button>
              }
            >
              {diabetesTypes.map((type) => (
                <Menu.Item
                  key={type.value}
                  onPress={() => {
                    setDiabetesType(type.value)
                    setShowDiabetesMenu(false)
                  }}
                  title={type.label}
                />
              ))}
            </Menu>
          </View>

          {/* Blood Sugar Target */}
          <View style={styles.inputGroup}>
            <Paragraph style={styles.inputLabel}>Target Blood Sugar (mg/dL)</Paragraph>
            <TextInput
              value={targetBloodSugar}
              onChangeText={setTargetBloodSugar}
              mode="outlined"
              keyboardType="numeric"
              placeholder="120"
              style={styles.input}
            />
          </View>

          {/* Insulin Sensitivity */}
          <View style={styles.inputGroup}>
            <Paragraph style={styles.inputLabel}>Insulin Sensitivity (mg/dL per unit)</Paragraph>
            <TextInput
              value={insulinSensitivity}
              onChangeText={setInsulinSensitivity}
              mode="outlined"
              keyboardType="numeric"
              placeholder="50"
              style={styles.input}
            />
          </View>

          {/* Carb Ratio */}
          <View style={styles.inputGroup}>
            <Paragraph style={styles.inputLabel}>Carb Ratio (grams per unit insulin)</Paragraph>
            <TextInput
              value={carbRatio}
              onChangeText={setCarbRatio}
              mode="outlined"
              keyboardType="numeric"
              placeholder="15"
              style={styles.input}
            />
          </View>

          {/* Medications */}
          <View style={styles.inputGroup}>
            <Paragraph style={styles.inputLabel}>Current Medications</Paragraph>
            <TextInput
              value={medications}
              onChangeText={setMedications}
              mode="outlined"
              placeholder="e.g., Metformin, Insulin"
              style={styles.input}
            />
          </View>

          {/* Allergies */}
          <View style={styles.inputGroup}>
            <Paragraph style={styles.inputLabel}>Food Allergies</Paragraph>
            <TextInput
              value={allergies}
              onChangeText={setAllergies}
              mode="outlined"
              placeholder="e.g., Peanuts, Gluten"
              style={styles.input}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Physical Information */}
      <Card style={styles.physicalCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Physical Information</Title>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Paragraph style={styles.inputLabel}>Weight (lbs)</Paragraph>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                mode="outlined"
                keyboardType="numeric"
                placeholder="150"
                style={styles.input}
              />
            </View>
            <View style={styles.halfInput}>
              <Paragraph style={styles.inputLabel}>Height (inches)</Paragraph>
              <TextInput
                value={height}
                onChangeText={setHeight}
                mode="outlined"
                keyboardType="numeric"
                placeholder="68"
                style={styles.input}
              />
            </View>
          </View>

          {/* Activity Level */}
          <View style={styles.inputGroup}>
            <Paragraph style={styles.inputLabel}>Activity Level</Paragraph>
            <Menu
              visible={showActivityMenu}
              onDismiss={() => setShowActivityMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowActivityMenu(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownContent}
                >
                  {getActivityLevelLabel(activityLevel)}
                </Button>
              }
            >
              {activityLevels.map((level) => (
                <Menu.Item
                  key={level.value}
                  onPress={() => {
                    setActivityLevel(level.value)
                    setShowActivityMenu(false)
                  }}
                  title={level.label}
                />
              ))}
            </Menu>
          </View>
        </Card.Content>
      </Card>

      {/* Dietary Preferences */}
      <Card style={styles.preferencesCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Dietary Preferences</Title>
          <List.Item
            title="Manage Dietary Restrictions"
            description="Set your food preferences and restrictions"
            left={() => <List.Icon icon="food-apple" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Dietary preferences screen would be implemented here")}
          />
          <Divider />
          <List.Item
            title="Favorite Recipes"
            description="View your saved and favorite recipes"
            left={() => <List.Icon icon="heart" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Favorites screen would be implemented here")}
          />
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Settings</Title>
          <List.Item
            title="Blood Sugar Reminders"
            description="Get notifications to check your blood sugar"
            left={() => <List.Icon icon="bell" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} />}
          />
          <Divider />
          <List.Item
            title="Meal Planning Reminders"
            description="Get notifications about meal planning"
            left={() => <List.Icon icon="calendar" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} />}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
          />
        </Card.Content>
      </Card>

      {/* Save Button */}
      <Card style={styles.saveCard}>
        <Card.Content>
          <Button mode="contained" onPress={saveProfile} style={styles.saveButton}>
            Save Profile Settings
          </Button>
        </Card.Content>
      </Card>

      {/* Support */}
      <Card style={styles.supportCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Support</Title>
          <List.Item
            title="Diabetes Management Tips"
            description="Get personalized tips for managing your diabetes"
            left={() => <List.Icon icon="lightbulb" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Diabetes tips would be implemented here")}
          />
          <Divider />
          <List.Item
            title="Contact Healthcare Provider"
            description="Get in touch with your healthcare team"
            left={() => <List.Icon icon="medical-bag" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Healthcare provider contact would be implemented here")}
          />
          <Divider />
          <List.Item
            title="Help & FAQ"
            description="Get help and find answers to common questions"
            left={() => <List.Icon icon="help-circle" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => Alert.alert("Info", "Help screen would be implemented here")}
          />
        </Card.Content>
      </Card>

      {/* Sign Out */}
      <Card style={styles.signOutCard}>
        <Card.Content>
          <Button mode="outlined" onPress={handleSignOut} style={styles.signOutButton} textColor="red">
            Sign Out
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Paragraph style={styles.version}>ChefItUp v1.0.0</Paragraph>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
  },
  profileContent: {
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: theme.colors.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  diabetesChip: {
    backgroundColor: theme.colors.primaryContainer,
    marginTop: 8,
  },
  healthCard: {
    margin: 16,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "gray",
  },
  input: {
    backgroundColor: "white",
  },
  dropdownButton: {
    backgroundColor: "white",
  },
  dropdownContent: {
    padding: 16,
  },
  physicalCard: {
    margin: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  preferencesCard: {
    margin: 16,
    marginBottom: 8,
  },
  settingsCard: {
    margin: 16,
    marginBottom: 8,
  },
  saveCard: {
    margin: 16,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  supportCard: {
    margin: 16,
    marginBottom: 8,
  },
  signOutCard: {
    margin: 16,
    marginBottom: 8,
  },
  signOutButton: {
    borderColor: "red",
  },
  footer: {
    alignItems: "center",
    padding: 16,
  },
  version: {
    fontSize: 12,
    color: "gray",
  },
  signInPrompt: {
    marginTop: 16,
    backgroundColor: theme.colors.primaryContainer,
  },
  signInPromptContent: {
    alignItems: "center",
    padding: 16,
  },
  signInPromptText: {
    textAlign: "center",
    marginBottom: 16,
    color: "gray",
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
  },
  signInCard: {
    margin: 16,
    marginBottom: 8,
  },
  signInDescription: {
    textAlign: "center",
    marginBottom: 16,
    color: "gray",
  },
  signupButton: {
    marginTop: 8,
  },
  demoText: {
    textAlign: "center",
    marginBottom: 16,
    color: "gray",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
}) 