import React from "react";
import Seekbar from "./Seekbar";

interface SeekbarComponentProps {
  isLoading: boolean;
  isBuffering: boolean;
  playbackInstance: any;
  playbackInstancePosition: number | null;
  playbackInstanceDuration: number | null;
  shouldPlay: boolean;
}

const SeekbarComponent: React.FC<SeekbarComponentProps> = ({
  isLoading,
  isBuffering,
  playbackInstance,
  playbackInstancePosition,
  playbackInstanceDuration,
  shouldPlay,
}) => {
  const [isSeeking, setIsSeeking] = React.useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] =
    React.useState(false);

  const onSeekSliderValueChange = (value: number) => {
    if (playbackInstance && !isSeeking) {
      setIsSeeking(true);
      setShouldPlayAtEndOfSeek(shouldPlay);
      playbackInstance.pauseAsync();
    }
  };

  const onSeekSliderSlidingComplete = async (value: number) => {
    if (playbackInstance) {
      setIsSeeking(false);
      const seekPosition = value * (playbackInstanceDuration || 0);
      if (shouldPlayAtEndOfSeek) {
        playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  const getSeekSliderPosition = () => {
    if (
      playbackInstance &&
      playbackInstancePosition &&
      playbackInstanceDuration
    ) {
      return playbackInstancePosition / playbackInstanceDuration;
    }
    return 0;
  };

  const getMMSSFromMillis = (millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  };

  const getTimestamp = () => {
    if (
      playbackInstance &&
      playbackInstancePosition &&
      playbackInstanceDuration
    ) {
      return `${getMMSSFromMillis(
        playbackInstancePosition
      )} / ${getMMSSFromMillis(playbackInstanceDuration)}`;
    }
    return "";
  };
  return (
    <Seekbar
      isLoading={isLoading}
      isBuffering={isBuffering}
      getSeekSliderPosition={getSeekSliderPosition}
      onSeekSliderValueChange={onSeekSliderValueChange}
      onSeekSliderSlidingComplete={onSeekSliderSlidingComplete}
      getTimestamp={getTimestamp}
    />
  );
};

export default SeekbarComponent;
