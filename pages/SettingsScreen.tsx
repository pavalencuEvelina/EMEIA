import React, { useState, useEffect } from "react";
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { adminService } from "../services/adminService";
import { childService } from "../services/childService";

export default function SettingsScreen({ route, navigation }: any) {
  const {
    profileId, profileType, profileName,
    currentUsername, currentEmail, currentPhone, currentAvatarColor,
  } = route.params ?? {};

  const isParent = profileType === "PARENT";

  // ── Fetched profile data for pre-filling EditProfile ──
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // ── Change PIN ────────────────────────────────────────
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isChangingPin, setIsChangingPin] = useState(false);

  // ── Delete account ────────────────────────────────────
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  // Fetch current profile data on mount so EditProfile gets pre-filled values
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isParent && profileId) {
          const data = await adminService.getParent(profileId);
          setProfileData(data);
        } else {
          // Child: data comes from the dashboard response; use passed params as fallback
          setProfileData({
            name: profileName,
            avatarColor: currentAvatarColor ?? "#4CAF50",
          });
        }
      } catch {
        // Fallback to passed params if fetch fails
        setProfileData({
          username: currentUsername,
          email: currentEmail,
          phoneNumber: currentPhone,
          avatarColor: currentAvatarColor,
          name: profileName,
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  const handleChangePin = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert("Error", "Please fill in all PIN fields."); return;
    }
    if (!/^\d{4,6}$/.test(newPin)) {
      Alert.alert("Invalid PIN", "New PIN must be 4–6 digits."); return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("Mismatch", "New PINs do not match."); return;
    }
    setIsChangingPin(true);
    try {
      if (isParent) {
        await adminService.changePin(profileId, "PARENT", currentPin, newPin);
      } else {
        await childService.changePin(profileId, currentPin, newPin);
      }
      Alert.alert("Success", "PIN updated successfully.");
      setCurrentPin(""); setNewPin(""); setConfirmPin("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsChangingPin(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "This will return to the main login screen.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out", style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("user_id");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      Alert.alert("Required", "Enter your password to confirm deletion."); return;
    }
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and ALL children and their data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: async () => {
            setIsDeletingAccount(true);
            try {
              await adminService.deleteAccount(profileId, deletePassword);
              await SecureStore.deleteItemAsync("user_id");
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } catch (e: any) {
              Alert.alert("Error", e.message);
              setIsDeletingAccount(false);
            }
          },
        },
      ]
    );
  };

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile", {
      profileId,
      profileType,
      profileName: profileData?.name ?? profileName,
      currentUsername:    profileData?.username    ?? currentUsername    ?? "",
      currentEmail:       profileData?.email       ?? currentEmail       ?? "",
      currentPhone:       profileData?.phoneNumber ?? currentPhone       ?? "",
      currentAvatarColor: profileData?.avatarColor ?? currentAvatarColor ?? "#4CAF50",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          onPress={() => { if (navigation.canGoBack()) navigation.goBack(); }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Settings</Text>
        <Text style={styles.subName}>{profileName}</Text>

        {/* Edit Profile button */}
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={navigateToEditProfile}
          disabled={isLoadingProfile}
        >
          <MaterialCommunityIcons name="account-edit" size={22} color="#FF8C00" />
          <Text style={styles.editProfileText}>Edit Profile Info</Text>
          {isLoadingProfile
            ? <ActivityIndicator size="small" color="#555" style={{ marginLeft: "auto" }} />
            : <MaterialCommunityIcons name="chevron-right" size={20} color="#555" style={{ marginLeft: "auto" }} />
          }
        </TouchableOpacity>

        {/* Change PIN */}
        <Text style={styles.sectionLabel}>CHANGE PIN</Text>

        <TextInput style={styles.input} placeholder="Current PIN"
          placeholderTextColor="#555" secureTextEntry keyboardType="numeric"
          maxLength={6} value={currentPin} onChangeText={setCurrentPin} />
        <TextInput style={styles.input} placeholder="New PIN (4–6 digits)"
          placeholderTextColor="#555" secureTextEntry keyboardType="numeric"
          maxLength={6} value={newPin} onChangeText={setNewPin} />
        <TextInput style={styles.input} placeholder="Confirm New PIN"
          placeholderTextColor="#555" secureTextEntry keyboardType="numeric"
          maxLength={6} value={confirmPin} onChangeText={setConfirmPin} />

        <TouchableOpacity
          style={[styles.btn, isChangingPin && styles.disabled]}
          onPress={handleChangePin}
          disabled={isChangingPin}
        >
          {isChangingPin
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.btnText}>UPDATE PIN</Text>
          }
        </TouchableOpacity>

        {/* Parent-only: logout + delete account */}
        {isParent && (
          <>
            <View style={styles.divider} />

            {/* Sign out */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={18} color="#ff4444" />
              <Text style={styles.logoutText}>SIGN OUT</Text>
            </TouchableOpacity>

            {/* Delete account — hidden behind a toggle to prevent accidental taps */}
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.dangerToggle}
              onPress={() => setShowDeleteSection(v => !v)}
            >
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#ff4444" />
              <Text style={styles.dangerToggleText}>
                {showDeleteSection ? "Hide" : "Delete Account"}
              </Text>
              <MaterialCommunityIcons
                name={showDeleteSection ? "chevron-up" : "chevron-down"}
                size={18} color="#ff4444"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            {showDeleteSection && (
              <View style={styles.deleteSection}>
                <Text style={styles.deleteWarning}>
                  Deleting your account is permanent and will remove all children, quests, and coin history.
                </Text>
                <TextInput
                  style={[styles.input, styles.dangerInput]}
                  placeholder="Enter your password to confirm"
                  placeholderTextColor="#663333"
                  secureTextEntry
                  value={deletePassword}
                  onChangeText={setDeletePassword}
                />
                <TouchableOpacity
                  style={[styles.deleteBtn, isDeletingAccount && styles.disabled]}
                  onPress={handleDeleteAccount}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.deleteBtnText}>DELETE MY ACCOUNT</Text>
                  }
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inner: { paddingHorizontal: 30, paddingBottom: 50 },
  backBtn: { marginTop: 10, marginBottom: 5 },
  backText: { color: "#FF8C00", fontSize: 16 },
  header: { fontSize: 26, fontWeight: "900", color: "#fff", marginBottom: 2, letterSpacing: 1 },
  subName: { color: "#555", fontSize: 13, marginBottom: 28 },
  editProfileBtn: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#111", padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#222", marginBottom: 8 },
  editProfileText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  sectionLabel: { color: "#FF8C00", fontWeight: "bold", letterSpacing: 2, fontSize: 11, marginTop: 24, marginBottom: 12 },
  input: { backgroundColor: "#111", color: "#fff", padding: 16, borderRadius: 8, fontSize: 15, borderWidth: 1, borderColor: "#222", marginBottom: 10 },
  btn: { backgroundColor: "#FF8C00", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 6 },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 15, letterSpacing: 1 },
  divider: { height: 1, backgroundColor: "#1a1a1a", marginVertical: 28 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#2a0000" },
  logoutText: { color: "#ff4444", fontWeight: "bold", fontSize: 15, letterSpacing: 1 },
  disabled: { opacity: 0.5 },
  dangerToggle: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#2a0000", backgroundColor: "#0d0000" },
  dangerToggleText: { color: "#ff4444", fontWeight: "bold", fontSize: 14 },
  deleteSection: { marginTop: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#2a0000", backgroundColor: "#0a0000" },
  deleteWarning: { color: "#884444", fontSize: 13, lineHeight: 20, marginBottom: 16 },
  dangerInput: { borderColor: "#3a1111", backgroundColor: "#110000", color: "#ff8888" },
  deleteBtn: { backgroundColor: "#8b0000", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 4 },
  deleteBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14, letterSpacing: 1 },
});
