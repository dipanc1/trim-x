import { View, StyleSheet } from "react-native";
import TrackList from "./TrackList";
import { MediaContextProvider } from "@/context/MediaContext";

export default function HomeScreen() {
  return (
    <MediaContextProvider>
      <View style={styles.container}>
        <TrackList />
      </View>
    </MediaContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
