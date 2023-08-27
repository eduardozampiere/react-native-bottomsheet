import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
const { height: HEIGHT } = Dimensions.get("window");

const BottomSheet = ({ children }, ref) => {
  const positionY = useSharedValue(0);
  const initialPositionY = useSharedValue(0);
  const active = useSharedValue(false);

  function scrollTo(position) {
    "worklet";
    active.value = position !== 0;
    positionY.value = withSpring(position, {
      damping: 20,
    });
  }

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      initialPositionY.value = positionY.value;
    })
    .onUpdate(({ translationY }) => {
      positionY.value = translationY + initialPositionY.value;
      if (positionY.value < -HEIGHT) {
        positionY.value = -HEIGHT;
      }
    })
    .onEnd(({ velocityY }) => {
      if (velocityY > 2000) {
        scrollTo(0);
      } else if (positionY.value < -HEIGHT / 2 || velocityY < -2000) {
        scrollTo(-HEIGHT);
      } else if (positionY.value > -HEIGHT / 3) {
        scrollTo(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(
      positionY.value,
      [-HEIGHT, -HEIGHT + 80, -HEIGHT / 3, 0],
      [0, 25, 25, 0],
      {
        extrapolateLeft: Extrapolation.CLAMP,
      }
    );
    return {
      borderRadius: radius,
      transform: [
        {
          translateY: positionY.value,
        },
      ],
    };
  });

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useEffect(() => {
    scrollTo(0);
  }, []);

  useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
    scrollTo,
    isActive,
  ]);

  return (
    <GestureDetector gesture={gestureHandler}>
      <Animated.View style={[styles.bottomSheetContainer, animatedStyle]}>
        <View style={styles.line}></View>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: HEIGHT,
    position: "absolute",
    top: HEIGHT + 50,
    borderRadius: 25,
  },
  line: {
    backgroundColor: "grey",
    width: 100,
    height: 5,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 15,
  },
});

export default forwardRef(BottomSheet);
