import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { AlarmProvider } from '@/hooks/AlarmContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AlarmProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="alarm"
          options={{
            title: 'Báo thức',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="alarm.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="add-alarm"
          options={{
            title: 'Thêm báo thức',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="countdown"
          options={{
            title: 'Đếm ngược',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="timer" color={color} />,
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: 'Sự kiện',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="add-event"
          options={{
            title: 'Thêm sự kiện',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.badge.plus" color={color} />,
          }}
        />
      </Tabs>
    </AlarmProvider>
  );
}
