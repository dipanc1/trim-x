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
        first: 1000, // TODO: Implement pagination
      });

      const newPlaylist = media.assets
        .filter((asset) => asset.filename.endsWith(".mp3"))
        .map((asset, index, array) => ({
          id: asset.id,
          title: asset.filename,
          uri: asset.uri,
          duration: asset.duration,
          isFirst: index === 0,
          isLast: index === array.length - 1,
          length: array.length,
        }));

      setPlaylist(newPlaylist);
    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  };

  const nextTrack = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === mediaContext.currentTrack.id
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= playlist.length) {
      return;
    }
    
    const nextTrack = playlist[nextIndex];

    setCurrentTrack(nextTrack);
  };

  return <TrackList playlist={playlist} nextTrack={nextTrack} />;
};

export default TrackListContainer;
