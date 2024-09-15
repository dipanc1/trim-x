import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import { Audio, InterruptionModeAndroid } from "expo-av";
import * as FileSystem from "expo-file-system";

import * as Font from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";

import {
  ICON_LOOP_ALL_BUTTON,
  ICON_LOOP_ONE_BUTTON,
  ICON_MUTED_BUTTON,
} from "@/constants/Icons";

import Seekbar from "@/components/Seekbar";
import { MediaPlayerButtons, OnLoop, VolumeControl } from "@/components";

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

const PLAYLIST = [
  new PlaylistItem(
    "Comfort Fit - “Sorry”",
    "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3",
    false
  ),
  new PlaylistItem(
    "Mildred Bailey – “All Of Me”",
    "https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3",
    false
  ),
  new PlaylistItem(
    "Podington Bear - “Rubber Robot”",
    "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3",
    false
  ),
];

const ICON_THROUGH_EARPIECE = "speaker-phone";
const ICON_THROUGH_SPEAKER = "speaker";

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const { width: DEVICE_WIDTH } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";

const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";

const Home: React.FC = () => {
  const [index, setIndex] = useState(0);
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
      // await loadPlaylist();
      loadNewPlaybackInstance(false);
    };

    initializeAudio();
  }, []);

  const loadPlaylist = async () => {
    try {
      let mp3Files: { name: string; uri: string }[] = [];
      if (FileSystem.documentDirectory) {
        mp3Files = await scanDirectory(FileSystem.documentDirectory);
      } else {
        console.error("FileSystem.documentDirectory is null");
      }
      const newPlaylist = mp3Files.map((file) => {
        return new PlaylistItem(file.name, file.uri, false);
      });
      setPlaylist(newPlaylist);
    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  };

  const scanDirectory = async (
    directory: string
  ): Promise<{ name: string; uri: string }[]> => {
    let mp3Files: { name: string; uri: string }[] = [];
    const files = await FileSystem.readDirectoryAsync(directory);

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(directory + file);
      if (fileInfo.isDirectory) {
        const nestedFiles = await scanDirectory(directory + file + "/");
        mp3Files = mp3Files.concat(nestedFiles);
      } else if (file.endsWith(".mp3")) {
        mp3Files.push({ name: file, uri: directory + file });
      }
    }

    return mp3Files;
  };

  const loadNewPlaybackInstance = async (playing: boolean) => {
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      setPlaybackInstance(null);
    }

    const source = { uri: PLAYLIST[index].uri };
    const initialStatus = {
      shouldPlay: playing,
      rate: state.rate,
      shouldCorrectPitch: state.shouldCorrectPitch,
      volume: state.volume,
      isMuted: state.muted,
      isLooping: state.loopingType === LOOPING_TYPE_ONE,
    };

    const { sound, status } = await Audio.Sound.createAsync(
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
        playbackInstanceName: PLAYLIST[index].name,
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
    setIndex((index + (forward ? 1 : PLAYLIST.length - 1)) % PLAYLIST.length);
  };

  const updatePlaybackInstanceForIndex = async (playing: boolean) => {
    updateScreenForLoading(true);
    loadNewPlaybackInstance(playing);
  };

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
    trySetRate(state.rate, !state.shouldCorrectPitch);
  };

  const onSpeakerPressed = () => {
    setState((prevState) => {
      const newThroughEarpiece = !prevState.throughEarpiece;
      Audio.setAudioModeAsync({
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: newThroughEarpiece,
      });
      return { ...prevState, throughEarpiece: newThroughEarpiece };
    });
  };

  return !state.fontLoaded ? (
    <View style={styles.emptyContainer} />
  ) : (
    <View style={styles.container}>
      <View />

      <View style={styles.nameContainer}>
        <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
          {state.playbackInstanceName}
        </Text>
      </View>

      <View />
      <View style={styles.space} />

      <Seekbar
        isLoading={state.isLoading}
        isBuffering={state.isBuffering}
        playbackInstance={playbackInstance}
        playbackInstancePosition={state.playbackInstancePosition}
        playbackInstanceDuration={state.playbackInstanceDuration}
        shouldPlay={state.shouldPlay}
      />

      <MediaPlayerButtons
        isLoading={state.isLoading}
        isPlaying={state.isPlaying}
        shouldPlay={state.shouldPlay}
        playbackInstance={playbackInstance}
        advanceIndex={advanceIndex}
        updatePlaybackInstanceForIndex={updatePlaybackInstanceForIndex}
      />
      {/*
       * 3. Volume slider and mute button 4. Pitch correction slider and
       */}
      <View
        style={[styles.buttonsContainerBase, styles.buttonsContainerMiddleRow]}
      >
        <VolumeControl
          muted={state.muted}
          playbackInstance={playbackInstance}
        />
        <OnLoop
          playbackInstance={playbackInstance}
          loopingType={state.loopingType}
          LOOPING_TYPE_ONE={LOOPING_TYPE_ONE}
        />
      </View>
      {/*
       * 5. Pitch correction 6. Through earpiece
       */}
      <View
        style={[styles.buttonsContainerBase, styles.buttonsContainerBottomRow]}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onPitchCorrectionPressed}
        >
          <View style={styles.button}>
            <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
              PC: {state.shouldCorrectPitch ? "yes" : "no"}
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={onSpeakerPressed}
          underlayColor={BACKGROUND_COLOR}
        >
          <MaterialIcons
            name={
              state.throughEarpiece
                ? ICON_THROUGH_EARPIECE
                : ICON_THROUGH_SPEAKER
            }
            size={32}
            color="black"
          />
        </TouchableHighlight>
      </View>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {},
  nameContainer: {
    height: FONT_SIZE,
  },
  space: {
    height: FONT_SIZE,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
  buffering: {
    textAlign: "left",
    paddingLeft: 20,
  },

  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainerMiddleRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20,
  },
  buttonsContainerBottomRow: {
    maxHeight: 32,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerTextRow: {
    maxHeight: FONT_SIZE,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
  },
});

export default Home;
