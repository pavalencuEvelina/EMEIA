import React, { useState } from "react";
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, StatusBar, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import * as SecureStore from "expo-secure-store";
import { loginUser } from "../services/login_api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await loginUser(login.trim(), password);
      if (data.success) {
        await SecureStore.setItemAsync("user_id", String(data.user.id));
        navigation.replace("SelectUser");
      }
    } catch (error: any) {
      Alert.alert("Access Denied", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.inner}>
        <Text style={styles.header}>
          Welcome to <Text style={styles.italic}>EMEIA</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor="#888"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>LOGIN</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  header: { fontSize: 32, fontWeight: "900", color: "#FF8C00", textAlign: "center", marginBottom: 50, letterSpacing: 3, textTransform: "uppercase" },
  italic: { fontStyle: "italic", fontWeight: "200" },
  input: { backgroundColor: "#1A1A1A", color: "#FFF", padding: 18, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: "#FF8C00" },
  btn: { backgroundColor: "#FF8C00", padding: 18, borderRadius: 8, alignItems: "center", marginTop: 20, elevation: 8 },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 18, letterSpacing: 1 },
  link: { marginTop: 25, alignItems: "center" },
  linkText: { color: "#FF8C00", fontSize: 14, textDecorationLine: "underline", fontWeight: "600" },
});
