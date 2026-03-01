import React, { useState } from "react";
// Importăm componentele specifice React Native (nu div-uri!)
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

// Definim tipurile pentru Props-urile acestui ecran
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.paragraph}>Log-In Page</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Login attempt with:", email)}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// AICI DEFINEȘTI "styles" - Fără asta primești eroarea respectivă
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1", // Fundal negru, stil "dark mode"
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: "#ffffff",
    color: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#fff", // Buton alb pe fundal negru (contrast puternic)
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  paragraph: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2c2c2c",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 2,
  },
});
