import React, { useEffect, useState } from "react";
import {
  StyleSheet, View, Text, FlatList,
  TouchableOpacity, Alert, ActivityIndicator, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { adminService } from "../services/adminService";

export default function VerifyQuestsScreen({ navigation }: any) {
  const [pendingData, setPendingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const parentIdRef = React.useRef<string>("");

  const loadPending = async () => {
    if (!parentIdRef.current) return;
    try {
      const data = await adminService.getPendingQuests(parentIdRef.current);
      setPendingData(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not load pending quests.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const pid = await SecureStore.getItemAsync("user_id");
      if (!pid) { navigation.replace("Login"); return; }
      parentIdRef.current = pid;
      loadPending();
    };
    init();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadPending();
  };

  const handleAction = async (childId: string, questId: string, approve: boolean) => {
    try {
      const result = await adminService.verifyQuest(childId, questId, approve);
      Alert.alert(
        approve ? "Approved!" : "Rejected",
        result.message,
      );
      loadPending();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Action failed. Please try again.");
    }
  };

  const renderChildGroup = ({ item }: any) => (
    <View style={styles.childGroup}>
      <Text style={styles.childHeader}>{item.childName.toUpperCase()}</Text>

      {item.quests.map((quest: any) => (
        <View key={quest.id} style={styles.questRow}>
          <View style={styles.questDetails}>
            <View style={styles.titleRow}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              {quest.isGlobal && (
                <View style={styles.globalBadge}>
                  <MaterialCommunityIcons name="earth" size={11} color="#FF8C00" />
                  <Text style={styles.globalBadgeText}>GLOBAL</Text>
                </View>
              )}
            </View>
            <Text style={styles.rewardText}>+{quest.reward} Coins</Text>
          </View>

          <View style={styles.actionButtons}>
            {/* REJECT */}
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleAction(item.childId, quest.id, false)}
            >
              <MaterialCommunityIcons name="close-circle" size={34} color="#ff4444" />
            </TouchableOpacity>

            {/* APPROVE */}
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleAction(item.childId, quest.id, true)}
            >
              <MaterialCommunityIcons name="check-circle" size={38} color="#FF8C00" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate("MainAppAdminScreen");
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FF8C00" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Pending Verification</Text>
        <View style={styles.backBtn} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      ) : (
        <FlatList
          data={pendingData}
          renderItem={renderChildGroup}
          keyExtractor={(item) => item.childId}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#FF8C00" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="check-all" size={60} color="#1a1a1a" />
              <Text style={styles.emptyText}>All clear — no quests awaiting approval.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "#111",
  },
  backBtn: { width: 44, height: 44, justifyContent: "center" },
  mainTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingHorizontal: 20, paddingBottom: 40 },

  childGroup: { marginBottom: 28 },
  childHeader: {
    color: "#FF8C00", fontSize: 12, fontWeight: "bold",
    letterSpacing: 2, marginBottom: 10,
  },
  questRow: {
    backgroundColor: "#111", padding: 16, borderRadius: 12,
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#1c1c1c", marginBottom: 8,
  },
  questDetails: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  questTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  globalBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#1a0f00", paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, borderWidth: 1, borderColor: "#3a2000",
  },
  globalBadgeText: { color: "#FF8C00", fontSize: 9, fontWeight: "bold", letterSpacing: 1 },
  rewardText: { color: "#555", fontSize: 13, marginTop: 4 },

  actionButtons: { flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 12 },
  rejectBtn: {},
  approveBtn: {},

  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { color: "#333", textAlign: "center", marginTop: 16, fontSize: 14, fontStyle: "italic" },
});
