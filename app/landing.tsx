import React, { useState, useRef } from "react"
import { View, ScrollView, StyleSheet, Dimensions, FlatList } from "react-native"
import { 
  Title, 
  Paragraph, 
  Button, 
  Card, 
  Chip,
  useTheme,
  Surface,
  IconButton,
  Menu,
  Divider
} from "react-native-paper"
import { router } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function LandingPage() {
  const theme = useTheme()
  const [menuVisible, setMenuVisible] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const cardsFlatListRef = useRef<FlatList>(null)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  const menuItems = [
    {
      title: "Browse Recipes",
      onPress: () => {
        closeMenu()
        router.push("/(tabs)")
      }
    },
    {
      title: "Generate Recipe",
      onPress: () => {
        closeMenu()
        router.push("/generate-recipe")
      }
    },
    {
      title: "Meal Planner",
      onPress: () => {
        closeMenu()
        router.push("/(tabs)/meal-planner")
      }
    },
    {
      title: "Shopping List",
      onPress: () => {
        closeMenu()
        router.push("/(tabs)/shopping-list")
      }
    },
    {
      title: "Profile",
      onPress: () => {
        closeMenu()
        router.push("/profile")
      }
    }
  ]

  const benefits = [
    "Lower blood sugar levels",
    "Reduce medication dependency",
    "Improve energy throughout the day",
    "Simplified meal prep routine",
    "Peace of mind with proper nutrition"
  ]

  const features = [
    {
      icon: "restaurant-menu",
      title: "Diabetes-Friendly Recipes",
      description: "Curated recipes with carb counts and glycemic index information",
      color: "#4CAF50"
    },
    {
      icon: "schedule",
      title: "Meal Planning Made Easy",
      description: "Plan your weekly meals with proper portion control and timing",
      color: "#2196F3"
    },
    {
      icon: "shopping-cart",
      title: "Smart Shopping Lists",
      description: "Auto-generated shopping lists based on your meal plans",
      color: "#FF9800"
    },
    {
      icon: "monitor-heart",
      title: "Blood Sugar Tracking",
      description: "Monitor how meals affect your glucose levels",
      color: "#E91E63"
    },
    {
      icon: "local-dining",
      title: "Nutritional Guidance",
      description: "Expert advice on managing diabetes through diet",
      color: "#9C27B0"
    },
    {
      icon: "people",
      title: "Community Support",
      description: "Connect with others managing diabetes",
      color: "#607D8B"
    }
  ]

  const allCards = [
    {
      type: "benefits",
      title: "Why Choose ChefItUp?",
      data: benefits,
      color: theme.colors.primary
    },
    ...features.map(feature => ({
      type: "feature",
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      color: feature.color
    }))
  ]

  const handleGetStarted = () => {
    router.push("/login")
  }

  const renderCard = ({ item, index }: { item: any; index: number }) => {
    if (item.type === "benefits") {
      return (
        <Card style={styles.swipeCard}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.cardTitle}>{item.title}</Title>
            <View style={styles.benefitsGrid}>
              {item.data.map((benefit: string, benefitIndex: number) => (
                <View key={benefitIndex} style={styles.benefitItem}>
                  <MaterialIcons 
                    name="check-circle" 
                    size={20} 
                    color={item.color} 
                  />
                  <Paragraph style={styles.benefitText}>{benefit}</Paragraph>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )
    } else {
      return (
        <Card style={styles.swipeCard}>
          <Card.Content style={styles.cardContent}>
            <View style={[styles.cardIconContainer, { backgroundColor: item.color + '20' }]}>
              <MaterialIcons 
                name={item.icon as any} 
                size={40} 
                color={item.color} 
                style={styles.cardIcon}
              />
            </View>
            <Title style={styles.cardTitle}>{item.title}</Title>
            <Paragraph style={styles.cardDescription}>
              {item.description}
            </Paragraph>
          </Card.Content>
        </Card>
      )
    }
  }

  const handleCardScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffset / (width - 80))
    setCurrentCardIndex(index)
  }

  const scrollToCard = (index: number) => {
    cardsFlatListRef.current?.scrollToIndex({
      index,
      animated: true
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Menu */}
        <View style={styles.heroSection}>
          {/* Menu Button */}
          <View style={styles.menuContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="menu"
                  iconColor="white"
                  size={24}
                  onPress={openMenu}
                />
              }
            >
              {menuItems.map((item, index) => (
                <Menu.Item
                  key={index}
                  onPress={item.onPress}
                  title={item.title}
                />
              ))}
              <Divider />
              <Menu.Item
                onPress={() => {
                  closeMenu()
                  router.push("/(tabs)")
                }}
                title="Get Started"
              />
            </Menu>
          </View>

          <View style={styles.heroContent}>
            <Title style={styles.heroTitle}>
              ChefItUp
            </Title>
            <Paragraph style={styles.heroSubtitle}>
              Your Personal Diabetes Meal Prep Assistant
            </Paragraph>
            <Paragraph style={styles.heroDescription}>
              Take control of your diabetes with smart meal planning, 
              diabetes-friendly recipes, and expert nutritional guidance.
            </Paragraph>
            
            <View style={styles.heroButtons}>
              <Button 
                mode="contained" 
                onPress={handleGetStarted}
                style={styles.primaryButton}
                contentStyle={styles.buttonContent}
              >
                Get Started Free
              </Button>
            </View>
          </View>
        </View>

        {/* Swipeable Cards Section */}
        <View style={styles.cardsSection}>
          <FlatList
            ref={cardsFlatListRef}
            data={allCards}
            renderItem={renderCard}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={width - 80}
            decelerationRate="fast"
            onScroll={handleCardScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.cardsList}
            style={styles.cardsFlatList}
            getItemLayout={(data, index) => ({
              length: width - 80,
              offset: (width - 80) * index,
              index,
            })}
          />

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {allCards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: index === currentCardIndex 
                      ? theme.colors.primary 
                      : '#E0E0E0',
                    width: index === currentCardIndex ? 20 : 8,
                  }
                ]}
                onTouchEnd={() => scrollToCard(index)}
              />
            ))}
          </View>
        </View>

        {/* Testimonial */}
        <Card style={styles.testimonialCard}>
          <Card.Content>
            <MaterialIcons 
              name="format-quote" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.quoteIcon}
            />
            <Paragraph style={styles.testimonialText}>
              "ChefItUp has completely changed how I manage my diabetes. 
              The meal planning is so easy, and my blood sugar has never been more stable!"
            </Paragraph>
            <Paragraph style={styles.testimonialAuthor}>
              - Sarah M., Type 2 Diabetes
            </Paragraph>
          </Card.Content>
        </Card>

        {/* CTA Section */}
        <Surface style={styles.ctaSection} elevation={2}>
          <Title style={styles.ctaTitle}>Ready to Transform Your Diabetes Management?</Title>
          <Paragraph style={styles.ctaDescription}>
            Join thousands of diabetics who have taken control of their health with ChefItUp
          </Paragraph>
          <Button 
            mode="contained" 
            onPress={handleGetStarted}
            style={styles.ctaButton}
            contentStyle={styles.buttonContent}
          >
            Start Your Free Trial
          </Button>
          <Paragraph style={styles.ctaNote}>
            No credit card required • Cancel anytime
          </Paragraph>
        </Surface>

        {/* Footer */}
        <View style={styles.footer}>
          <Paragraph style={styles.footerText}>
            © 2024 ChefItUp. Made with ❤️ for the diabetes community.
          </Paragraph>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    minHeight: 300,
    backgroundColor: "#4CAF50",
  },
  menuContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  heroContent: {
    alignItems: "center",
    textAlign: "center",
    marginTop: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 15,
    textAlign: "center",
    opacity: 0.9,
  },
  heroDescription: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
    lineHeight: 24,
  },
  heroButtons: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryButton: {
    borderRadius: 25,
  },
  secondaryButton: {
    borderRadius: 25,
    borderColor: "white",
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  cardsSection: {
    padding: 10,
    alignItems: "center",
  },
  cardsList: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  cardsFlatList: {
    width: "100%",
  },
  swipeCard: {
    width: width - 80,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    alignItems: "center",
    padding: 15,
    minHeight: 200,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  cardIcon: {
    marginTop: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  testimonialCard: {
    margin: 20,
    borderRadius: 15,
    backgroundColor: "#f8f9fa",
  },
  quoteIcon: {
    marginBottom: 10,
  },
  testimonialText: {
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: 15,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  ctaSection: {
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    opacity: 0.8,
  },
  ctaButton: {
    borderRadius: 25,
    marginBottom: 15,
  },
  ctaNote: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
}) 