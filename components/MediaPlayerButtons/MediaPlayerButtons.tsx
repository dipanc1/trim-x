import {
  Dimensions,
  Image,
  StyleSheet,
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
} from "@/constants";
import { Colors } from "@/constants";


const DISABLED_OPACITY = 0.5;
const { width: DEVICE_WIDTH } = Dimensions.get("window");

interface MediaPlayerButtonsProps {
  isLoading: boolean;
  isPlaying: boolean;
  onBackPressed: () => void;
  onPlayPausePressed: () => void;
  onStopPressed: () => void;
  onForwardPressed: () => void;
  firstTrack: boolean;
  lastTrack: boolean;
}

const MediaPlayerButtons: React.FC<MediaPlayerButtonsProps> = ({
  isLoading,
  isPlaying,
  onBackPressed,
  onPlayPausePressed,
  onStopPressed,
  onForwardPressed,
  firstTrack,
  lastTrack,
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
        underlayColor={Colors.playerBackground}
        style={styles.wrapper}
        onPress={onBackPressed}
        disabled={isLoading || firstTrack}
      >
        <Image style={styles.button} source={ICON_BACK_BUTTON.module} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={Colors.playerBackground}
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
        underlayColor={Colors.playerBackground}
        style={styles.wrapper}
        onPress={onStopPressed}
        disabled={isLoading}
      >
        <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={Colors.playerBackground}
        style={styles.wrapper}
        onPress={onForwardPressed}
        disabled={isLoading || lastTrack}
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
    backgroundColor: Colors.playerBackground,
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_PLAY_BUTTON.height,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
});
