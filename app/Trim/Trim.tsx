import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface TrimProps {
  toggleTrimTrack: () => void;
}

const Trim: React.FC<TrimProps> = ({ toggleTrimTrack }) => {
  return (
    <View>
      <Text>Trim</Text>
      <TouchableOpacity onPress={toggleTrimTrack}>
        <Text>Go to Player</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Trim;

const styles = StyleSheet.create({});
