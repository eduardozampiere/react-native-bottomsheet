import React, { useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable, Dimensions } from "react-native";
import BottomSheet from "../components/BottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Container } from './styles';
const { height } = Dimensions.get("window");

const HEIGHT = height - 80;
const App = () => {
  const bottomSheetRef = useRef(null);
  const onPress = useCallback(() => {
    const active = bottomSheetRef.current.isActive();
    if (active) {
      bottomSheetRef.current.scrollTo(0);
    } else {
      bottomSheetRef.current.scrollTo(-HEIGHT / 3);
    }
  }, []);
  return (
    <GestureHandlerRootView
      style={{
        display: "flex",
        flexGrow: 1,
        backgroundColor: "#020202",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar style="auto" />
      <Pressable
        onPress={onPress}
        style={{
          width: 100,
          aspectRatio: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          opacity: 0.4,
          borderRadius: 50,
        }}
      ></Pressable>
      <BottomSheet ref={bottomSheetRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "orange",
          }}
        ></View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default App;
