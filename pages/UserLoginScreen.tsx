import React, { useState } from "react";
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from "../services/apiUtils";

const API_BASE = "https://emeia.infinityfree.me/my-api";

export default function ProfileLoginScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async () => {
    if (!pin) { Alert.alert("Required", "Please enter your PIN."); return; }

    setIsLoading(true);
    try {
      const { response, data: result } = await apiFetch(`${API_BASE}/profile_login.php`, {
        method: "POST",
        body: new URLSearchParams({ profileId: user.id, profileType: user.type, password: pin }),
      });

      if (response.ok && result.success) {
        if (user.type === "PARENT") {
          navigation.reset({ index: 0, routes: [{ name: "MainAppAdminScreen" }] });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "ChildDashboardScreen", params: { childId: user.id, childName: user.name, isAdmin: false } }],
          });
        }
      } else {
        Alert.alert("Access Denied", result.message || "Incorrect PIN.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Could not reach server. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.avatar, { borderColor: user.type === "PARENT" ? "#FF8C00" : (user.avatarColor || "#444") }]}>
          <Text style={styles.avatarLetter}>{user.name[0].toUpperCase()}</Text>
        </View>

        <Text style={styles.welcome}>Welcome, {user.name}</Text>
        <Text style={styles.instruction}>Enter your PIN to unlock</Text>

        <TextInput
          style={styles.input}
          placeholder="· · · ·"
          placeholderTextColor="#444"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          value={pin}
          onChangeText={setPin}
          autoFocus
        />

        <TouchableOpacity style={styles.btn} onPress={handleUnlock} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>UNLOCK</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SelectUser")} style={styles.back}>
          <Text style={styles.backText}>Not you? Switch profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  avatar: { width: 110, height: 110, backgroundColor: "#1A1A1A", borderRadius: 16, borderWidth: 3, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  avatarLetter: { color: "#fff", fontSize: 48, fontWeight: "bold" },
  welcome: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 4, textAlign: "center" },
  instruction: { color: "#555", fontSize: 13, marginBottom: 32 },
  input: { width: "100%", backgroundColor: "#111", color: "#fff", padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#222", fontSize: 28, textAlign: "center", marginBottom: 20, letterSpacing: 12 },
  btn: { width: "100%", backgroundColor: "#FF8C00", padding: 16, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 16, letterSpacing: 1 },
  back: { marginTop: 24 },
  backText: { color: "#FF8C00", fontSize: 14, textDecorationLine: "underline" },
});
