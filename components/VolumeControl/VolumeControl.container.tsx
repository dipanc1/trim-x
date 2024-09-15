import React from "react";
import VolumeControl from "./VolumeControl";

interface VolumeControlContainerProps {
  muted: boolean;
  playbackInstance: any;
}

const VolumeControlContainer: React.FC<VolumeControlContainerProps> = ({
  muted,
  playbackInstance,
}) => {
  const onMutePressed = () => {
    if (playbackInstance) {
      playbackInstance.setIsMutedAsync(!muted);
    }
  };

  const onVolumeSliderValueChange = (value: number) => {
    if (playbackInstance) {
      playbackInstance.setVolumeAsync(value);
    }
  };

  return (
    <VolumeControl
      muted={muted}
      onMutePressed={onMutePressed}
      onVolumeSliderValueChange={onVolumeSliderValueChange}
    />
  );
};

export default VolumeControlContainer;
