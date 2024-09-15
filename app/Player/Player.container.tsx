import React, { useState, useEffect } from "react";

import { Audio, InterruptionModeAndroid } from "expo-av";
import * as MediaLibrary from "expo-media-library";

import * as Font from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";

import Player from "./Player";
import { MediaContext } from "@/context/MediaContext";

interface PlayerContainerProps {
  nextTrack: () => void;
}

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOADING_STRING = "... loading ...";

const PlayerContainer: React.FC<PlayerContainerProps> = ({ nextTrack }) => {
  const mediaContext = React.useContext(MediaContext);

  if (!mediaContext) {
    throw new Error("MediaContext is null");
  }

  const { currentTrack, setCurrentTrack } = mediaContext;

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [playbackInstance, setPlaybackInstance] = useState<Audio.Sound | null>(
    null
  );
  //   const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [state, setState] = useState({
    playbackInstanceName: LOADING_STRING,
    loopingType: LOOPING_TYPE_ALL,
    muted: false,
    playbackInstancePosition: null as number | null,
    playbackInstanceDuration: null as number | null,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    isLoading: true,
    fontLoaded: false,
    shouldCorrectPitch: true,
    volume: 1.0,
    rate: 1.0,
    poster: false,
    useNativeControls: false,
    fullscreen: false,
    throughEarpiece: false,
  });

  useEffect(() => {
    const initializeAudio = async () => {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
      });

      await Font.loadAsync({
        ...MaterialIcons.font,
        "cutive-mono-regular": require("../../assets/fonts/CutiveMono-Regular.ttf"),
      });

      setState((prevState) => ({ ...prevState, fontLoaded: true }));
      loadNewPlaybackInstance(false);
    };

    const requestPermissions = async () => {
      const { status } = await requestPermission();
      if (status === "granted") {
        initializeAudio();
      } else {
        console.error("Permission to access media library is required!");
      }
    };

    requestPermissions();
  }, []);

  const loadNewPlaybackInstance = async (playing: boolean) => {
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      setPlaybackInstance(null);
    }

    const source = { uri: currentTrack.uri };
    const initialStatus = {
      shouldPlay: playing,
      rate: state.rate,
      shouldCorrectPitch: state.shouldCorrectPitch,
      volume: state.volume,
      isMuted: state.muted,
      isLooping: state.loopingType === LOOPING_TYPE_ONE,
    };

    const { sound } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      onPlaybackStatusUpdate
    );
    setPlaybackInstance(sound);

    updateScreenForLoading(false);
  };

  const updateScreenForLoading = (isLoading: boolean) => {
    if (isLoading) {
      setState((prevState) => ({
        ...prevState,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        playbackInstanceName: currentTrack.title,
        isLoading: false,
      }));
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setState((prevState) => ({
        ...prevState,
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch,
      }));
      if (status.didJustFinish && !status.isLooping) {
        nextTrack();
        updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  const updatePlaybackInstanceForIndex = async (playing: boolean) => {
    updateScreenForLoading(true);
    loadNewPlaybackInstance(playing);
  };

  const backToTrackList = () => {
    if (playbackInstance) {
      playbackInstance.stopAsync();
    }

    setCurrentTrack(null);
  };

  return (
    <Player
      fontLoaded={state.fontLoaded}
      isLoading={state.isLoading}
      isPlaying={state.isPlaying}
      isBuffering={state.isBuffering}
      shouldPlay={state.shouldPlay}
      playbackInstance={playbackInstance}
      playbackInstanceName={state.playbackInstanceName}
      playbackInstancePosition={state.playbackInstancePosition}
      playbackInstanceDuration={state.playbackInstanceDuration}
      advanceIndex={nextTrack}
      updatePlaybackInstanceForIndex={updatePlaybackInstanceForIndex}
      muted={state.muted}
      setState={setState}
      throughEarpiece={state.throughEarpiece}
      rate={state.rate}
      shouldCorrectPitch={state.shouldCorrectPitch}
      loopingType={state.loopingType}
      LOOPING_TYPE_ONE={LOOPING_TYPE_ONE}
      backToTrackList={backToTrackList}
    />
  );
};

export default PlayerContainer;
