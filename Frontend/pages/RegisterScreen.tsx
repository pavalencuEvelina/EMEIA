import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import { registerUser } from "../services/register_api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !phoneNumber) {
      Alert.alert(
        "Error",
        "Look again through the fields, something is missing.",
      );
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Enter a real email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(username, email, password, phoneNumber);

      Alert.alert("Success", "Account created. Now log in.", [
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

      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>
          Sign-Up WITH <Text style={styles.italic}>EMEIA</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          autoCapitalize="none"
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          secureTextEntry
          value={phoneNumber}
          autoCapitalize="none"
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>SIGN-UP</Text>
          )}
        </TouchableOpacity>

        {/* Hyperlink to Home */}
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.hyperlinkText}>
            I have an account already, take me to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FF8C00",
    textAlign: "center",
    marginBottom: 50,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1A1A1A",
    color: "#FFFFFF",
    padding: 18,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#FF8C00",
  },
  loginButton: {
    backgroundColor: "#FF8C00",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loginButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  linkContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  hyperlinkText: {
    color: "#FF8C00",
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  italic: {
    fontStyle: "italic",
    fontWeight: "200",
  },
});
