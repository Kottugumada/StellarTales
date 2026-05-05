import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Space } from '../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Space.accent,
        tabBarInactiveTintColor: Space.textMuted,
        tabBarStyle: {
          backgroundColor: Space.card,
          borderTopColor: Space.cardBorder,
          ...Platform.select({ ios: { position: 'absolute' } }),
        },
        tabBarLabelStyle: { fontSize: 11 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tonight',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="nights-stay" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="auto-awesome" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
