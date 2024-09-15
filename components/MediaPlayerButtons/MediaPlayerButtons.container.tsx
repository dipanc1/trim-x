import React from "react";
import MediaPlayerButtons from "./MediaPlayerButtons";

interface MediaPlayerButtonsContainerProps {
  isLoading: boolean;
  isPlaying: boolean;
  shouldPlay: boolean;
  playbackInstance: any;
  advanceIndex: (forward: boolean) => void;
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
  const onBackPressed = () => {
    if (playbackInstance) {
      advanceIndex(false);
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
      advanceIndex(true);
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
    />
  );
};

export default MediaPlayerButtonsContainer;
