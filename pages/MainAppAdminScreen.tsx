import React, { useEffect, useState } from "react";
import {
  StyleSheet, View, Text, TouchableOpacity,
  FlatList, StatusBar, ActivityIndicator, RefreshControl, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Child } from "../types/ChildInterface";
import { adminService } from "../services/adminService";

export default function MainAppAdminScreen({ navigation }: any) {
  const [children, setChildren] = useState<Child[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const id = await SecureStore.getItemAsync("user_id");
      setParentId(id);
      if (!id) { navigation.replace("Login"); return; }
      const data = await adminService.getChildren(id);
      setChildren(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load family.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (!isLoading) loadData();
    });
    return unsubscribe;
  }, [navigation, isLoading]);

  const renderChildCard = ({ item }: { item: Child }) => (
    <TouchableOpacity
      style={styles.childCard}
      onPress={() => navigation.navigate("ChildDashboardScreen", {
        childId: item.id, childName: item.name, isAdmin: true, parentId,
      })}
    >
      <View style={[styles.avatar, { backgroundColor: item.avatarColor || "#333" }]}>
        <Text style={styles.avatarInitial}>{item.name[0]}</Text>
      </View>
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{item.name}</Text>
        <View style={styles.coinRow}>
          <MaterialCommunityIcons name="database" size={16} color="#FF8C00" />
          <Text style={styles.coinText}>{item.coins} Coins</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* SIDEBAR */}
      <View style={styles.sidebar}>
        <View>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("VerifyQuestsScreen")}>
            <MaterialCommunityIcons name="check-decagram" size={30} color="#FF8C00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AddChild")}>
            <MaterialCommunityIcons name="account-plus" size={30} color="#FF8C00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("SelectUser")}>
            <MaterialCommunityIcons name="account-switch" size={30} color="#FF8C00" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.navItem, { marginBottom: 0 }]}
          onPress={() => navigation.navigate("Settings", {
            profileId: parentId,
            profileType: "PARENT",
            profileName: "Parent Account",
          })}
        >
          <MaterialCommunityIcons name="cog" size={30} color="#555" />
        </TouchableOpacity>
      </View>

      {/* MAIN */}
      <View style={styles.main}>
        <Text style={styles.title}>Family Fleet</Text>
        <Text style={styles.subtitle}>Select a child to manage their quests</Text>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        ) : (
          <FlatList
            data={children}
            renderItem={renderChildCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPad}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => { setIsRefreshing(true); loadData(); }}
                tintColor="#FF8C00"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="account-group" size={60} color="#222" />
                <Text style={styles.emptyText}>No children yet.</Text>
                <TouchableOpacity style={styles.addFirstBtn} onPress={() => navigation.navigate("AddChild")}>
                  <Text style={styles.addFirstText}>+ Add your first child</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", flexDirection: "row" },
  sidebar: { width: 75, backgroundColor: "#0A0A0A", borderRightWidth: 1, borderColor: "#1A1A1A", justifyContent: "space-between", alignItems: "center", paddingVertical: 40 },
  navItem: { marginBottom: 35, padding: 10, alignItems: "center" },
  main: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: 1 },
  subtitle: { color: "#666", fontSize: 14, marginBottom: 30, marginTop: 5 },
  listPad: { paddingBottom: 40 },
  childCard: { backgroundColor: "#121212", flexDirection: "row", alignItems: "center", padding: 18, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: "#222" },
  avatar: { width: 55, height: 55, borderRadius: 27.5, justifyContent: "center", alignItems: "center" },
  avatarInitial: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  childInfo: { flex: 1, marginLeft: 15 },
  childName: { color: "#fff", fontSize: 18, fontWeight: "700" },
  coinRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  coinText: { color: "#FF8C00", marginLeft: 6, fontWeight: "800", fontSize: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#444", fontSize: 16, fontStyle: "italic", marginTop: 10 },
  addFirstBtn: { marginTop: 20, borderWidth: 1, borderColor: "#FF8C00", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  addFirstText: { color: "#FF8C00", fontWeight: "bold", fontSize: 15 },
});
