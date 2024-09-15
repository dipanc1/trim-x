import { StyleSheet, View } from "react-native";
import React from "react";
import { ICON_MUTED_BUTTON } from "@/constants";

interface MiddleButtonContainerProps {
  children: React.ReactNode;
}

const MiddleButtonContainer: React.FC<MiddleButtonContainerProps> = ({
  children,
}) => {
  return (
    <View
      style={[styles.buttonsContainerBase, styles.buttonsContainerMiddleRow]}
    >
      {children}
    </View>
  );
};

export default MiddleButtonContainer;

const styles = StyleSheet.create({
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
});
