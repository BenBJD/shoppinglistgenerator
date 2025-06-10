import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { cssInterop, useColorScheme } from "nativewind";
import { ComponentProps } from "react";
import { TextStyle, ViewStyle } from "react-native";

export default function TabLayout() {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  return (
    <CustomTabs
      tabBarClassName={`${colorScheme === 'dark' ? 'bg-neutral-800 border-neutral-600' : 'bg-white border-neutral-300'}`}
      tabBarIconClassName={`${colorScheme === 'dark' ? 'text-neutral-200' : 'text-neutral-700'}`}
      tabBarLabelClassName={`${colorScheme === 'dark' ? 'text-neutral-200' : 'text-neutral-700'}`}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shopping List",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(recipes)"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
    </CustomTabs>
  );
}

// This is a workaround to allow for using NativeWind with the Tabs component
// Probably not gonna bother doing this for the other components
type CustomTabsProps = Omit<
  ComponentProps<typeof Tabs> & {
    tabBarStyle?: ViewStyle;
    tabBarIconStyle?: TextStyle;
    tabBarLabelStyle?: TextStyle;
  },
  "screenOptions"
>;

const CustomTabs = cssInterop(
  ({ tabBarStyle, tabBarIconStyle, tabBarLabelStyle, ...props }: CustomTabsProps) => (
    <Tabs screenOptions={{ tabBarStyle, tabBarIconStyle, tabBarLabelStyle, headerShown: false }} {...props} />
  ),
  {
    tabBarClassName: "tabBarStyle",
    tabBarIconClassName: "tabBarIconStyle",
    tabBarLabelClassName: "tabBarLabelStyle",
  }
);
