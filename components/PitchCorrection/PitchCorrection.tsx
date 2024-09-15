import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React from "react";
import { Colors } from "@/constants";

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
      underlayColor={Colors.playerBackground}
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
    backgroundColor: Colors.playerBackground,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
});
