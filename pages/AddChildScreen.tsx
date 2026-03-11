import React, { useState } from "react";
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { adminService } from "../services/adminService";

const AVATAR_COLORS = [
  "#FF8C00", "#4CAF50", "#2196F3", "#9C27B0",
  "#F44336", "#00BCD4", "#FF5722", "#607D8B",
];

export default function AddChildScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[1]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter the child's name.");
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      Alert.alert("Invalid PIN", "PIN must be 4–6 digits.");
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert("Mismatch", "PINs do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const parentId = await SecureStore.getItemAsync("user_id");
      if (!parentId) throw new Error("Session expired. Please log in again.");

      await adminService.addChild(parentId, name.trim(), pin, selectedColor);
      Alert.alert("Done!", `${name} has been added to your family.`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Add Child</Text>

        {/* Avatar preview */}
        <View style={[styles.avatarPreview, { backgroundColor: selectedColor }]}>
          <Text style={styles.avatarLetter}>{name ? name[0].toUpperCase() : "?"}</Text>
        </View>

        {/* Color picker */}
        <Text style={styles.label}>AVATAR COLOR</Text>
        <View style={styles.colorRow}>
          {AVATAR_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                selectedColor === color && styles.colorDotSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <Text style={styles.label}>CHILD INFO</Text>
        <TextInput
          style={styles.input}
          placeholder="Child's Name *"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>PROFILE PIN</Text>
        <Text style={styles.hint}>The child will use this to unlock their profile</Text>
        <TextInput
          style={styles.input}
          placeholder="PIN * (4–6 digits)"
          placeholderTextColor="#888"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          value={pin}
          onChangeText={setPin}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm PIN *"
          placeholderTextColor="#888"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          value={confirmPin}
          onChangeText={setConfirmPin}
        />

        <TouchableOpacity style={styles.btn} onPress={handleAdd} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>ADD CHILD</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inner: { paddingHorizontal: 30, paddingBottom: 40 },
  backBtn: { marginTop: 10, marginBottom: 5 },
  backText: { color: "#FF8C00", fontSize: 16 },
  header: { fontSize: 28, fontWeight: "900", color: "#fff", marginBottom: 24, letterSpacing: 1 },
  avatarPreview: {
    width: 90, height: 90, borderRadius: 12,
    alignSelf: "center", justifyContent: "center",
    alignItems: "center", marginBottom: 20,
  },
  avatarLetter: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  label: { color: "#FF8C00", fontWeight: "bold", letterSpacing: 2, fontSize: 12, marginTop: 20, marginBottom: 10 },
  hint: { color: "#666", fontSize: 12, marginBottom: 10, marginTop: -6 },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 4 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  colorDotSelected: { borderWidth: 3, borderColor: "#fff" },
  input: { backgroundColor: "#1A1A1A", color: "#FFF", padding: 18, borderRadius: 8, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: "#333" },
  btn: { backgroundColor: "#FF8C00", padding: 18, borderRadius: 8, alignItems: "center", marginTop: 24, elevation: 8 },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 18, letterSpacing: 1 },
});
