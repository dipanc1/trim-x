import React from "react";
import Trim from "./Trim";

interface TrimContainerProps {
  toggleTrimTrack: () => void;
}

const TrimContainer = ({ toggleTrimTrack }: TrimContainerProps) => {
  return <Trim toggleTrimTrack={toggleTrimTrack} />;
};

export default TrimContainer;
