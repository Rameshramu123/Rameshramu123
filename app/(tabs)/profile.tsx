import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

interface Trophy {
  name: string;
  emoji: string;
  unlocked: boolean;
}

interface Stats {
  leavesAnalyzed: number;
  cropsSuggested: number;
  diseasesDetected: number;
}

const farmerNames = ["Ramesh", "Suresh", "Vikram", "Manju", "Anitha", "Kiran"];

export default function Profile(): JSX.Element {
  const [userName, setUserName] = useState<string>(
    farmerNames[Math.floor(Math.random() * farmerNames.length)]
  );
  const [totalCrops, setTotalCrops] = useState<number>(0);
  const [totalDiseases, setTotalDiseases] = useState<number>(0);
  const [favoriteCrop, setFavoriteCrop] = useState<{ name: string; count: number }>({
    name: "None",
    count: 0,
  });
  const [streak, setStreak] = useState<number>(0);
  const [stats, setStats] = useState<Stats>({ leavesAnalyzed: 0, cropsSuggested: 0, diseasesDetected: 0 });
  const [trophies, setTrophies] = useState<Trophy[]>([
    { name: "First Crop", emoji: "🏅", unlocked: false },
    { name: "First Disease", emoji: "🏆", unlocked: false },
    { name: "10 Crops", emoji: "🥉", unlocked: false },
    { name: "50 Crops", emoji: "🥈", unlocked: false },
    { name: "100 Crops", emoji: "🥇", unlocked: false },
  ]);
  const [badge, setBadge] = useState<string>("Beginner 🌱");

  useEffect(() => {
    const loadData = async () => {
      try {
        const crops = (await AsyncStorage.getItem("totalCrops")) || "0";
        const diseases = (await AsyncStorage.getItem("totalDiseases")) || "0";
        const favCropName = (await AsyncStorage.getItem("favoriteCropName")) || "None";
        const favCropCount = parseInt((await AsyncStorage.getItem("favoriteCropCount")) || "0");

        setTotalCrops(parseInt(crops));
        setTotalDiseases(parseInt(diseases));
        setFavoriteCrop({ name: favCropName, count: favCropCount });

        // Default streak to 0
        setStreak(0);

        // Default badge to Beginner
        setBadge("Beginner 🌱");

        // Default stats
        setStats({ leavesAnalyzed: 0, cropsSuggested: 0, diseasesDetected: 0 });

        // Default trophies locked
        setTrophies(prev => prev.map(t => ({ ...t, unlocked: false })));
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // --- Extra Static/Fake Features ---
  const dailyGoal = { made: 0, target: 0 };
  const topCrops = [
    { name: "None", emoji: "🌱", count: 0 },
    { name: "None", emoji: "🌱", count: 0 },
    { name: "None", emoji: "🌱", count: 0 },
  ];
  const farmerTip = "No tips yet. Start predicting!";
  const starLevel = { stars: 0, total: 5 };
  const weeklySummary = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

  return (
    <LinearGradient colors={["#e8f5e9", "#ffffff"]} style={styles.container}>
      <LinearGradient colors={["#43a047", "#2e7d32"]} style={styles.header}>
        <Text style={styles.headerTitle}>👨‍🌾 {userName}</Text>
        <Text style={styles.headerSubtitle}>Your Farmer Profile</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Streak */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Total Streak: {streak} day(s)</Text>
          <Text style={styles.cardSubtitle}>{Array(streak).fill("🔥").join(" ")}</Text>
        </View>

        {/* Favorite Crop */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌾 Favorite Crop</Text>
          <Text style={styles.cardSubtitle}>
            {favoriteCrop.name} ({favoriteCrop.count} times)
          </Text>
        </View>

        {/* Badge */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏅 Badge</Text>
          <Text style={styles.cardSubtitle}>{badge}</Text>
        </View>

        {/* Fun Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Stats</Text>
          <Text style={styles.cardSubtitle}>🍃 Leaves Analyzed: {stats.leavesAnalyzed}</Text>
          <Text style={styles.cardSubtitle}>🌽 Crops Suggested: {stats.cropsSuggested}</Text>
          <Text style={styles.cardSubtitle}>🦠 Diseases Detected: {stats.diseasesDetected}</Text>
        </View>

        {/* Trophies */}
        <Text style={[styles.cardTitle, { marginTop: 20 }]}>🏆 Achievements</Text>
        <FlatList
          horizontal
          data={trophies}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <LinearGradient
              colors={item.unlocked ? ["#ffd700", "#ffa500"] : ["#ccc", "#999"]}
              style={styles.trophyCard}
            >
              <Text style={styles.trophyEmoji}>{item.emoji}</Text>
              <Text style={styles.trophyName}>{item.name}</Text>
              <Text style={styles.trophyStatus}>{item.unlocked ? "Unlocked" : "Locked"}</Text>
            </LinearGradient>
          )}
          showsHorizontalScrollIndicator={false}
        />

        {/* --- Extra Features --- */}

        {/* Daily Prediction Goal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Today's Goal</Text>
          <Text style={styles.cardSubtitle}>
            Predictions made: {dailyGoal.made} / {dailyGoal.target}
          </Text>
          <Text style={styles.cardSubtitle}>
            {Array(dailyGoal.made).fill("✅").join("")}{Array(dailyGoal.target - dailyGoal.made).fill("❌").join("")}
          </Text>
        </View>

        {/* Top 3 Predicted Crops */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌾 Top 3 Crops</Text>
          {topCrops.map((c, idx) => (
            <Text key={idx} style={styles.cardSubtitle}>
              {c.emoji} {c.name} - {c.count} times
            </Text>
          ))}
        </View>

        {/* Farmer Tip */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 Farmer Tip</Text>
          <Text style={styles.cardSubtitle}>{farmerTip}</Text>
        </View>

        {/* Star Level */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⭐ Prediction Level</Text>
          <Text style={styles.cardSubtitle}>
            {Array(starLevel.stars).fill("⭐").join("")}{Array(starLevel.total - starLevel.stars).fill("☆").join("")}
          </Text>
          <Text style={styles.cardSubtitle}>Progress: {Math.round((starLevel.stars/starLevel.total)*100)}%</Text>
        </View>

        {/* Weekly Prediction Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Weekly Summary</Text>
          <Text style={styles.cardSubtitle}>
            Mon: {weeklySummary[0]} | Tue: {weeklySummary[1]} | Wed: {weeklySummary[2]} | Thu: {weeklySummary[3]} | Fri: {weeklySummary[4]} | Sat: {weeklySummary[5]} | Sun: {weeklySummary[6]}
          </Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 16, color: "#e8f5e9", marginTop: 4 },
  content: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#2e7d32" },
  cardSubtitle: { fontSize: 14, color: "#333", marginTop: 4 },
  trophyCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  trophyEmoji: { fontSize: 36 },
  trophyName: { fontSize: 14, fontWeight: "600", marginTop: 5, textAlign: "center" },
  trophyStatus: { fontSize: 12, marginTop: 3, color: "#333" },
});
