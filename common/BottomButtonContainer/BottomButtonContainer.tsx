import { StyleSheet, View } from "react-native";
import React from "react";

interface BottomButtonContainerProps {
  children: React.ReactNode;
}

const BottomButtonContainer: React.FC<BottomButtonContainerProps> = ({
  children,
}) => {
  return (
    <View
      style={[styles.buttonsContainerBase, styles.buttonsContainerBottomRow]}
    >
      {children}
    </View>
  );
};

export default BottomButtonContainer;

const styles = StyleSheet.create({
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainerBottomRow: {
    maxHeight: 32,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20,
  },
});
