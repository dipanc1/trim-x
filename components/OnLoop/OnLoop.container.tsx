import React from "react";
import OnLoop from "./OnLoop";

interface OnLoopContainerProps {
  playbackInstance: any;
  loopingType: number;
  LOOPING_TYPE_ONE: number;
}

const OnLoopContainer: React.FC<OnLoopContainerProps> = ({
  playbackInstance,
  loopingType,
  LOOPING_TYPE_ONE,
}) => {
  const onLoopPressed = () => {
    if (playbackInstance) {
      playbackInstance.setIsLoopingAsync(loopingType !== LOOPING_TYPE_ONE);
    }
  };

  return <OnLoop onLoopPressed={onLoopPressed} loopingType={loopingType} />;
};

export default OnLoopContainer;
