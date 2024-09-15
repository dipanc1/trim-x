import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import {
  ICON_MUTED_BUTTON,
  ICON_THUMB_2,
  ICON_TRACK_1,
  ICON_UNMUTED_BUTTON,
} from "@/constants/Icons";
import Slider from "@react-native-community/slider";

const BACKGROUND_COLOR = "#FFF8ED";
const { width: DEVICE_WIDTH } = Dimensions.get("window");

interface VolumeControlProps {
  onMutePressed: () => void;
  onVolumeSliderValueChange: (value: number) => void;
  muted: boolean;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  onMutePressed,
  onVolumeSliderValueChange,
  muted,
}) => {
  return (
    <View style={styles.volumeContainer}>
      <TouchableHighlight
        underlayColor={BACKGROUND_COLOR}
        style={styles.wrapper}
        onPress={onMutePressed}
      >
        <Image
          style={styles.button}
          source={muted ? ICON_MUTED_BUTTON.module : ICON_UNMUTED_BUTTON.module}
        />
      </TouchableHighlight>
      <Slider
        style={styles.volumeSlider}
        trackImage={ICON_TRACK_1.module}
        thumbImage={ICON_THUMB_2.module}
        value={1}
        onValueChange={onVolumeSliderValueChange}
      />
    </View>
  );
};

export default VolumeControl;

const styles = StyleSheet.create({
  wrapper: {},
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width,
  },
});
