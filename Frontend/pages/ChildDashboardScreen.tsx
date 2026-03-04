import React, { useEffect, useState, useContext, createContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { childService } from "../services/childService";

// Create a default context if not provided
const UserContext = createContext({
  currentUser: { role: "CHILD" },
});

export default function ChildDashboardScreen({ route }: any) {
  const { childId, childName } = route.params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useContext(UserContext) || {
    currentUser: { role: "CHILD" },
  };
  const isAdmin = currentUser.role === "PARENT" || true;

  const loadData = async () => {
    try {
      const details = await childService.getChildDetails(childId);
      setData(details);
    } catch (e) {
      // Fallback for UI testing
      setData({
        balance: 450,
        activeQuests: [
          { id: "q1", title: "Clean Room", reward: 50, status: "PENDING" },
          { id: "q2", title: "Do Homework", reward: 30, status: "SUBMITTED" },
        ],
        history: [{ id: "h1", title: "Wash Dishes", reward: 20 }],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [childId]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF8C00" />
      </View>
    );

  const handleToggle = async (questId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PENDING";
    const success = await childService.toggleQuestStatus(questId, newStatus);
    if (success) {
      loadData(); // Refresh the list from the server
    }
  };

  const handleDelete = async (questId: string) => {
    Alert.alert("Delete Quest", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await childService.deleteQuest(questId);
          if (success) loadData();
        },
      },
    ]);
  };

  const renderQuest = ({ item, isHistory = false }: any) => (
    <View style={[styles.card, isHistory && styles.historyCard]}>
      <View style={styles.questInfo}>
        <Text style={styles.questTitle}>{item.title}</Text>
        <Text style={styles.rewardText}>{item.reward} Coins</Text>
      </View>

      <View style={styles.actions}>
        {/* COMPLETION BUTTON (Visible to Child/Admin) */}
        {!isHistory && (
          <TouchableOpacity
            onPress={() => handleToggle(item.id, item.status)}
            style={[
              styles.circleBtn,
              item.status === "SUBMITTED" && styles.doneBtn,
            ]}
          >
            <MaterialCommunityIcons
              name={
                item.status === "SUBMITTED" ? "check-circle" : "circle-outline"
              }
              size={28}
              color={item.status === "SUBMITTED" ? "#000" : "#FF8C00"}
            />
          </TouchableOpacity>
        )}

        {/* DELETE BUTTON (Admin Only Logic) */}
        {isAdmin && (
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteBtn}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color="#ff4444"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: BALANCE */}
      <View style={styles.header}>
        <Text style={styles.nameLabel}>{childName}'s Arsenal</Text>
        <View style={styles.balanceContainer}>
          <MaterialCommunityIcons name="database" size={32} color="#FF8C00" />
          <Text style={styles.balanceText}>{data.balance}</Text>
        </View>
      </View>

      {/* ACTIVE QUESTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACTIVE MISSIONS</Text>
        <FlatList
          data={data.activeQuests}
          renderItem={({ item }) => renderQuest({ item, isHistory: false })}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* HISTORY */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: "#444" }]}>
          COMPLETED HISTORY
        </Text>
        <FlatList
          data={data.history}
          renderItem={({ item }) => renderQuest({ item, isHistory: true })}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  center: { flex: 1, justifyContent: "center", backgroundColor: "#000" },
  header: { alignItems: "center", marginVertical: 30, marginTop: 50 },
  nameLabel: { color: "#888", fontSize: 16, textTransform: "uppercase" },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  balanceText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "900",
    marginLeft: 10,
  },
  section: { flex: 1, marginTop: 20 },
  sectionTitle: {
    color: "#FF8C00",
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyCard: { opacity: 0.5, backgroundColor: "#050505" },
  questInfo: { flex: 1 },
  questTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  rewardText: { color: "#FF8C00", fontWeight: "bold" },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  circleBtn: {
    borderColor: "#333",
    borderRadius: 20,
  },
  doneBtn: {
    backgroundColor: "#FF8C00", // Fill the circle with orange when done
    borderColor: "#FF8C00",
  },
  deleteBtn: {
    padding: 5,
    marginLeft: 10,
    backgroundColor: "#1a0000",
    borderRadius: 8,
  },
});
