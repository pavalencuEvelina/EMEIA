import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Child } from "../types/ChildInterface";
import { adminService } from "../services/adminService";

export default function MainAppAdminScreen({ navigation }: any) {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchChildren = async () => {
    try {
      const data = await adminService.getChildren();
      setChildren(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load children.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadData = async () => {
    try {
      const data = await adminService.getChildren();
      setChildren(data);
    } catch (error: any) {
      // Fallback for development if server is off
      setChildren([
        {
          id: "1",
          name: "Bogdan (backend is off)",
          coins: 450,
          avatarColor: "#FF8C00",
          activeQuests: [],
          completedHistory: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchChildren();
  };

  const renderChildCard = ({ item }: { item: Child }) => (
    <TouchableOpacity
      style={styles.childCard}
      onPress={() =>
        navigation.navigate("ChildDashboardScreen", {
          childId: item.id,
          childName: item.name,
        })
      }
    >
      <View
        style={[
          styles.avatarCircle,
          { backgroundColor: item.avatarColor || "#333" },
        ]}
      >
        <Text style={styles.avatarInitial}>{item.name[0]}</Text>
      </View>
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{item.name}</Text>
        <View style={styles.coinContainer}>
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

      {/* 1. VERTICAL SIDEBAR */}
      <View style={styles.sidebar}>
        <View>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("ProfilePicker")}
          >
            <MaterialCommunityIcons
              name="account-circle"
              size={30}
              color="#FF8C00"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("VerifyQuestsScreen")}
          >
            <MaterialCommunityIcons
              name="check-decagram"
              size={30}
              color="#FF8C00"
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>69</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("SelectUser")}
          >
            <MaterialCommunityIcons
              name="account-switch"
              size={30}
              color="#FF8C00"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.navItem, styles.settingsItem]}
          onPress={() => navigation.navigate("Settings")}
        >
          <MaterialCommunityIcons name="cog" size={30} color="#555" />
        </TouchableOpacity>
      </View>

      {/* 2. MAIN CONTENT AREA */}
      <View style={styles.mainContent}>
        <Text style={styles.headerTitle}>Family Fleet</Text>
        <Text style={styles.subTitle}>Select a child to assign new quests</Text>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        ) : (
          <FlatList
            data={children}
            renderItem={renderChildCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor="#FF8C00"
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No crew members found.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "row",
  },
  sidebar: {
    width: 75,
    backgroundColor: "#0A0A0A",
    borderRightWidth: 1,
    borderColor: "#1A1A1A",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  navItem: {
    marginBottom: 35,
    padding: 10,
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "bold",
  },
  settingsItem: {
    marginBottom: 0,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subTitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 30,
    marginTop: 5,
  },
  listPadding: {
    paddingBottom: 40,
  },
  childCard: {
    backgroundColor: "#121212",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  childInfo: {
    flex: 1,
    marginLeft: 15,
  },
  childName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  coinText: {
    color: "#FF8C00",
    marginLeft: 6,
    fontWeight: "800",
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#444",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    fontStyle: "italic",
  },
});
