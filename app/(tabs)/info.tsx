import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Crop {
  name: string;
  emoji: string;
  summary: string;
}

interface Disease {
  name: string;
  summary: string;
}

const crops: Crop[] = [
  { name: "apple", emoji: "🍎", summary: "Apples are rich in fiber and vitamin C. Keep soil moist and use drip irrigation. Protect from pests like aphids." },
  { name: "banana", emoji: "🍌", summary: "Bananas grow well in warm climates. Fertilize regularly and water consistently. Watch for nematodes." },
  { name: "blackgram", emoji: "🌱", summary: "Blackgram fixes nitrogen in soil. Requires minimal irrigation and well-drained soil. Harvest when pods turn brown." },
  { name: "chickpea", emoji: "🌿", summary: "Chickpeas prefer cool growing season. Ensure proper spacing and control pod borers." },
  { name: "coconut", emoji: "🥥", summary: "Coconuts require tropical conditions. Provide plenty of sunlight and well-drained soil. Fertilize thrice a year." },
  { name: "coffee", emoji: "☕", summary: "Coffee grows under partial shade. Maintain soil moisture and prune regularly. Watch for leaf rust." },
  { name: "cotton", emoji: "🌾", summary: "Cotton grows best in black soil. Apply fertilizers carefully and manage pests like bollworm." },
  { name: "grapes", emoji: "🍇", summary: "Grapes need sunny weather and good drainage. Train vines and control powdery mildew." },
  { name: "jute", emoji: "🌿", summary: "Jute requires warm and humid climate. Plant in well-drained alluvial soil and harvest after 120 days." },
  { name: "kidneybeans", emoji: "🫘", summary: "Beans need well-drained soil. Provide support for climbing varieties. Control aphids and leaf miners." },
  { name: "lentil", emoji: "🫘", summary: "Lentils grow best in cool, semi-arid climates. Rotate crops to prevent disease." },
  { name: "maize", emoji: "🌽", summary: "Maize needs full sun and fertile soil. Water evenly and control stem borers." },
  { name: "mango", emoji: "🥭", summary: "Mangoes require tropical/subtropical climate. Fertilize seasonally and protect from fruit flies." },
  { name: "mothbeans", emoji: "🫘", summary: "Mothbeans are drought-resistant. Plant in sandy soil and manage pod borers." },
  { name: "mungbean", emoji: "🫘", summary: "Mungbean fixes nitrogen. Requires moderate water and well-drained soil." },
  { name: "muskmelon", emoji: "🍈", summary: "Muskmelon grows in warm weather. Provide trellis support and water regularly." },
  { name: "orange", emoji: "🍊", summary: "Oranges need sunny climate and well-drained soil. Fertilize regularly and manage citrus greening." },
  { name: "papaya", emoji: "🥭", summary: "Papaya grows fast in tropical areas. Protect from wind and water consistently." },
  { name: "pigeonpeas", emoji: "🫘", summary: "Pigeonpeas fix nitrogen. Plant in well-drained soil and control pod borers." },
  { name: "pomegranate", emoji: "🍎", summary: "Pomegranates grow in arid areas. Prune regularly and control fruit flies." },
  { name: "rice", emoji: "🍚", summary: "Rice requires standing water in paddy fields. Maintain water levels and control stem borers." },
  { name: "watermelon", emoji: "🍉", summary: "Watermelon grows in warm soil. Provide plenty of sunlight and consistent watering." },
];

const diseases: Disease[] = [
  { name: "Apple__Apple_scab", summary: "Symptoms: Dark, scabby spots on leaves and fruit. Prevention: Remove infected leaves, use resistant varieties. Treatment: Fungicide sprays." },
  { name: "Apple_Black_rot", summary: "Symptoms: Black spots on fruits and leaves. Prevention: Prune infected branches. Treatment: Apply fungicides regularly." },
  { name: "Apple_Cedar_apple_rust", summary: "Symptoms: Yellow-orange spots on leaves. Prevention: Remove nearby cedar trees. Treatment: Fungicide applications." },
  { name: "Apple__healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Blueberry___healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Cherry_(including_sour)Powdery_mildew", summary: "Symptoms: White powdery coating on leaves and stems. Prevention: Proper spacing and air circulation. Treatment: Sulfur-based sprays." },
  { name: "Cherry(including_sour)_healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Corn_(maize)Cercospora_leaf_spot Gray_leaf_spot", summary: "Symptoms: Grayish spots on leaves. Prevention: Crop rotation. Treatment: Fungicide sprays." },
  { name: "Corn(maize)Common_rust", summary: "Symptoms: Orange-red pustules on leaves. Prevention: Resistant varieties. Treatment: Fungicides." },
  { name: "Corn_(maize)Northern_Leaf_Blight", summary: "Symptoms: Large gray-green lesions on leaves. Prevention: Crop rotation and resistant varieties. Treatment: Fungicides." },
  { name: "Corn(maize)_healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Grape__Black_rot", summary: "Symptoms: Black spots on leaves and fruits. Prevention: Prune and destroy infected tissue. Treatment: Fungicides." },
  { name: "Grape_Esca(Black_Measles)", summary: "Symptoms: Brown or black streaks on wood. Prevention: Remove infected wood. Treatment: Fungicide treatments." },
  { name: "Grape__Leaf_blight(Isariopsis_Leaf_Spot)", summary: "Symptoms: Spots on leaves that expand and merge. Prevention: Proper spacing and pruning. Treatment: Fungicides." },
  { name: "Grape___healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Orange__Haunglongbing(Citrus_greening)", summary: "Symptoms: Yellow shoots, misshapen fruits. Prevention: Use disease-free seedlings. Treatment: Remove infected plants." },
  { name: "Peach__Bacterial_spot", summary: "Symptoms: Dark, water-soaked spots on leaves and fruits. Prevention: Copper sprays. Treatment: Apply recommended bactericides." },
  { name: "Peach__healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Pepper,bell_Bacterial_spot", summary: "Symptoms: Water-soaked spots on leaves and fruits. Prevention: Copper sprays. Treatment: Bactericides." },
  { name: "Pepper,_bell__healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Potato__Early_blight", summary: "Symptoms: Brown lesions on leaves and stems. Prevention: Rotate crops. Treatment: Fungicide sprays." },
  { name: "Potato_Late_blight", summary: "Symptoms: Dark lesions on leaves and tubers. Prevention: Resistant varieties. Treatment: Fungicides immediately." },
  { name: "Potato__healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Raspberry___healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Soybean___healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Squash___Powdery_mildew", summary: "Symptoms: White powdery coating on leaves. Prevention: Proper spacing and air circulation. Treatment: Fungicides." },
  { name: "Strawberry__Leaf_scorch", summary: "Symptoms: Brown edges on leaves. Prevention: Avoid overhead watering. Treatment: Fungicides." },
  { name: "Strawberry__healthy", summary: "No disease detected. Plant is healthy." },
  { name: "Tomato__Bacterial_spot", summary: "Symptoms: Small brown spots on leaves. Prevention: Copper sprays. Treatment: Bactericides." },
  { name: "Tomato_Early_blight", summary: "Symptoms: Dark lesions on lower leaves. Prevention: Crop rotation. Treatment: Fungicide sprays." },
  { name: "Tomato__Late_blight", summary: "Symptoms: Water-soaked lesions on leaves. Prevention: Resistant varieties. Treatment: Fungicides." },
  { name: "Tomato__Leaf_Mold", summary: "Symptoms: Yellow spots turning brown. Prevention: Good air circulation. Treatment: Fungicides." },
  { name: "Tomato__Septoria_leaf_spot", summary: "Symptoms: Small circular spots on leaves. Prevention: Avoid wet foliage. Treatment: Fungicides." },
  { name: "Tomato__Spider_mites Two-spotted_spider_mite", summary: "Symptoms: Yellow speckling on leaves. Prevention: Regular monitoring. Treatment: Miticides." },
  { name: "Tomato__Target_Spot", summary: "Symptoms: Dark brown target-shaped spots. Prevention: Crop rotation. Treatment: Fungicides." },
  { name: "Tomato__Tomato_Yellow_Leaf_Curl_Virus", summary: "Symptoms: Yellow curling leaves. Prevention: Control whiteflies. Treatment: Remove infected plants." },
  { name: "Tomato_Tomato_mosaic_virus", summary: "Symptoms: Mottled leaves. Prevention: Use virus-free seeds. Treatment: Remove infected plants." },
  { name: "Tomato__healthy", summary: "No disease detected. Plant is healthy." },
];

export default function Info(): JSX.Element {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"Crops" | "Diseases">("Crops");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleExpand = (item: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItem(expandedItem === item ? null : item);
  };

  const toggleFavorite = (item: string) => {
    if (favorites.includes(item)) {
      setFavorites(favorites.filter(f => f !== item));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  const filteredCrops = crops.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDiseases = diseases.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = (item: any, isDisease = false) => (
    <TouchableOpacity
      key={item.name || item}
      style={styles.itemCard}
      onPress={() => handleExpand(item.name || item)}
    >
      <View style={styles.itemHeader}>
        {isDisease ? (
          <Text style={styles.itemText}>{item.name}</Text>
        ) : (
          <Text style={styles.itemText}>{item.emoji} {item.name}</Text>
        )}
        <TouchableOpacity onPress={() => toggleFavorite(item.name || item)}>
          <MaterialCommunityIcons
            name={favorites.includes(item.name || item) ? "heart" : "heart-outline"}
            size={20}
            color="#e91e63"
          />
        </TouchableOpacity>
      </View>
      {expandedItem === (item.name || item) && (
        <Text style={styles.itemInfo}>
          {item.summary}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#e8f5e9", "#ffffff"]} style={styles.container}>
      <LinearGradient colors={["#43a047", "#2e7d32"]} style={styles.header}>
        <Text style={styles.headerTitle}>📋 App Predictions Info</Text>
        <Text style={styles.headerSubtitle}>Crops & Diseases Currently Supported</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Crops" && styles.activeTab]}
          onPress={() => setActiveTab("Crops")}
        >
          <Text style={[styles.tabText, activeTab === "Crops" && styles.activeTabText]}>Crops</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Diseases" && styles.activeTab]}
          onPress={() => setActiveTab("Diseases")}
        >
          <Text style={[styles.tabText, activeTab === "Diseases" && styles.activeTabText]}>Diseases</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder={`Search ${activeTab}...`}
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "Crops" ? (
          filteredCrops.length > 0 ? (
            <FlatList
              data={filteredCrops}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => renderItem(item)}
            />
          ) : (
            <View style={styles.noResult}>
              <MaterialCommunityIcons name="leaf-off" size={50} color="#a5d6a7" />
              <Text style={styles.noResultText}>
                Sorry! This crop is not available yet. 🌱
              </Text>
              <Text style={styles.noResultSubText}>
                We are continuously updating our database. Stay tuned!
              </Text>
            </View>
          )
        ) : filteredDiseases.length > 0 ? (
          <FlatList
            data={filteredDiseases}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => renderItem(item, true)}
          />
        ) : (
          <View style={styles.noResult}>
            <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#a5d6a7" />
            <Text style={styles.noResultText}>
              Oops! This disease is not listed yet. 🩺
            </Text>
            <Text style={styles.noResultSubText}>
              We are working to include more diseases soon.
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#e8f5e9", marginTop: 4 },
  tabContainer: { flexDirection: "row", marginTop: 15, marginHorizontal: 20, borderRadius: 10, overflow: "hidden" },
  tabButton: { flex: 1, paddingVertical: 10, backgroundColor: "#c8e6c9", alignItems: "center" },
  activeTab: { backgroundColor: "#4CAF50" },
  tabText: { color: "#2e7d32", fontWeight: "bold" },
  activeTabText: { color: "#fff" },
  searchInput: {
    margin: 15,
    borderWidth: 1,
    borderColor: "#a5d6a7",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  itemCard: {
    backgroundColor: "#e6ffe6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  noResult: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noResultText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
  },
  noResultSubText: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemText: { fontSize: 16, fontWeight: "bold", color: "#1B5E20" },
  itemInfo: { marginTop: 8, fontSize: 14, color: "#555" },
});
