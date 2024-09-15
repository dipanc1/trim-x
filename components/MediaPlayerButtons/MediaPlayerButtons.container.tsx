import React from "react";
import MediaPlayerButtons from "./MediaPlayerButtons";
import { MediaContext } from "@/context/MediaContext";

interface MediaPlayerButtonsContainerProps {
  isLoading: boolean;
  isPlaying: boolean;
  shouldPlay: boolean;
  playbackInstance: any;
  advanceIndex: () => void;
  updatePlaybackInstanceForIndex: (shouldPlay: boolean) => void;
}

const MediaPlayerButtonsContainer: React.FC<
  MediaPlayerButtonsContainerProps
> = ({
  isLoading,
  isPlaying,
  shouldPlay,
  playbackInstance,
  advanceIndex,
  updatePlaybackInstanceForIndex,
}) => {
  const mediaContext = React.useContext(MediaContext);

  if (!mediaContext) {
    throw new Error("MediaContext is null");
  }

  const { currentTrack } = mediaContext;

  const onBackPressed = () => {
    if (playbackInstance) {
      advanceIndex();
      updatePlaybackInstanceForIndex(shouldPlay);
    }
  };
  const onPlayPausePressed = () => {
    if (playbackInstance) {
      if (isPlaying) {
        playbackInstance.pauseAsync();
      } else {
        playbackInstance.playAsync();
      }
    }
  };

  const onStopPressed = () => {
    if (playbackInstance) {
      playbackInstance.stopAsync();
    }
  };

  const onForwardPressed = () => {
    if (playbackInstance) {
      advanceIndex();
      updatePlaybackInstanceForIndex(shouldPlay);
    }
  };

  return (
    <MediaPlayerButtons
      isLoading={isLoading}
      isPlaying={isPlaying}
      onBackPressed={onBackPressed}
      onPlayPausePressed={onPlayPausePressed}
      onStopPressed={onStopPressed}
      onForwardPressed={onForwardPressed}
      firstTrack={currentTrack.isFirst}
      lastTrack={currentTrack.isLast}
    />
  );
};

export default MediaPlayerButtonsContainer;
