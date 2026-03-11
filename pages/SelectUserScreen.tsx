import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "../services/apiUtils";

const API_BASE = "https://emeia.infinityfree.me/my-api";

type Profile = { id: string; name: string; type: "PARENT" | "CHILD"; avatarColor: string; };

export default function SelectUserScreen({ navigation }: any) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const userId = await SecureStore.getItemAsync("user_id");
        if (!userId) { navigation.replace("Login"); return; }

        const { response, data } = await apiFetch(`${API_BASE}/get_profiles.php?userId=${userId}`);
        if (!response.ok) throw new Error(data.message || "Could not load profiles.");
        setProfiles(data);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to load family profiles.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfiles();
  }, []);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Return to the login screen?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out", style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("user_id");
          navigation.replace("Login");
        },
      },
    ]);
  };

  const renderProfile = ({ item }: { item: Profile }) => {
    const isParent = item.type === "PARENT";
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProfileLogin", { user: item })}
      >
        <View style={[styles.avatar, { borderColor: isParent ? "#FF8C00" : item.avatarColor }]}>
          <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        {isParent && <Text style={styles.parentBadge}>PARENT</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#ff4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Who is using the app?</Text>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#FF8C00" /></View>
      ) : (
        <FlatList
          data={profiles}
          renderItem={renderProfile}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          numColumns={2}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No profiles found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  topBar: { width: "100%", paddingHorizontal: 20, paddingTop: 10, alignItems: "flex-end" },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: "#2a0000", backgroundColor: "#0d0000" },
  logoutText: { color: "#ff4444", fontSize: 13, fontWeight: "600" },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 30, marginBottom: 30 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { margin: 16, alignItems: "center", width: 110 },
  avatar: { width: 100, height: 100, backgroundColor: "#1A1A1A", justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 2 },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  name: { color: "#fff", marginTop: 10, fontSize: 15, textAlign: "center", maxWidth: 110 },
  parentBadge: { color: "#FF8C00", fontSize: 10, fontWeight: "bold", letterSpacing: 1, marginTop: 4 },
  empty: { color: "#444", textAlign: "center", marginTop: 60, fontSize: 16, fontStyle: "italic" },
});
