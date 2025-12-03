import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PredictionResult {
  class: string;
  confidence: number;
}

interface DiseaseInfo {
  info: string;
  wiki_url: string;
  suggestions: { medicine: string; usage: string; shop: string }[];
}

const API_BASE_URL = "http://192.168.158.244:5000";

export default function DiseaseDetection(): JSX.Element {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>({ class: "Unknown", confidence: 0 });
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>({
    info: "No info available",
    wiki_url: "",
    suggestions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  const pickImage = async (): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "You need to allow gallery access!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const openCamera = async (): Promise<void> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "You need to allow camera access!");
      return;
    }
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string): Promise<void> => {
    try {
      setLoading(true);
      setResult({ class: "Unknown", confidence: 0 });
      setDiseaseInfo({ info: "No info available", wiki_url: "", suggestions: [] });

      const formData = new FormData();
      formData.append("file", { uri, type: "image/jpeg", name: "photo.jpg" } as any);

      const response = await fetch(`${API_BASE_URL}/predict-disease`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.json();

      if ("error" in data) {
        Alert.alert("Error", data.error);
        return;
      }

      setResult({ class: data.class, confidence: data.confidence });

      if (data.class !== "Unknown") {
        setDiseaseInfo({
          info: data.info || "No info available",
          wiki_url: data.wiki_url || "",
          suggestions: data.suggestions || [],
        });
        await incrementDiseaseStats();
      }

    } catch (error: any) {
      Alert.alert("Error", "Failed to analyze disease. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Increment totalDiseases and totalCrops in AsyncStorage
  const incrementDiseaseStats = async () => {
    try {
      const prevDiseases = parseInt((await AsyncStorage.getItem("totalDiseases")) || "0");
      await AsyncStorage.setItem("totalDiseases", (prevDiseases + 1).toString());

      const prevTotalCrops = parseInt((await AsyncStorage.getItem("totalCrops")) || "0");
      await AsyncStorage.setItem("totalCrops", (prevTotalCrops + 1).toString());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LinearGradient colors={["#e8f5e9", "#ffffff"]} style={styles.container}>
      <LinearGradient colors={["#43a047", "#2e7d32"]} style={styles.header}>
        <Text style={styles.headerTitle}>🌱👨‍🌾 ಕೃಷಿಮಿತ್ರ</Text>
        <Text style={styles.headerTitle}>Plant Disease Detection</Text>
        <Text style={styles.headerSubtitle}>
          Upload or capture a leaf photo to detect plant diseases
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <LinearGradient colors={["#4CAF50", "#2e7d32"]} style={styles.buttonBg}>
            <Text style={styles.buttonText}>Upload from Gallery</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <LinearGradient colors={["#4CAF50", "#2e7d32"]} style={styles.buttonBg}>
            <Text style={styles.buttonText}>Capture from Camera</Text>
          </LinearGradient>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.image} />}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Analyzing disease...</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Disease: {result.class}</Text>
            <Text style={styles.resultText}>
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </Text>
          </View>
        )}

        {diseaseInfo && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>📝 Information:</Text>
            <Text style={styles.infoText}>{diseaseInfo.info}</Text>
            {diseaseInfo.wiki_url ? (
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL(diseaseInfo.wiki_url)}
              >
                🔗 Read more on Wikipedia
              </Text>
            ) : null}

            {diseaseInfo.suggestions.length > 0 && (
              <>
                <Text style={styles.infoTitle}>💊 Recommended Medicines & Shops:</Text>
                {diseaseInfo.suggestions.map((s, idx) => (
                  <View key={idx} style={styles.suggestionCard}>
                    <Text style={styles.suggestionText}>💊 {s.medicine}</Text>
                    <Text style={styles.suggestionUsage}>{s.usage}</Text>
                    <Text style={styles.suggestionShop}>{s.shop}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}
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
  button: { width: "100%", borderRadius: 12, overflow: "hidden", marginTop: 10 },
  buttonBg: { paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  image: {
    width: 250,
    height: 250,
    marginVertical: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  loadingBox: { marginTop: 25, alignItems: "center" },
  loadingText: { marginTop: 10, fontStyle: "italic", color: "#555" },
  resultContainer: {
    backgroundColor: "#e6ffe6",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  resultText: { fontSize: 18, fontWeight: "600", color: "#1B5E20", marginVertical: 5 },
  infoContainer: {
    marginTop: 20,
    backgroundColor: "#f1f8e9",
    padding: 15,
    borderRadius: 12,
    width: "100%",
  },
  infoTitle: { fontSize: 16, fontWeight: "bold", color: "#2e7d32", marginTop: 10 },
  infoText: { fontSize: 14, color: "#333", marginTop: 5, lineHeight: 20 },
  linkText: { color: "#1B5E20", marginTop: 5, textDecorationLine: "underline" },
  suggestionCard: {
    backgroundColor: "#e6ffe6",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  suggestionText: { fontWeight: "bold", color: "#2e7d32" },
  suggestionUsage: { color: "#555", marginTop: 2 },
  suggestionShop: { color: "#555", marginTop: 2 },
});
