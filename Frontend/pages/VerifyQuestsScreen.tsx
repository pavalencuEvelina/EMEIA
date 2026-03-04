import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { adminService } from "../services/adminService";

export default function VerifyQuestsScreen() {
  const [pendingData, setPendingData] = useState<any[]>([]);

  const loadPending = async () => {
    // In reality, fetch all children and filter those with 'SUBMITTED' quests
    // Fallback data for UI build:
    setPendingData([
      {
        childName: "Bogdan",
        childId: "1",
        quests: [{ id: "q1", title: "Cleaned Room", reward: 50 }],
      },
      {
        childName: "Elena",
        childId: "2",
        quests: [{ id: "q2", title: "Math Homework", reward: 100 }],
      },
    ]);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleAction = async (
    childId: string,
    questId: string,
    approve: boolean,
  ) => {
    const success = await adminService.verifyQuest(childId, questId, approve);
    if (success) {
      Alert.alert(
        approve ? "Approved!" : "Rejected",
        approve ? "Coins sent to balance." : "Quest sent back to child.",
      );
      loadPending(); // Refresh list
    }
  };

  const renderChildGroup = ({ item }: any) => (
    <View style={styles.childGroup}>
      <Text style={styles.childHeader}>{item.childName.toUpperCase()}</Text>
      {item.quests.map((quest: any) => (
        <View key={quest.id} style={styles.questRow}>
          <View style={styles.questDetails}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.rewardText}>+{quest.reward} Coins</Text>
          </View>

          <View style={styles.actionButtons}>
            {/* REJECT BUTTON */}
            <TouchableOpacity
              style={[styles.btn, styles.rejectBtn]}
              onPress={() => handleAction(item.childId, quest.id, false)}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={30}
                color="#ff4444"
              />
            </TouchableOpacity>

            {/* APPROVE BUTTON */}
            <TouchableOpacity
              style={[styles.btn, styles.approveBtn]}
              onPress={() => handleAction(item.childId, quest.id, true)}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={35}
                color="#FF8C00"
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Pending Verification</Text>
      <FlatList
        data={pendingData}
        renderItem={renderChildGroup}
        keyExtractor={(item) => item.childId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    marginTop: 35,
  },
  childGroup: { marginBottom: 30 },
  childHeader: {
    color: "#FF8C00",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
  },
  questRow: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  questDetails: { flex: 1 },
  questTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  rewardText: { color: "#888", fontSize: 14 },
  actionButtons: { flexDirection: "row", alignItems: "center" },
  btn: { marginLeft: 15 },
  rejectBtn: {},
  approveBtn: { transform: [{ scale: 0.9 }] },
});
