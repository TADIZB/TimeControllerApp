import { Alarm } from '@/hooks/useAlarms';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CheckMqttConnection, DisconnectMqtt, ReceiveFromMqtt, SendToMqtt } from '@/mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Vibration } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const STORAGE_KEY = 'alarms';

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
    })();

    CheckMqttConnection();

    ReceiveFromMqtt((result : boolean) => {
      if(result) {
        Vibration.vibrate(30000);
      }
    })
    const interval = setInterval(async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const alarms: Alarm[] = data ? JSON.parse(data) : [];
      const now = new Date();
      const hour = now.getHours().toString().padStart(2, '0');
      const minute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hour}:${minute}`;

      const matchingAlarm = alarms.find(
        (alarm) => alarm.enabled && alarm.time === currentTime
      );

      if (matchingAlarm) {
        SendToMqtt();
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      DisconnectMqtt();
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
