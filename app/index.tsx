import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import Home from "./home";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
