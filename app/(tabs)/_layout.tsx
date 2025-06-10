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
      tabBarClassName={`${colorScheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
      tabBarIconClassName={`${colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
      tabBarLabelClassName={`${colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
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
