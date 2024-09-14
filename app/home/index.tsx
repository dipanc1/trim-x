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
import * as Font from "expo-font";
import Slider from "@react-native-community/slider";

import { MaterialIcons } from "@expo/vector-icons";
import {
  ICON_BACK_BUTTON,
  ICON_FORWARD_BUTTON,
  ICON_LOOP_ALL_BUTTON,
  ICON_LOOP_ONE_BUTTON,
  ICON_MUTED_BUTTON,
  ICON_PAUSE_BUTTON,
  ICON_PLAY_BUTTON,
  ICON_STOP_BUTTON,
  ICON_THUMB_2,
  ICON_TRACK_1,
  ICON_UNMUTED_BUTTON,
} from "@/constants/Icons";
import Seekbar from "@/components/Seekbar";

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
const LOOPING_TYPE_ICONS = { 0: ICON_LOOP_ALL_BUTTON, 1: ICON_LOOP_ONE_BUTTON };

const { width: DEVICE_WIDTH } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";

const Home: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [playbackInstance, setPlaybackInstance] = useState<Audio.Sound | null>(
    null
  );
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

    initializeAudio();
  }, []);

  const loadNewPlaybackInstance = async (playing: boolean) => {
    if (playbackInstance != null) {
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

  const onPlayPausePressed = () => {
    if (playbackInstance != null) {
      if (state.isPlaying) {
        playbackInstance.pauseAsync();
      } else {
        playbackInstance.playAsync();
      }
    }
  };

  const onStopPressed = () => {
    if (playbackInstance != null) {
      playbackInstance.stopAsync();
    }
  };

  const onForwardPressed = () => {
    if (playbackInstance != null) {
      advanceIndex(true);
      updatePlaybackInstanceForIndex(state.shouldPlay);
    }
  };

  const onBackPressed = () => {
    if (playbackInstance != null) {
      advanceIndex(false);
      updatePlaybackInstanceForIndex(state.shouldPlay);
    }
  };

  const onMutePressed = () => {
    if (playbackInstance != null) {
      playbackInstance.setIsMutedAsync(!state.muted);
    }
  };

  const onLoopPressed = () => {
    if (playbackInstance != null) {
      playbackInstance.setIsLoopingAsync(
        state.loopingType !== LOOPING_TYPE_ONE
      );
    }
  };

  const onVolumeSliderValueChange = (value: number) => {
    if (playbackInstance != null) {
      playbackInstance.setVolumeAsync(value);
    }
  };

  const trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
    if (playbackInstance != null) {
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
      {/*
       * 3. Buttons
       */}
      <View
        style={[
          styles.buttonsContainerBase,
          styles.buttonsContainerTopRow,
          {
            opacity: state.isLoading ? DISABLED_OPACITY : 1.0,
          },
        ]}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onBackPressed}
          disabled={state.isLoading}
        >
          <Image style={styles.button} source={ICON_BACK_BUTTON.module} />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onPlayPausePressed}
          disabled={state.isLoading}
        >
          <Image
            style={styles.button}
            source={
              state.isPlaying
                ? ICON_PAUSE_BUTTON.module
                : ICON_PLAY_BUTTON.module
            }
          />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onStopPressed}
          disabled={state.isLoading}
        >
          <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onForwardPressed}
          disabled={state.isLoading}
        >
          <Image style={styles.button} source={ICON_FORWARD_BUTTON.module} />
        </TouchableHighlight>
      </View>
      {/*
       * 3. Volume slider and mute button 4. Pitch correction slider and
       */}
      <View
        style={[styles.buttonsContainerBase, styles.buttonsContainerMiddleRow]}
      >
        <View style={styles.volumeContainer}>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={onMutePressed}
          >
            <Image
              style={styles.button}
              source={
                state.muted
                  ? ICON_MUTED_BUTTON.module
                  : ICON_UNMUTED_BUTTON.module
              }
            />
          </TouchableHighlight>
          <Slider
            style={styles.volumeSlider}
            trackImage={ICON_TRACK_1.module}
            thumbImage={ICON_THUMB_2.module}
            value={1}
            onValueChange={onVolumeSliderValueChange}
          />
        </View>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onLoopPressed}
        >
          <Image
            style={styles.button}
            source={
              LOOPING_TYPE_ICONS[
                state.loopingType as keyof typeof LOOPING_TYPE_ICONS
              ].module
            }
          />
        </TouchableHighlight>
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
  buttonsContainerTopRow: {
    maxHeight: ICON_PLAY_BUTTON.height,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerMiddleRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width,
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
