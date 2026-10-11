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
  slideInLeft: {
    from: { translateX: -100 },
    to: { translateX: 0 },
  },
  slideInUp: {
    from: { translateY: 40 },
    to: { translateY: 0 },
  },
};

export const AnimatedView = ({ animation = 'fadeIn', duration = 500, delay = 0, children, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const preset = animationPresets[animation] || animationPresets.fadeIn;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, duration, delay]);

  const transform = [];
  if (preset.from.translateX !== undefined) {
    transform.push({
      translateX: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [preset.from.translateX, preset.to.translateX],
      }),
    });
  }
  if (preset.from.translateY !== undefined) {
    transform.push({
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [preset.from.translateY, preset.to.translateY],
      }),
    });
  }

  return <Animated.View style={[{ opacity: animatedValue, transform }, style]}>{children}</Animated.View>;
};
