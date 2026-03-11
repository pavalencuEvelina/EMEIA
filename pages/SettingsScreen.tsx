import React, { useState } from "react";
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
  const { profileId, profileType, profileName,
    currentUsername, currentEmail, currentPhone, currentAvatarColor,
  } = route.params ?? {};

  const isParent = profileType === "PARENT";

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isChangingPin, setIsChangingPin] = useState(false);

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
          onPress={() => navigation.navigate("EditProfile", {
            profileId, profileType, profileName,
            currentUsername, currentEmail, currentPhone, currentAvatarColor,
          })}
        >
          <MaterialCommunityIcons name="account-edit" size={22} color="#FF8C00" />
          <Text style={styles.editProfileText}>Edit Profile Info</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#555" style={{ marginLeft: "auto" }} />
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

        {/* Logout — parents only */}
        {isParent && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={18} color="#ff4444" />
              <Text style={styles.logoutText}>SIGN OUT</Text>
            </TouchableOpacity>
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

  editProfileBtn: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#111", padding: 16, borderRadius: 10,
    borderWidth: 1, borderColor: "#222", marginBottom: 8,
  },
  editProfileText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  sectionLabel: { color: "#FF8C00", fontWeight: "bold", letterSpacing: 2, fontSize: 11, marginTop: 24, marginBottom: 12 },
  input: { backgroundColor: "#111", color: "#fff", padding: 16, borderRadius: 8, fontSize: 15, borderWidth: 1, borderColor: "#222", marginBottom: 10 },
  btn: { backgroundColor: "#FF8C00", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 6 },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 15, letterSpacing: 1 },
  divider: { height: 1, backgroundColor: "#1a1a1a", marginVertical: 28 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#2a0000" },
  logoutText: { color: "#ff4444", fontWeight: "bold", fontSize: 15, letterSpacing: 1 },
  disabled: { opacity: 0.5 },
});
