import React, { useEffect, useState } from "react";
import {
  StyleSheet, View, Text, FlatList, ActivityIndicator,
  Alert, TouchableOpacity, Modal, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { childService } from "../services/childService";
import { adminService } from "../services/adminService";
 
// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

// ─────────────────────────────────────────────
//  Screen
// ─────────────────────────────────────────────
export default function ChildDashboardScreen({ route, navigation }: any) {
  // parentId is needed when creating global quests
  const { childId, childName, isAdmin = false, parentId } = route.params;

  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [coinHistory, setCoinHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ── Add / Edit Quest modal ──────────────────
  const [questModal, setQuestModal]   = useState(false);
  const [editingQuest, setEditingQuest] = useState<any>(null); // null = new quest
  const [questTitle, setQuestTitle]   = useState("");
  const [questDesc, setQuestDesc]     = useState("");
  const [questReward, setQuestReward] = useState("");
  const [isGlobal, setIsGlobal]       = useState(false); // toggle: all children
  const [isSaving, setIsSaving]       = useState(false);

  // ── Spend Coins modal ───────────────────────
  const [spendModal, setSpendModal]   = useState(false);
  const [spendAmount, setSpendAmount] = useState("");
  const [spendReason, setSpendReason] = useState("");
  const [isSpending, setIsSpending]   = useState(false);

  // ── Active tab ──────────────────────────────
  type Tab = "quests" | "history";
  const [activeTab, setActiveTab] = useState<Tab>("quests");

  // ─────────────────────────────────────────────
  //  Data loading
  // ─────────────────────────────────────────────
  const loadData = async () => {
    try {
      const details = await childService.getChildDetails(childId);
      setData(details);
    } catch {
      setData({ balance: 0, activeQuests: [], history: [] });
    } finally {
      setLoading(false);
    }
  };

  const loadCoinHistory = async () => {
    setHistoryLoading(true);
    try {
      const hist = await childService.getCoinHistory(childId);
      setCoinHistory(hist);
    } catch {
      setCoinHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [childId]);

  useEffect(() => {
    if (activeTab === "history") loadCoinHistory();
  }, [activeTab]);

  // ─────────────────────────────────────────────
  //  Quest actions
  // ─────────────────────────────────────────────
  const handleToggle = async (questId: string, currentStatus: string) => {
    const isDone = currentStatus === "PENDING";
    const success = await childService.toggleQuestStatus(questId, isDone);
    if (success) loadData();
  };

  const handleDelete = (questId: string) => {
    Alert.alert("Delete Quest", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => { if (await childService.deleteQuest(questId)) loadData(); },
      },
    ]);
  };

  const openAddModal = () => {
    setEditingQuest(null);
    setQuestTitle(""); setQuestDesc(""); setQuestReward(""); setIsGlobal(false);
    setQuestModal(true);
  };

  const openEditModal = (quest: any) => {
    setEditingQuest(quest);
    setQuestTitle(quest.title);
    setQuestDesc(quest.description || "");
    setQuestReward(String(quest.reward));
    setIsGlobal(false); // editing is always single-quest
    setQuestModal(true);
  };

  const handleSaveQuest = async () => {
    if (!questTitle.trim()) { Alert.alert("Error", "Quest title is required."); return; }
    const reward = parseInt(questReward) || 0;
    setIsSaving(true);
    try {
      if (editingQuest) {
        // ── EDIT existing quest ──
        await adminService.editQuest(editingQuest.id, questTitle.trim(), questDesc.trim(), reward);
      } else if (isGlobal) {
        // ── NEW global quest for all children ──
        if (!parentId) throw new Error("parentId not available. Cannot create global quest.");
        await adminService.createGlobalQuest(parentId, questTitle.trim(), questDesc.trim(), reward);
      } else {
        // ── NEW quest for this child only ──
        await adminService.createQuest(childId, {
          title: questTitle.trim(), description: questDesc.trim(), reward,
        });
      }
      setQuestModal(false);
      loadData();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally { setIsSaving(false); }
  };

  // ─────────────────────────────────────────────
  //  Spend coins
  // ─────────────────────────────────────────────
  const handleSpend = async () => {
    const amount = parseInt(spendAmount);
    if (!amount || amount <= 0) { Alert.alert("Error", "Enter a valid coin amount."); return; }
    if (!spendReason.trim()) { Alert.alert("Error", "Enter a reward name."); return; }
    setIsSpending(true);
    try {
      const result = await adminService.spendCoins(childId, amount, spendReason.trim());
      Alert.alert("Redeemed!", result.message);
      setSpendAmount(""); setSpendReason("");
      setSpendModal(false);
      loadData();
      if (activeTab === "history") loadCoinHistory();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally { setIsSpending(false); }
  };

  // ─────────────────────────────────────────────
  //  Render helpers
  // ─────────────────────────────────────────────
  const renderQuestCard = (item: any, isHistory = false) => (
    <View key={item.id} style={[styles.card, isHistory && styles.historyCard]}>
      <View style={styles.questInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.questTitle}>{item.title}</Text>
          {item.isGlobal && (
            <View style={styles.globalBadge}>
              <MaterialCommunityIcons name="earth" size={10} color="#FF8C00" />
              <Text style={styles.globalBadgeText}>GLOBAL</Text>
            </View>
          )}
        </View>
        {!!item.description && (
          <Text style={styles.questDesc} numberOfLines={1}>{item.description}</Text>
        )}
        <View style={styles.questMeta}>
          <Text style={styles.rewardText}>{item.reward} Coins</Text>
          {!isHistory && (
            <View style={[styles.statusBadge,
              item.status === "SUBMITTED" ? styles.badgeSubmitted : styles.badgePending,
            ]}>
              <Text style={styles.statusText}>
                {item.status === "SUBMITTED" ? "Awaiting review" : "In progress"}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {/* Child: toggle completion */}
        {!isHistory && !isAdmin && (
          <TouchableOpacity
            onPress={() => handleToggle(item.id, item.status)}
            style={[styles.circleBtn, item.status === "SUBMITTED" && styles.doneBtn]}
          >
            <MaterialCommunityIcons
              name={item.status === "SUBMITTED" ? "check-circle" : "circle-outline"}
              size={28} color={item.status === "SUBMITTED" ? "#000" : "#FF8C00"}
            />
          </TouchableOpacity>
        )}

        {/* Parent: edit (PENDING only) + delete */}
        {isAdmin && !isHistory && (
          <>
            {item.status === "PENDING" && (
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#FF8C00" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={22} color="#ff4444" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderCoinHistoryItem = (item: any) => {
    const isEarned = item.type === "EARNED";
    return (
      <View key={item.id} style={styles.historyRow}>
        <View style={[styles.historyIcon, isEarned ? styles.earnedIcon : styles.spentIcon]}>
          <MaterialCommunityIcons
            name={isEarned ? "sword" : "gift"}
            size={16} color={isEarned ? "#FF8C00" : "#aaa"}
          />
        </View>
        <View style={styles.historyInfo}>
          <Text style={styles.historyReason}>{item.reason || (isEarned ? "Quest completed" : "Reward redeemed")}</Text>
          <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={[styles.historyAmount, isEarned ? styles.earnedText : styles.spentText]}>
          {isEarned ? "+" : "-"}{item.amount}
        </Text>
      </View>
    );
  };

  // ─────────────────────────────────────────────
  //  Screen
  // ─────────────────────────────────────────────
  if (loading)
    return <View style={styles.center}><ActivityIndicator color="#FF8C00" size="large" /></View>;

  const questModalTitle = editingQuest
    ? `Edit Quest`
    : isGlobal
      ? "New Global Quest"
      : `New Quest for ${childName}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {
          if (isAdmin && navigation.canGoBack()) navigation.goBack();
          else navigation.navigate("SelectUser");
        }}>
          <MaterialCommunityIcons
            name={isAdmin ? "arrow-left" : "account-switch"}
            size={26} color="#FF8C00"
          />
        </TouchableOpacity>

        <View style={styles.topRight}>
          {isAdmin && (
            <>
              <TouchableOpacity style={styles.spendBtn} onPress={() => setSpendModal(true)}>
                <MaterialCommunityIcons name="gift-outline" size={18} color="#FF8C00" />
                <Text style={styles.spendBtnText}>Redeem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <MaterialCommunityIcons name="plus" size={18} color="#000" />
                <Text style={styles.addBtnText}>Quest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteChildBtn}
                onPress={() => {
                  Alert.alert(
                    `Delete ${childName}?`,
                    "This will permanently remove this child along with all their quests and coin history.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          if (!parentId) return;
                          try {
                            await adminService.deleteChild(childId, parentId);
                            navigation.goBack();
                          } catch (e: any) {
                            Alert.alert("Error", e.message);
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={22} color="#ff4444" />
              </TouchableOpacity>
            </>
          )}
          {!isAdmin && (
            <TouchableOpacity onPress={() => navigation.navigate("Settings", {
              profileId: childId, profileType: "CHILD", profileName: childName,
              currentAvatarColor: data?.avatarColor,
            })}>
              <MaterialCommunityIcons name="cog" size={26} color="#555" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── BALANCE ── */}
        <View style={styles.header}>
          <Text style={styles.nameLabel}>{childName}'s Arsenal</Text>
          <View style={styles.balanceRow}>
            <MaterialCommunityIcons name="database" size={30} color="#FF8C00" />
            <Text style={styles.balanceText}>{data.balance}</Text>
          </View>
        </View>

        {/* ── TABS ── */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "quests" && styles.tabActive]}
            onPress={() => setActiveTab("quests")}
          >
            <Text style={[styles.tabText, activeTab === "quests" && styles.tabTextActive]}>
              MISSIONS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "history" && styles.tabActive]}
            onPress={() => setActiveTab("history")}
          >
            <Text style={[styles.tabText, activeTab === "history" && styles.tabTextActive]}>
              COIN HISTORY
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── MISSIONS TAB ── */}
        {activeTab === "quests" && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACTIVE MISSIONS</Text>
              {data.activeQuests.length === 0
                ? <Text style={styles.emptyText}>No active quests.</Text>
                : data.activeQuests.map((item: any) => renderQuestCard(item, false))
              }
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: "#333" }]}>COMPLETED</Text>
              {data.history.length === 0
                ? <Text style={styles.emptyText}>No completed quests yet.</Text>
                : data.history.map((item: any) => renderQuestCard(item, true))
              }
            </View>
          </>
        )}

        {/* ── COIN HISTORY TAB ── */}
        {activeTab === "history" && (
          <View style={styles.section}>
            {historyLoading
              ? <ActivityIndicator color="#FF8C00" style={{ marginTop: 40 }} />
              : coinHistory.length === 0
                ? <Text style={styles.emptyText}>No coin activity yet.</Text>
                : coinHistory.map(renderCoinHistoryItem)
            }
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── ADD / EDIT QUEST MODAL ── */}
      <Modal visible={questModal} transparent animationType="slide" onRequestClose={() => setQuestModal(false)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{questModalTitle}</Text>
              <TouchableOpacity onPress={() => setQuestModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              {/* Global toggle — only shown for new quests, not edits */}
              {!editingQuest && isAdmin && parentId && (
                <View style={styles.toggleRow}>
                  <View style={styles.toggleInfo}>
                    <MaterialCommunityIcons name="earth" size={18} color={isGlobal ? "#FF8C00" : "#444"} />
                    <View>
                      <Text style={[styles.toggleLabel, isGlobal && { color: "#FF8C00" }]}>
                        Global Quest
                      </Text>
                      <Text style={styles.toggleSub}>
                        {isGlobal
                          ? "First child to complete it wins the coins"
                          : `Only assigned to ${childName}`}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsGlobal(!isGlobal)}
                    style={[styles.toggleSwitch, isGlobal && styles.toggleSwitchOn]}
                  >
                    <View style={[styles.toggleKnob, isGlobal && styles.toggleKnobOn]} />
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.fieldLabel}>TITLE *</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. Clean your room"
                placeholderTextColor="#555" value={questTitle} onChangeText={setQuestTitle} maxLength={100} />

              <Text style={styles.fieldLabel}>DESCRIPTION (optional)</Text>
              <TextInput style={[styles.modalInput, styles.multiline]}
                placeholder="Describe what needs to be done..."
                placeholderTextColor="#555" value={questDesc} onChangeText={setQuestDesc}
                multiline numberOfLines={3} maxLength={300} />

              <Text style={styles.fieldLabel}>COIN REWARD</Text>
              <TextInput style={styles.modalInput} placeholder="0"
                placeholderTextColor="#555" value={questReward} onChangeText={setQuestReward}
                keyboardType="numeric" maxLength={5} />

              <TouchableOpacity
                style={[styles.sheetBtn, isSaving && styles.disabled]}
                onPress={handleSaveQuest} disabled={isSaving}
              >
                {isSaving ? <ActivityIndicator color="#000" /> : (
                  <>
                    <MaterialCommunityIcons
                      name={editingQuest ? "content-save-outline" : isGlobal ? "earth" : "sword"}
                      size={18} color="#000"
                    />
                    <Text style={styles.sheetBtnText}>
                      {editingQuest ? "SAVE CHANGES" : isGlobal ? "ASSIGN TO ALL" : "ASSIGN QUEST"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── SPEND COINS MODAL ── */}
      <Modal visible={spendModal} transparent animationType="slide" onRequestClose={() => setSpendModal(false)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Redeem Coins</Text>
              <TouchableOpacity onPress={() => setSpendModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={styles.balanceHint}>
              {childName} has <Text style={{ color: "#FF8C00", fontWeight: "bold" }}>{data.balance}</Text> coins
            </Text>

            <Text style={styles.fieldLabel}>REWARD NAME *</Text>
            <TextInput style={styles.modalInput} placeholder="e.g. Ice cream, Extra screen time"
              placeholderTextColor="#555" value={spendReason} onChangeText={setSpendReason} maxLength={100} />

            <Text style={styles.fieldLabel}>COINS TO DEDUCT *</Text>
            <TextInput style={styles.modalInput} placeholder="0"
              placeholderTextColor="#555" value={spendAmount} onChangeText={setSpendAmount}
              keyboardType="numeric" maxLength={5} />

            <TouchableOpacity
              style={[styles.sheetBtn, styles.sheetBtnGold, isSpending && styles.disabled]}
              onPress={handleSpend} disabled={isSpending}
            >
              {isSpending ? <ActivityIndicator color="#000" /> : (
                <>
                  <MaterialCommunityIcons name="gift" size={18} color="#000" />
                  <Text style={styles.sheetBtnText}>REDEEM REWARD</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  center:    { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },

  topBar:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  topRight: { flexDirection: "row", alignItems: "center", gap: 10 },

  addBtn:     { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FF8C00", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  addBtnText: { color: "#000", fontWeight: "bold", fontSize: 13 },
  spendBtn:     { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#FF8C00" },
  spendBtnText: { color: "#FF8C00", fontWeight: "bold", fontSize: 13 },

  header:      { alignItems: "center", paddingVertical: 20 },
  nameLabel:   { color: "#555", fontSize: 12, textTransform: "uppercase", letterSpacing: 3 },
  balanceRow:  { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 10 },
  balanceText: { color: "#fff", fontSize: 52, fontWeight: "900" },

  // Tabs
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#1c1c1c", marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#FF8C00" },
  tabText:   { color: "#444", fontSize: 11, fontWeight: "bold", letterSpacing: 2 },
  tabTextActive: { color: "#FF8C00" },

  section:      { marginTop: 20, marginBottom: 8 },
  sectionTitle: { color: "#FF8C00", fontWeight: "bold", letterSpacing: 2, fontSize: 11, marginBottom: 12 },
  emptyText:    { color: "#2a2a2a", fontStyle: "italic", marginTop: 4, fontSize: 13 },

  card: { backgroundColor: "#111", padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#1c1c1c" },
  historyCard: { opacity: 0.4 },
  questInfo: { flex: 1, marginRight: 10 },
  titleRow:  { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  questTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  questDesc:  { color: "#555", fontSize: 12, marginTop: 2 },
  questMeta:  { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 },
  rewardText: { color: "#FF8C00", fontWeight: "bold", fontSize: 13 },

  globalBadge:     { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#1a0f00", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5, borderWidth: 1, borderColor: "#3a2000" },
  globalBadgeText: { color: "#FF8C00", fontSize: 9, fontWeight: "bold", letterSpacing: 1 },

  statusBadge:    { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgePending:   { backgroundColor: "#1a1a00" },
  badgeSubmitted: { backgroundColor: "#001a00" },
  statusText:     { fontSize: 10, fontWeight: "600", color: "#888" },

  actions:   { flexDirection: "row", alignItems: "center", gap: 8 },
  circleBtn: { borderRadius: 20 },
  doneBtn:   { backgroundColor: "#FF8C00", borderRadius: 20 },
  editBtn:        { padding: 8, marginLeft: 4 },
  deleteBtn:      { padding: 8, marginLeft: 4 },
  deleteChildBtn: { padding: 6, marginLeft: 6 },

  // Coin history rows
  historyRow:  { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#111" },
  historyIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", marginRight: 12 },
  earnedIcon:  { backgroundColor: "#1a0f00" },
  spentIcon:   { backgroundColor: "#1a1a1a" },
  historyInfo: { flex: 1 },
  historyReason: { color: "#fff", fontSize: 14, fontWeight: "500" },
  historyDate:   { color: "#444", fontSize: 11, marginTop: 2 },
  historyAmount: { fontSize: 16, fontWeight: "bold" },
  earnedText:    { color: "#FF8C00" },
  spentText:     { color: "#666" },

  // Modals
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.75)" },
  sheet:   { backgroundColor: "#111", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 44, borderTopWidth: 1, borderColor: "#222" },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sheetTitle:  { color: "#fff", fontSize: 17, fontWeight: "bold" },
  balanceHint: { color: "#666", fontSize: 13, marginBottom: 18 },
  fieldLabel:  { color: "#FF8C00", fontSize: 11, fontWeight: "bold", letterSpacing: 2, marginBottom: 8, marginTop: 4 },
  modalInput:  { backgroundColor: "#1a1a1a", color: "#fff", padding: 14, borderRadius: 8, fontSize: 15, borderWidth: 1, borderColor: "#2a2a2a", marginBottom: 14 },
  multiline:   { height: 88, textAlignVertical: "top" },
  sheetBtn:     { backgroundColor: "#FF8C00", padding: 16, borderRadius: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 8 },
  sheetBtnGold: { backgroundColor: "#c97700" },
  sheetBtnText: { color: "#000", fontWeight: "bold", fontSize: 15, letterSpacing: 1 },
  disabled: { opacity: 0.5 },

  // Global toggle
  toggleRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1a1a1a", padding: 14, borderRadius: 10, marginBottom: 18, borderWidth: 1, borderColor: "#2a2a2a" },
  toggleInfo:   { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  toggleLabel:  { color: "#888", fontSize: 14, fontWeight: "600" },
  toggleSub:    { color: "#444", fontSize: 11, marginTop: 2, maxWidth: 200 },
  toggleSwitch: { width: 44, height: 24, backgroundColor: "#2a2a2a", borderRadius: 12, justifyContent: "center", paddingHorizontal: 2 },
  toggleSwitchOn: { backgroundColor: "#FF8C00" },
  toggleKnob:   { width: 20, height: 20, backgroundColor: "#666", borderRadius: 10 },
  toggleKnobOn: { backgroundColor: "#000", alignSelf: "flex-end" },
});
