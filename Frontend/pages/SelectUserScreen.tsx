import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const PROFILES = [
  { id: "1", name: "Parent (Admin)", type: "PARENT" },
  { id: "2", name: "Aman Ali", type: "CHILD" },
  { id: "3", name: "Abderrahman", type: "CHILD" },
  { id: "4", name: "Husam ad-Din or Ikhtiyar al-Din", type: "CHILD" },
  { id: "5", name: "Hamdi", type: "CHILD" },
  { id: "6", name: "Inayatullah", type: "CHILD" },
  { id: "7", name: "Ahmad", type: "CHILD" },
  { id: "8", name: "Izz al-Din", type: "CHILD" },
  { id: "9", name: "Ali Reza", type: "CHILD" },
  { id: "10", name: "Fouzan", type: "CHILD" },
];

export default function ProfilePicker({ navigation }: any) {
  const renderProfile = ({ item }: any) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => navigation.navigate("ProfileLogin", { user: item })}
    >
      <View
        style={[
          styles.avatar,
          item.type === "PARENT" ? styles.parentBorder : styles.childBorder,
        ]}
      >
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <Text style={styles.profileName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Who is using the app?</Text>
      <FlatList
        data={PROFILES}
        renderItem={renderProfile}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 20,
  },
  listContainer: { paddingHorizontal: 20 },
  profileCard: { margin: 20, alignItems: "center" },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  parentBorder: { borderWidth: 2, borderColor: "#FF8C00" }, // Orange for Admin
  childBorder: { borderWidth: 2, borderColor: "#444" },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  profileName: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
    maxWidth: 100,
    textAlign: "center",
  },
});
