import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MediaContext } from "@/context/MediaContext";
import Player from "../Player";
import { Colors } from "@/constants";

interface PlaylistItem {
  id: string;
  title: string;
  uri: string;
  duration: number;
}

interface TrackListProps {
  playlist: PlaylistItem[];
  selectTrack: (track: PlaylistItem) => void;
  nextTrack: () => void;
}

const TrackList: React.FC<TrackListProps> = ({
  playlist,
  selectTrack,
  nextTrack,
}) => {
  const mediaContext = React.useContext(MediaContext);

  if (!mediaContext) {
    throw new Error("MediaContext is null");
  }

  const { currentTrack } = mediaContext;

  const renderItem = ({ item }: { item: PlaylistItem }) => (
    <TouchableOpacity onPress={() => selectTrack(item)} style={{ padding: 10 }}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return currentTrack ? (
    <Player nextTrack={nextTrack} />
  ) : (
    <View style={styles.container}>
      <FlatList
        data={playlist}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default TrackList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.playerBackground,
  },
});
