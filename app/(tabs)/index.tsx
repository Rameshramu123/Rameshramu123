import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textFade, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#f0fff4", "#ffffff"]} style={styles.container}>
      <View style={styles.content}>
        <Animated.Image
          source={{ uri: "https://res.cloudinary.com/dtnxgpkxv/image/upload/v1757510213/icon_xdihew.jpg" }}
          style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        />

        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          🌱👨‍🌾 ಕೃಷಿಮಿತ್ರ
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
          AI-driven Smart Crop Recommender
        </Animated.Text>

        <Animated.View style={[styles.paragraphContainer, { opacity: textFade, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.infoBox}>
            <Text style={styles.paragraph}>
              Crop Recommendation: Our advanced AI suggests the best crops suited to your soil type, climate, and market demand, helping you make data-driven decisions that boost your farm’s productivity and profitability.
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.paragraphContainer, { opacity: textFade, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.infoBox}>
            <Text style={styles.paragraph}>
              Disease Detection: Get early alerts and treatment advice for crop diseases using real-time analysis, image-based recognition, and expert recommendations. Protect your crops, reduce losses, and ensure a healthy harvest.
            </Text>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#2e7d32",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#388e3c",
    marginTop: 8,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  paragraphContainer: {
    width: width * 0.9,
    marginVertical: 10,
  },
  infoBox: {
    backgroundColor: "#d0f0c0",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "bold",
  },
});
