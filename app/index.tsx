import { View, StyleSheet } from "react-native";
import Player from "./Player";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Player />
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
