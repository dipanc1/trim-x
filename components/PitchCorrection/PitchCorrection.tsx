import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React from "react";

const BACKGROUND_COLOR = "#FFF8ED";
const FONT_SIZE = 14;

interface PitchCorrectionProps {
  onPitchCorrectionPressed: () => void;
  shouldCorrectPitch: boolean;
}

const PitchCorrection: React.FC<PitchCorrectionProps> = ({
  onPitchCorrectionPressed,
  shouldCorrectPitch,
}) => {
  return (
    <TouchableHighlight
      underlayColor={BACKGROUND_COLOR}
      style={styles.wrapper}
      onPress={onPitchCorrectionPressed}
    >
      <View style={styles.button}>
        <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
          PC: {shouldCorrectPitch ? "yes" : "no"}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default PitchCorrection;

const styles = StyleSheet.create({
  wrapper: {},
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
});
