import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import { useRef } from "react";
import { Animated, Pressable, View } from "react-native";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label?: string;
  size?: 'small' | 'normal' | 'large';
  color?: string;
  visible?: boolean;
}

export const FloatingActionButton = ({
  onPress,
  icon,
  label,
  size = 'normal',
  color,
  visible = true,
}: FloatingActionButtonProps) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const scale = useRef(new Animated.Value(1)).current;

  const buttonSize = {
    small: 40,
    normal: 56,
    large: 72,
  }[size];

  const iconSize = {
    small: 20,
    normal: 24,
    large: 32,
  }[size];

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (!visible) return null;

  return (
    <View className="absolute bottom-6 right-6">
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={`rounded-full justify-center items-center ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            }`}
          style={{
            width: buttonSize,
            height: buttonSize,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons
            name={icon}
            size={iconSize}
            color="white"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}; 
