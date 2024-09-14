import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { Asset } from "expo-asset";
import { Audio, InterruptionModeAndroid } from "expo-av";
import * as Font from "expo-font";
import Slider from "@react-native-community/slider";

import { MaterialIcons } from "@expo/vector-icons";

class Icon {
  module: any;
  width: number;
  height: number;

  constructor(module: any, width: number, height: number) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

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

const ICON_PLAY_BUTTON = new Icon(
  require("../../assets/images/play_button.png"),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require("../../assets/images/pause_button.png"),
  34,
  51
);
const ICON_STOP_BUTTON = new Icon(
  require("../../assets/images/stop_button.png"),
  22,
  22
);
const ICON_FORWARD_BUTTON = new Icon(
  require("../../assets/images/forward_button.png"),
  33,
  25
);
const ICON_BACK_BUTTON = new Icon(
  require("../../assets/images/back_button.png"),
  33,
  25
);

const ICON_LOOP_ALL_BUTTON = new Icon(
  require("../../assets/images/loop_all_button.png"),
  77,
  35
);
const ICON_LOOP_ONE_BUTTON = new Icon(
  require("../../assets/images/loop_one_button.png"),
  77,
  35
);

const ICON_MUTED_BUTTON = new Icon(
  require("../../assets/images/muted_button.png"),
  67,
  58
);
const ICON_UNMUTED_BUTTON = new Icon(
  require("../../assets/images/unmuted_button.png"),
  67,
  58
);

const ICON_TRACK_1 = new Icon(
  require("../../assets/images/track_1.png"),
  166,
  5
);
const ICON_THUMB_1 = new Icon(
  require("../../assets/images/thumb_1.png"),
  18,
  19
);
const ICON_THUMB_2 = new Icon(
  require("../../assets/images/thumb_2.png"),
  15,
  19
);

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_ICONS = { 0: ICON_LOOP_ALL_BUTTON, 1: ICON_LOOP_ONE_BUTTON };

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";
const BUFFERING_STRING = "...buffering...";
const RATE_SCALE = 3.0;

const Home: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);
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

  const onRateSliderSlidingComplete = async (value: number) => {
    trySetRate(value * RATE_SCALE, state.shouldCorrectPitch);
  };

  const onPitchCorrectionPressed = async () => {
    trySetRate(state.rate, !state.shouldCorrectPitch);
  };

  const onSeekSliderValueChange = (value: number) => {
    if (playbackInstance != null && !isSeeking) {
      setIsSeeking(true);
      setShouldPlayAtEndOfSeek(state.shouldPlay);
      playbackInstance.pauseAsync();
    }
  };

  const onSeekSliderSlidingComplete = async (value: number) => {
    if (playbackInstance != null) {
      setIsSeeking(false);
      const seekPosition = value * (state.playbackInstanceDuration || 0);
      if (shouldPlayAtEndOfSeek) {
        playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  const getSeekSliderPosition = () => {
    if (
      playbackInstance != null &&
      state.playbackInstancePosition != null &&
      state.playbackInstanceDuration != null
    ) {
      return state.playbackInstancePosition / state.playbackInstanceDuration;
    }
    return 0;
  };

  const getMMSSFromMillis = (millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  };

  const getTimestamp = () => {
    if (
      playbackInstance != null &&
      state.playbackInstancePosition != null &&
      state.playbackInstanceDuration != null
    ) {
      return `${getMMSSFromMillis(
        state.playbackInstancePosition
      )} / ${getMMSSFromMillis(state.playbackInstanceDuration)}`;
    }
    return "";
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
      <View style={styles.space} />
      <View
        style={[
          styles.playbackContainer,
          {
            opacity: state.isLoading ? DISABLED_OPACITY : 1.0,
          },
        ]}
      >
        <Slider
          style={styles.playbackSlider}
          trackImage={ICON_TRACK_1.module}
          thumbImage={ICON_THUMB_1.module}
          value={getSeekSliderPosition()}
          onValueChange={onSeekSliderValueChange}
          onSlidingComplete={onSeekSliderSlidingComplete}
          disabled={state.isLoading}
        />
        <View style={styles.timestampRow}>
          <Text
            style={[
              styles.text,
              styles.buffering,
              { fontFamily: "cutive-mono-regular" },
            ]}
          >
            {state.isBuffering ? BUFFERING_STRING : ""}
          </Text>
          <Text
            style={[
              styles.text,
              styles.timestamp,
              { fontFamily: "cutive-mono-regular" },
            ]}
          >
            {getTimestamp()}
          </Text>
        </View>
      </View>
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
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },
  timestampRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    minHeight: FONT_SIZE,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
  buffering: {
    textAlign: "left",
    paddingLeft: 20,
  },
  timestamp: {
    textAlign: "right",
    paddingRight: 20,
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
