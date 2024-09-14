import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import { ICON_THUMB_1, ICON_TRACK_1 } from "@/constants/Icons";

interface SeekbarProps {
  isLoading: boolean;
  isBuffering: boolean;
  playbackInstance: any;
  playbackInstancePosition: number | null;
  playbackInstanceDuration: number | null;
  shouldPlay: boolean;
}

const BUFFERING_STRING = "...buffering...";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;

const Seekbar: React.FC<SeekbarProps> = ({
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
    if (playbackInstance != null && !isSeeking) {
      setIsSeeking(true);
      setShouldPlayAtEndOfSeek(shouldPlay);
      playbackInstance.pauseAsync();
    }
  };

  const onSeekSliderSlidingComplete = async (value: number) => {
    if (playbackInstance != null) {
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
      playbackInstance != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
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
      playbackInstance != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return `${getMMSSFromMillis(
        playbackInstancePosition
      )} / ${getMMSSFromMillis(playbackInstanceDuration)}`;
    }
    return "";
  };
  
  return (
    <View
      style={[
        styles.playbackContainer,
        {
          opacity: isLoading ? DISABLED_OPACITY : 1.0,
        },
      ]}
    >
      <Slider
        style={styles.playbackSlider}
        trackImage={ICON_TRACK_1.module}
        thumbImage={ICON_THUMB_1.module}
        value={getSeekSliderPosition()}
        onValueChange={onSeekSliderValueChange}
        onSlidingComplete={onSeekSliderSlidingComplete}
        disabled={isLoading}
      />
      <View style={styles.timestampRow}>
        <Text
          style={[
            styles.text,
            styles.buffering,
            { fontFamily: "cutive-mono-regular" },
          ]}
        >
          {isBuffering ? BUFFERING_STRING : ""}
        </Text>
        <Text
          style={[
            styles.text,
            styles.timestamp,
            { fontFamily: "cutive-mono-regular" },
          ]}
        >
          {getTimestamp()}
        </Text>
      </View>
    </View>
  );
};

export default Seekbar;

const styles = StyleSheet.create({
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },

  playbackSlider: {
    alignSelf: "stretch",
  },

  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },

  timestampRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    minHeight: FONT_SIZE,
  },

  buffering: {
    textAlign: "left",
    paddingLeft: 20,
  },

  timestamp: {
    textAlign: "right",
    paddingRight: 20,
  },
});
