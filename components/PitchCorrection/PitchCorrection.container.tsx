import React from "react";
import PitchCorrection from "./PitchCorrection";

interface PitchCorrectionContainerProps {
  playbackInstance: any;
  rate: number;
  shouldCorrectPitch: boolean;
}

const PitchCorrectionContainer: React.FC<PitchCorrectionContainerProps> = ({
  playbackInstance,
  rate,
  shouldCorrectPitch,
}) => {
  
  const trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
    if (playbackInstance) {
      try {
        await playbackInstance.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  const onPitchCorrectionPressed = async () => {
    trySetRate(rate, !shouldCorrectPitch);
  };
  
  return (
    <PitchCorrection
      onPitchCorrectionPressed={onPitchCorrectionPressed}
      shouldCorrectPitch={shouldCorrectPitch}
    />
  );
};

export default PitchCorrectionContainer;
