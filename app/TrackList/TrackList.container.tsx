import React from "react";
import * as MediaLibrary from "expo-media-library";
import TrackList from "./TrackList";
import { MediaContext } from "@/context/MediaContext";

interface PlaylistItem {
  id: string;
  title: string;
  uri: string;
  duration: number;
}

const TrackListContainer = () => {
  const [playlist, setPlaylist] = React.useState<PlaylistItem[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const mediaContext = React.useContext(MediaContext);

  if (!mediaContext) {
    throw new Error("MediaContext is null");
  }

  const { setCurrentTrack } = mediaContext;

  React.useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await requestPermission();
      if (status === "granted") {
        await loadPlaylist();
      } else {
        console.error("Permission to access media library is required!");
      }
    };

    requestPermissions();
  }, []);

  const loadPlaylist = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 10, // Adjust this number based on your needs
      });

      const newPlaylist = media.assets
        .filter((asset) => asset.filename.endsWith(".mp3"))
        .map((asset) => ({
          id: asset.id,
          title: asset.filename,
          uri: asset.uri,
          duration: asset.duration,
        }));

      setPlaylist(newPlaylist);
    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  };

  const selectTrack = (track: PlaylistItem) => {
    console.log("Selected track:", track);
    setCurrentTrack(track);
  };

  return <TrackList playlist={playlist} selectTrack={selectTrack} />;
};

export default TrackListContainer;
