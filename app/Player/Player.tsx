import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Audio } from "expo-av";

import Seekbar from "@/components/Seekbar";
import {
  MediaPlayerButtons,
  OnLoop,
  PitchCorrection,
  ThroughEarpiece,
  VolumeControl,
} from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomButtonContainer, MiddleButtonContainer } from "@/common";
import { Colors } from "@/constants";
import Trim from "../Trim";

interface PlayerProps {
  fontLoaded: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  shouldPlay: boolean;
  playbackInstance: Audio.Sound | null;
  playbackInstanceName: string;
  playbackInstancePosition: number | null;
  playbackInstanceDuration: number | null;
  advanceIndex: () => void;
  updatePlaybackInstanceForIndex: (shouldPlay: boolean) => void;
  muted: boolean;
  setState: React.Dispatch<React.SetStateAction<any>>;
  throughEarpiece: boolean;
  rate: number;
  shouldCorrectPitch: boolean;
  loopingType: number;
  LOOPING_TYPE_ONE: number;
  backToTrackList: () => void;
  trimTrack: boolean;
  toggleTrimTrack: () => void;
}

const FONT_SIZE = 14;

const Player: React.FC<PlayerProps> = ({
  fontLoaded,
  isLoading,
  isPlaying,
  isBuffering,
  shouldPlay,
  playbackInstance,
  playbackInstanceName,
  playbackInstancePosition,
  playbackInstanceDuration,
  advanceIndex,
  updatePlaybackInstanceForIndex,
  muted,
  setState,
  throughEarpiece,
  rate,
  shouldCorrectPitch,
  loopingType,
  LOOPING_TYPE_ONE,
  backToTrackList,
  trimTrack,
  toggleTrimTrack,
}) => {
  return !fontLoaded ? (
    <View style={styles.emptyContainer} />
  ) : trimTrack ? (
    <Trim toggleTrimTrack={toggleTrimTrack} />
  ) : (
    <View style={styles.container}>
      <View />

      <View style={styles.nameContainer}>
        <Text style={[styles.text, { fontFamily: "cutive-mono-regular" }]}>
          {playbackInstanceName}
        </Text>
      </View>

      <View />

      <View style={styles.space} />

      <Seekbar
        isLoading={isLoading}
        isBuffering={isBuffering}
        playbackInstance={playbackInstance}
        playbackInstancePosition={playbackInstancePosition}
        playbackInstanceDuration={playbackInstanceDuration}
        shouldPlay={shouldPlay}
      />

      <MediaPlayerButtons
        isLoading={isLoading}
        isPlaying={isPlaying}
        shouldPlay={shouldPlay}
        playbackInstance={playbackInstance}
        advanceIndex={advanceIndex}
        updatePlaybackInstanceForIndex={updatePlaybackInstanceForIndex}
      />

      <MiddleButtonContainer>
        <VolumeControl muted={muted} playbackInstance={playbackInstance} />
        <OnLoop
          playbackInstance={playbackInstance}
          loopingType={loopingType}
          LOOPING_TYPE_ONE={LOOPING_TYPE_ONE}
        />
      </MiddleButtonContainer>

      <BottomButtonContainer>
        <TouchableOpacity onPress={backToTrackList}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleTrimTrack}>
          <MaterialIcons name="crop" size={24} color="black" />
        </TouchableOpacity>

        <PitchCorrection
          playbackInstance={playbackInstance}
          rate={rate}
          shouldCorrectPitch={shouldCorrectPitch}
        />

        <ThroughEarpiece
          setState={setState}
          throughEarpiece={throughEarpiece}
        />
      </BottomButtonContainer>

      <View />
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: Colors.playerBackground,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: Colors.playerBackground,
  },
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
});
