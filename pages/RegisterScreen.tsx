import React, { useState } from "react";
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, StatusBar, Alert, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { registerUser } from "../services/register_api";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword || !pin || !confirmPin) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
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
      await registerUser(username, email, password, phoneNumber, pin);
      Alert.alert("Success!", "Account created. Now log in.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>
          Create <Text style={styles.italic}>EMEIA</Text> Account
        </Text>

        <Text style={styles.sectionLabel}>ACCOUNT INFO</Text>

        <TextInput style={styles.input} placeholder="Username *" placeholderTextColor="#888"
          value={username} onChangeText={setUsername} autoCapitalize="none" />

        <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#888"
          value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

        <TextInput style={styles.input} placeholder="Phone Number (optional)" placeholderTextColor="#888"
          value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

        <Text style={styles.sectionLabel}>PASSWORD</Text>

        <TextInput style={styles.input} placeholder="Password * (min 6 chars)" placeholderTextColor="#888"
          secureTextEntry value={password} onChangeText={setPassword} />

        <TextInput style={styles.input} placeholder="Confirm Password *" placeholderTextColor="#888"
          secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <Text style={styles.sectionLabel}>PROFILE PIN</Text>
        <Text style={styles.sectionHint}>
          Used to unlock your parent profile on the family screen
        </Text>

        <TextInput style={styles.input} placeholder="PIN * (4–6 digits)" placeholderTextColor="#888"
          secureTextEntry value={pin} onChangeText={setPin} keyboardType="numeric" maxLength={6} />

        <TextInput style={styles.input} placeholder="Confirm PIN *" placeholderTextColor="#888"
          secureTextEntry value={confirmPin} onChangeText={setConfirmPin} keyboardType="numeric" maxLength={6} />

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>CREATE ACCOUNT</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inner: { paddingHorizontal: 30, paddingTop: 20, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: "900", color: "#FF8C00", textAlign: "center", marginBottom: 30, letterSpacing: 2, textTransform: "uppercase" },
  italic: { fontStyle: "italic", fontWeight: "200" },
  sectionLabel: { color: "#FF8C00", fontWeight: "bold", letterSpacing: 2, fontSize: 12, marginTop: 20, marginBottom: 10 },
  sectionHint: { color: "#666", fontSize: 12, marginBottom: 10, marginTop: -6 },
  input: { backgroundColor: "#1A1A1A", color: "#FFF", padding: 18, borderRadius: 8, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: "#FF8C00" },
  btn: { backgroundColor: "#FF8C00", padding: 18, borderRadius: 8, alignItems: "center", marginTop: 24, elevation: 8 },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 18, letterSpacing: 1 },
  link: { marginTop: 25, alignItems: "center" },
  linkText: { color: "#FF8C00", fontSize: 14, textDecorationLine: "underline", fontWeight: "600" },
});
