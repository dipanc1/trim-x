import React, { useState, useEffect } from "react";

import { Audio, InterruptionModeAndroid } from "expo-av";
import * as MediaLibrary from "expo-media-library";

import * as Font from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";

import Player from "./Player";

class PlaylistItem {
  name: string;
  uri: string;
  isVideo: boolean;

  constructor(name: string, uri: string, isVideo: boolean) {
    this.name = name;
    this.uri = uri;
    this.isVideo = isVideo;
  }
}

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOADING_STRING = "... loading ...";

const PlayerContainer = () => {
  const [index, setIndex] = useState(0);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [playbackInstance, setPlaybackInstance] = useState<Audio.Sound | null>(
    null
  );
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
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
      await loadPlaylist();
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

  const loadPlaylist = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 1000, // Adjust this number based on your needs
      });

      const newPlaylist = media.assets
        .filter((asset) => asset.filename.endsWith(".mp3"))
        .map((asset) => {
          return new PlaylistItem(asset.filename, asset.uri, false);
        });

      setPlaylist(newPlaylist);
    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  };

  const loadNewPlaybackInstance = async (playing: boolean) => {
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      setPlaybackInstance(null);
    }

    const source = { uri: playlist[index].uri };
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
        playbackInstanceName: playlist[index].name,
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
        advanceIndex(true);
        updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  const advanceIndex = (forward: boolean) => {
    setIndex((index + (forward ? 1 : playlist.length - 1)) % playlist.length);
  };

  const updatePlaybackInstanceForIndex = async (playing: boolean) => {
    updateScreenForLoading(true);
    loadNewPlaybackInstance(playing);
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
      advanceIndex={advanceIndex}
      updatePlaybackInstanceForIndex={updatePlaybackInstanceForIndex}
      muted={state.muted}
      setState={setState}
      throughEarpiece={state.throughEarpiece}
      rate={state.rate}
      shouldCorrectPitch={state.shouldCorrectPitch}
      loopingType={state.loopingType}
      LOOPING_TYPE_ONE={LOOPING_TYPE_ONE}
    />
  );
};

export default PlayerContainer;
