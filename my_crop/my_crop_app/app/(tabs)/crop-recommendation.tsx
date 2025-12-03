import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";

const API_BASE_URL = "http://192.168.158.244:5000";

interface CropPrediction {
  crop: string;
  confidence: number;
  info: string;
}

export default function CropRecommendation() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [city, setCity] = useState("");
  const [predictions, setPredictions] = useState<CropPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 12.9716, // Default - Bengaluru
    longitude: 77.5946,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion((prev) => ({ ...prev, latitude, longitude }));
      setMarker({ latitude, longitude });
      setLat(latitude.toString());
      setLon(longitude.toString());
      handlePredict(latitude, longitude);
    })();
  }, []);

  const fetchLatLonFromCity = async (cityName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/geocode-city`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityName }),
      });

      const data = await res.json();

      if (data.latitude && data.longitude) {
        setLat(String(data.latitude));
        setLon(String(data.longitude));
        setRegion((prev) => ({
          ...prev,
          latitude: data.latitude,
          longitude: data.longitude,
        }));
        setMarker({ latitude: data.latitude, longitude: data.longitude });
        return { lat: data.latitude, lon: data.longitude };
      } else {
        alert("City not found");
        return null;
      }
    } catch (err) {
      console.error(err);
      alert("Backend error fetching city location");
      return null;
    }
  };

  const handlePredict = async (latitude?: number, longitude?: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict-crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: latitude || parseFloat(lat),
          longitude: longitude || parseFloat(lon),
        }),
      });

      const data = await response.json();
      const predictedCrops: CropPrediction[] = data.predictions || [];
      setPredictions(predictedCrops);

      const prevTotal = parseInt((await AsyncStorage.getItem("totalCrops")) || "0");
      await AsyncStorage.setItem("totalCrops", (prevTotal + predictedCrops.length).toString());

      let favName = (await AsyncStorage.getItem("favoriteCropName")) || "Rice";
      let favCount = parseInt((await AsyncStorage.getItem("favoriteCropCount")) || "0");

      predictedCrops.forEach((pred) => {
        if (pred.crop === favName) favCount++;
      });

      await AsyncStorage.setItem("favoriteCropName", favName);
      await AsyncStorage.setItem("favoriteCropCount", favCount.toString());
    } catch (err) {
      console.error(err);
      setPredictions([]);
    }
    setLoading(false);
  };

  const handleCitySearch = async () => {
    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }
    const coords = await fetchLatLonFromCity(city);
    if (coords) handlePredict(coords.lat, coords.lon);
  };

  return (
    <LinearGradient colors={["#e8f5e9", "#ffffff"]} style={styles.container}>
      <LinearGradient colors={["#43a047", "#2e7d32"]} style={styles.header}>
        <Text style={styles.headerTitle}>🌱👨‍🌾 ಕೃಷಿಮಿತ್ರ</Text>
        <Text style={styles.headerTitle}>Smart Crop Recommender</Text>
        <Text style={styles.headerSubtitle}>
          Enter or pick your farm’s location to get AI-powered crop suggestions
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* City Search Section */}
        <TextInput
          style={styles.input}
          placeholder="🏙️ Enter City Name"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={handleCitySearch}>
          <LinearGradient colors={["#66bb6a", "#388e3c"]} style={styles.buttonBg}>
            <Text style={styles.buttonText}>📍 Fetch City Location</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Map Picker Section */}
        <Text style={styles.mapTitle}>🗺️ Choose Location on Map</Text>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={(rgn) => setRegion(rgn)}
          onPress={(e) => setMarker(e.nativeEvent.coordinate)}
        >
          {marker && (
            <Marker
              draggable
              coordinate={marker}
              onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
              title="Your Farm Location"
              description="Drag or tap anywhere to set location"
            />
          )}
        </MapView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (marker) {
              setLat(marker.latitude.toString());
              setLon(marker.longitude.toString());
              alert(`📍 Location Set:\nLat: ${marker.latitude}\nLon: ${marker.longitude}`);
            } else {
              alert("Tap on map to choose location first!");
            }
          }}
        >
          <LinearGradient colors={["#66bb6a", "#388e3c"]} style={styles.buttonBg}>
            <Text style={styles.buttonText}>✅ Use This Location</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Manual Inputs (Optional) */}
        <TextInput
          style={styles.input}
          placeholder="📍 Enter Latitude"
          keyboardType="numeric"
          value={lat}
          onChangeText={setLat}
        />
        <TextInput
          style={styles.input}
          placeholder="📍 Enter Longitude"
          keyboardType="numeric"
          value={lon}
          onChangeText={setLon}
        />

        {/* Predict Button */}
        <TouchableOpacity style={styles.button} onPress={() => handlePredict()}>
          <LinearGradient colors={["#66bb6a", "#388e3c"]} style={styles.buttonBg}>
            <Text style={styles.buttonText}>🚀 Predict Crops</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={styles.loadingText}>Analyzing your location…</Text>
          </View>
        )}

        {/* Crop Predictions */}
        {predictions.length > 0 && (
          <View style={styles.cardsContainer}>
            {predictions.map((item, idx) => (
              <LinearGradient key={idx} colors={["#ffffff", "#f1f8e9"]} style={styles.card}>
                <MaterialCommunityIcons name="sprout" size={30} color="#2e7d32" style={styles.cardIcon} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    {item.crop.charAt(0).toUpperCase() + item.crop.slice(1)} ({item.confidence.toFixed(2)}%)
                  </Text>
                  <Text style={styles.cardDesc}>🌾 Recommended crop #{idx + 1}</Text>
                  <Text style={styles.cardInfo}>{item.info}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        )}

        <Text style={styles.footerEmoji}>🌾</Text>
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
  headerSubtitle: { fontSize: 14, color: "#e8f5e9", marginTop: 8 },
  content: { padding: 20, alignItems: "center" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    width: "100%",
    fontSize: 16,
    elevation: 2,
  },
  button: { width: "100%", borderRadius: 12, overflow: "hidden", marginTop: 5 },
  buttonBg: { paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loadingBox: { marginTop: 25, alignItems: "center" },
  loadingText: { marginTop: 10, fontStyle: "italic", color: "#555" },
  cardsContainer: { marginTop: 30, width: "100%" },
  card: {
    flexDirection: "row",
    padding: 18,
    marginBottom: 18,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
  },
  cardIcon: { marginRight: 15, marginTop: 5 },
  cardContent: { flexShrink: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1b5e20" },
  cardDesc: { fontSize: 14, color: "#555", marginTop: 4 },
  cardInfo: { fontSize: 13, marginTop: 10, lineHeight: 20 },
  footerEmoji: { fontSize: 40, marginTop: 20, textAlign: "center" },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});
