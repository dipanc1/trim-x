import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import React from "react";
import {
  ICON_LOOP_ALL_BUTTON,
  ICON_LOOP_ONE_BUTTON,
  ICON_PLAY_BUTTON,
} from "@/constants/Icons";

const BACKGROUND_COLOR = "#FFF8ED";
const LOOPING_TYPE_ICONS = { 0: ICON_LOOP_ALL_BUTTON, 1: ICON_LOOP_ONE_BUTTON };

const { width: DEVICE_WIDTH } = Dimensions.get("window");

interface OnLoopProps {
  onLoopPressed: () => void;
  loopingType: number;
}

const OnLoop: React.FC<OnLoopProps> = ({ onLoopPressed, loopingType }) => {
  return (
    <TouchableHighlight
      underlayColor={BACKGROUND_COLOR}
      style={styles.wrapper}
      onPress={onLoopPressed}
    >
      <Image
        style={styles.button}
        source={
          LOOPING_TYPE_ICONS[loopingType as keyof typeof LOOPING_TYPE_ICONS]
            .module
        }
      />
    </TouchableHighlight>
  );
};

export default OnLoop;

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
