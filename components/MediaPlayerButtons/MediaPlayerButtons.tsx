import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import {
  ICON_BACK_BUTTON,
  ICON_FORWARD_BUTTON,
  ICON_PAUSE_BUTTON,
  ICON_PLAY_BUTTON,
  ICON_STOP_BUTTON,
} from "@/constants/Icons";

const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;
const { width: DEVICE_WIDTH } = Dimensions.get("window");

interface MediaPlayerButtonsProps {
  isLoading: boolean;
  isPlaying: boolean;
  onBackPressed: () => void;
  onPlayPausePressed: () => void;
  onStopPressed: () => void;
  onForwardPressed: () => void;
}

const MediaPlayerButtons: React.FC<MediaPlayerButtonsProps> = ({
  isLoading,
  isPlaying,
  onBackPressed,
  onPlayPausePressed,
  onStopPressed,
  onForwardPressed,
}) => {
  return (
    <View
      style={[
        styles.buttonsContainerBase,
        styles.buttonsContainerTopRow,
        {
          opacity: isLoading ? DISABLED_OPACITY : 1.0,
        },
      ]}
    >
      <TouchableHighlight
        underlayColor={BACKGROUND_COLOR}
        style={styles.wrapper}
        onPress={onBackPressed}
        disabled={isLoading}
      >
        <Image style={styles.button} source={ICON_BACK_BUTTON.module} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={BACKGROUND_COLOR}
        style={styles.wrapper}
        onPress={onPlayPausePressed}
        disabled={isLoading}
      >
        <Image
          style={styles.button}
          source={
            isPlaying ? ICON_PAUSE_BUTTON.module : ICON_PLAY_BUTTON.module
          }
        />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={BACKGROUND_COLOR}
        style={styles.wrapper}
        onPress={onStopPressed}
        disabled={isLoading}
      >
        <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={BACKGROUND_COLOR}
        style={styles.wrapper}
        onPress={onForwardPressed}
        disabled={isLoading}
      >
        <Image style={styles.button} source={ICON_FORWARD_BUTTON.module} />
      </TouchableHighlight>
    </View>
  );
};

export default MediaPlayerButtons;

const styles = StyleSheet.create({
  wrapper: {},
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_PLAY_BUTTON.height,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
});
