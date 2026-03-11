import React, { useState } from "react";
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { adminService } from "../services/adminService";
import { childService } from "../services/childService";

const AVATAR_COLORS = [
  "#FF8C00", "#4CAF50", "#2196F3", "#9C27B0",
  "#F44336", "#00BCD4", "#FF5722", "#607D8B",
];

type Props = {
  route: {
    params: {
      profileId: string;
      profileType: "PARENT" | "CHILD";
      profileName: string;
      // Pre-fill values:
      currentUsername?: string;
      currentEmail?: string;
      currentPhone?: string;
      currentAvatarColor?: string;
    };
  };
  navigation: any;
};

export default function EditProfileScreen({ route, navigation }: Props) {
  const {
    profileId, profileType, profileName,
    currentUsername = "", currentEmail = "",
    currentPhone = "", currentAvatarColor = "#4CAF50",
  } = route.params;

  const isParent = profileType === "PARENT";

  // Parent fields
  const [username, setUsername] = useState(currentUsername);
  const [email, setEmail] = useState(currentEmail);
  const [phone, setPhone] = useState(currentPhone);

  // Password change (parent only)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Child fields
  const [name, setName] = useState(profileName);
  const [avatarColor, setAvatarColor] = useState(currentAvatarColor);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      if (isParent) {
        if (!username || !email) {
          Alert.alert("Error", "Username and email are required."); return;
        }
        await adminService.changeProfile(profileId, username, email, phone);
      } else {
        if (!name.trim()) {
          Alert.alert("Error", "Name is required."); return;
        }
        await childService.changeProfile(profileId, name.trim(), avatarColor);
      }
      Alert.alert("Saved", "Your profile has been updated.", [
        {
          text: "OK",
          onPress: () => {
            if (navigation.canGoBack()) navigation.goBack();
          },
        },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Fill in all password fields."); return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters."); return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match."); return;
    }
    setIsSavingPassword(true);
    try {
      await adminService.changePassword(profileId, currentPassword, newPassword);
      Alert.alert("Done", "Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsSavingPassword(false);
    }
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

        <Text style={styles.header}>Edit Profile</Text>

        {/* ── CHILD FIELDS ───────────────────────── */}
        {!isParent && (
          <>
            <Text style={styles.sectionLabel}>NAME</Text>
            <TextInput style={styles.input} placeholder="Display name"
              placeholderTextColor="#555" value={name} onChangeText={setName} />

            <Text style={styles.sectionLabel}>AVATAR COLOR</Text>
            <View style={styles.colorRow}>
              {AVATAR_COLORS.map((color) => (
                <TouchableOpacity key={color}
                  style={[styles.dot, { backgroundColor: color }, avatarColor === color && styles.dotSelected]}
                  onPress={() => setAvatarColor(color)}
                />
              ))}
            </View>
          </>
        )}

        {/* ── PARENT FIELDS ──────────────────────── */}
        {isParent && (
          <>
            <Text style={styles.sectionLabel}>USERNAME</Text>
            <TextInput style={styles.input} placeholder="Username"
              placeholderTextColor="#555" value={username}
              onChangeText={setUsername} autoCapitalize="none" />

            <Text style={styles.sectionLabel}>EMAIL</Text>
            <TextInput style={styles.input} placeholder="Email"
              placeholderTextColor="#555" value={email}
              onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

            <Text style={styles.sectionLabel}>PHONE NUMBER</Text>
            <TextInput style={styles.input} placeholder="Phone (optional)"
              placeholderTextColor="#555" value={phone}
              onChangeText={setPhone} keyboardType="phone-pad" />
          </>
        )}

        <TouchableOpacity
          style={[styles.btn, isSavingProfile && styles.disabled]}
          onPress={handleSaveProfile}
          disabled={isSavingProfile}
        >
          {isSavingProfile
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.btnText}>SAVE CHANGES</Text>
          }
        </TouchableOpacity>

        {/* ── PASSWORD (parent only) ─────────────── */}
        {isParent && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>CHANGE PASSWORD</Text>

            <TextInput style={styles.input} placeholder="Current password"
              placeholderTextColor="#555" secureTextEntry
              value={currentPassword} onChangeText={setCurrentPassword} />
            <TextInput style={styles.input} placeholder="New password (min 6 chars)"
              placeholderTextColor="#555" secureTextEntry
              value={newPassword} onChangeText={setNewPassword} />
            <TextInput style={styles.input} placeholder="Confirm new password"
              placeholderTextColor="#555" secureTextEntry
              value={confirmPassword} onChangeText={setConfirmPassword} />

            <TouchableOpacity
              style={[styles.btn, styles.btnOutline, isSavingPassword && styles.disabled]}
              onPress={handleChangePassword}
              disabled={isSavingPassword}
            >
              {isSavingPassword
                ? <ActivityIndicator color="#FF8C00" />
                : <Text style={[styles.btnText, { color: "#FF8C00" }]}>UPDATE PASSWORD</Text>
              }
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
  header: { fontSize: 26, fontWeight: "900", color: "#fff", marginBottom: 24, letterSpacing: 1 },
  sectionLabel: { color: "#FF8C00", fontWeight: "bold", letterSpacing: 2, fontSize: 11, marginTop: 18, marginBottom: 10 },
  input: { backgroundColor: "#111", color: "#fff", padding: 16, borderRadius: 8, fontSize: 15, borderWidth: 1, borderColor: "#222", marginBottom: 4 },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 4 },
  dot: { width: 36, height: 36, borderRadius: 18 },
  dotSelected: { borderWidth: 3, borderColor: "#fff" },
  btn: { backgroundColor: "#FF8C00", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 24 },
  btnOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#FF8C00" },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 15, letterSpacing: 1 },
  divider: { height: 1, backgroundColor: "#1a1a1a", marginTop: 32, marginBottom: 8 },
  disabled: { opacity: 0.5 },
});
