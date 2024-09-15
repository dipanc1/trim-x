import React from "react";
import ThroughEarpiece from "./ThroughEarpiece";
import { Audio, InterruptionModeAndroid } from "expo-av";

interface ThroughEarpieceContainerProps {
  throughEarpiece: boolean;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const ThroughEarpieceContainer: React.FC<ThroughEarpieceContainerProps> = ({
  throughEarpiece,
  setState,
}) => {
  const onSpeakerPressed = () => {
    setState((prevState: { throughEarpiece: any; }) => {
      const newThroughEarpiece = !prevState.throughEarpiece;
      Audio.setAudioModeAsync({
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: newThroughEarpiece,
      });
      return { ...prevState, throughEarpiece: newThroughEarpiece };
    });
  };

  return (
    <ThroughEarpiece
      onSpeakerPressed={onSpeakerPressed}
      throughEarpiece={throughEarpiece}
    />
  );
};

export default ThroughEarpieceContainer;
