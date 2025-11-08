import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Default Market Data (with kg, 100kg, quintal)
const marketData = [
  {
    name: "Rice",
    pricePerKg: "₹ 21 / kg",
    pricePer100Kg: "₹ 2,100 / 100kg",
    pricePerQuintal: "₹ 2,100 / Quintal",
    info: "Staple food, high demand across India, especially South.",
  },
  {
    name: "Wheat",
    pricePerKg: "₹ 22 / kg",
    pricePer100Kg: "₹ 2,200 / 100kg",
    pricePerQuintal: "₹ 2,200 / Quintal",
    info: "Major cereal crop, stable demand with export potential.",
  },
  {
    name: "Maize",
    pricePerKg: "₹ 18 / kg",
    pricePer100Kg: "₹ 1,800 / 100kg",
    pricePerQuintal: "₹ 1,800 / Quintal",
    info: "Used in cattle, poultry feed, and starch industry.",
  },
  {
    name: "Potato",
    pricePerKg: "₹ 12 / kg",
    pricePer100Kg: "₹ 1,200 / 100kg",
    pricePerQuintal: "₹ 1,200 / Quintal",
    info: "Staple vegetable, prices remain stable year-round.",
  },
  {
    name: "Tomato",
    pricePerKg: "₹ 15 / kg",
    pricePer100Kg: "₹ 1,500 / 100kg",
    pricePerQuintal: "₹ 1,500 / Quintal",
    info: "Highly seasonal, prices fluctuate sharply.",
  },
  {
    name: "Onion",
    pricePerKg: "₹ 20 / kg",
    pricePer100Kg: "₹ 2,000 / 100kg",
    pricePerQuintal: "₹ 2,000 / Quintal",
    info: "Essential vegetable, strong demand across states.",
  },
  {
    name: "Sugarcane",
    pricePerKg: "₹ 3 / kg",
    pricePer100Kg: "₹ 300 / 100kg",
    pricePerQuintal: "₹ 300 / Quintal",
    info: "Primarily for sugar and jaggery production.",
  },
];

export default function Market(): JSX.Element {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(marketData);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === "") {
      setResults(marketData);
    } else {
      const filtered = marketData.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    }
  };

  return (
    <LinearGradient colors={["#e8f5e9", "#ffffff"]} style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#43a047", "#2e7d32"]} style={styles.header}>
        <Text style={styles.headerTitle}>📊 Market Value Suggestions</Text>
        <Text style={styles.headerSubtitle}>
          Search crop to see market value & details
        </Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="🔍 Search crop name..."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.name}
        ListEmptyComponent={
          <Text style={styles.noData}>❌ No data available</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.crop}>🌱 {item.name}</Text>
            <Text style={styles.price}>• {item.pricePerKg}</Text>
            <Text style={styles.price}>• {item.pricePer100Kg}</Text>
            <Text style={styles.price}>• {item.pricePerQuintal}</Text>
            <Text style={styles.info}>{item.info}</Text>
          </View>
        )}
      />
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
  searchContainer: { padding: 15 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    marginHorizontal: 15,
    elevation: 3,
  },
  crop: { fontSize: 18, fontWeight: "bold", color: "#2e7d32" },
  price: { fontSize: 15, color: "#444", marginTop: 3 },
  info: { fontSize: 14, color: "#777", marginTop: 6 },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});
