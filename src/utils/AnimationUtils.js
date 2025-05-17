// src/utils/AnimationUtils.js
import React from 'react';
import { Animated } from 'react-native';

export const animationPresets = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideInRight: {
    from: { translateX: 100 },
    to: { translateX: 0 },
  },
};

export const AnimatedView = ({ animation = 'fadeIn', duration = 500, children, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const preset = animationPresets[animation] || animationPresets.fadeIn;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: animatedValue,
    transform: preset.from.translateX !== undefined
      ? [{ translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [preset.from.translateX, preset.to.translateX],
        }) }]
      : [],
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
