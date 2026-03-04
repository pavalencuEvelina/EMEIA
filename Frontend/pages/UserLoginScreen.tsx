import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";

export default function ProfileLoginScreen({ route, navigation }: any) {
  // We get the profile data passed from the Picker screen
  const { user } = route.params;
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUnlock = async () => {
    if (!password) {
      Alert.alert("Required", "Entry requires a password.");
      return;
    }

    setIsLoading(true);
    try {
      // Logic: Send profileId and password to your Spring Boot /unlock endpoint
      // const result = await unlockProfile(user.id, password);

      console.log(`Unlocking profile: ${user.name}`);

      // Simulate network delay
      setTimeout(() => {
        setIsLoading(false);
        if (user.type === "PARENT")
          navigation.replace("MainAppAdminScreen"); // Move to the actual app content
        else navigation.replace("MainAppAdminScreen"); // For now, all profiles go to the same screen
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Denied", "Incorrect password for this profile.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLetter}>{user.name[0]}</Text>
        </View>

        <Text style={styles.welcomeText}>Welcome back, {user.name}</Text>
        <Text style={styles.instructionText}>
          Enter password to unlock profile
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoFocus={true} // Opens keyboard automatically for speed
        />

        <TouchableOpacity
          style={styles.unlockButton}
          onPress={handleProfileUnlock}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.unlockButtonText}>UNLOCK</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Not you? Switch Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("MainAppAdminScreen")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            (Temporary) go to MainAppAdminScreen
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FF8C00", // Our signature orange
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  instructionText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#111",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 18,
    textAlign: "center", // Windows-style centered password input
    marginBottom: 20,
  },
  unlockButton: {
    width: "100%",
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  unlockButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 25,
  },
  backButtonText: {
    color: "#FF8C00",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
