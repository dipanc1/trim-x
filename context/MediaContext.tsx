import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface MediaContextType {
  currentTrack: any;
  setCurrentTrack: Dispatch<SetStateAction<any | null>>;
}

const MediaContext = createContext<MediaContextType | null>(null);

interface MediaContextProviderProps {
  children: ReactNode;
}

const MediaContextProvider = ({ children }: MediaContextProviderProps) => {
  const [currentTrack, setCurrentTrack] = useState(null);

  const updateCurrentTrack = (track: any) => {
    setCurrentTrack(track);
  };

  return (
    <MediaContext.Provider
      value={{ currentTrack, setCurrentTrack: updateCurrentTrack }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export { MediaContext, MediaContextProvider };
