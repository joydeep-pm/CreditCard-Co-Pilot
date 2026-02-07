import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, radii } from '@/theme/tokens';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
}

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  style,
  variant = 'primary',
}: Props) {
  const widthSV = useSharedValue(0);
  const fill = useSharedValue(0);

  const fillStyle = useAnimatedStyle(() => ({
    width: widthSV.value * fill.value,
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor:
      variant === 'primary' ? colors.sage2 : 'rgba(0,0,0,0.04)',
    borderRadius: radii.md,
  }));

  const isPrimary = variant === 'primary';

  return (
    <View
      onLayout={(e) => {
        widthSV.value = e.nativeEvent.layout.width;
      }}
      style={[isPrimary ? styles.primary : styles.secondary, disabled && styles.disabled, style]}
    >
      <Animated.View style={fillStyle} />
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => {
          fill.value = withTiming(1, { duration: 250 });
        }}
        onPressOut={() => {
          fill.value = withTiming(0, { duration: 200 });
        }}
        style={styles.pressable}
      >
        <Text
          style={[
            isPrimary ? styles.primaryText : styles.secondaryText,
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.sage,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  pressable: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    opacity: 0.6,
  },
});
