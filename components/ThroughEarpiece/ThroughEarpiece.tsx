import { TouchableHighlight } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";

const ICON_THROUGH_EARPIECE = "speaker-phone";
const ICON_THROUGH_SPEAKER = "speaker";

interface ThroughEarpieceProps {
  onSpeakerPressed: () => void;
  throughEarpiece: boolean;
}

const ThroughEarpiece: React.FC<ThroughEarpieceProps> = ({
  onSpeakerPressed,
  throughEarpiece,
}) => {
  return (
    <TouchableHighlight
      onPress={onSpeakerPressed}
      underlayColor={Colors.playerBackground}
    >
      <MaterialIcons
        name={throughEarpiece ? ICON_THROUGH_EARPIECE : ICON_THROUGH_SPEAKER}
        size={32}
        color="black"
      />
    </TouchableHighlight>
  );
};

export default ThroughEarpiece;

// const styles = StyleSheet.create({});
