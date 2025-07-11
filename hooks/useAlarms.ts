import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export interface Alarm {
    id: string;
    time: string;
    label: string;
    enabled: boolean;
    notificationId?: string;
}

const STORAGE_KEY = 'alarms';

export function useAlarmsLogic() {
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    // Load alarms từ AsyncStorage
    const fetchAlarms = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) setAlarms(JSON.parse(data));
            else setAlarms([]);
        } catch {
            setAlarms([]);
        }
    };

    // Lưu alarms vào AsyncStorage
    const saveAlarms = async (newAlarms: Alarm[]) => {
        setAlarms(newAlarms);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlarms));
        // TODO: publish MQTT message here nếu cần
    };

    const addAlarm = async (alarm: Omit<Alarm, 'id' | 'notificationId'>) => {
        const newAlarm: Alarm = {
            ...alarm,
            id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
            enabled: true,
        };
        const newAlarms = [...alarms, newAlarm];
        await saveAlarms(newAlarms);
    };

    const deleteAlarm = async (id: string) => {
        const newAlarms = alarms.filter(a => a.id !== id);
        await saveAlarms(newAlarms);
    };

    const toggleAlarm = async (id: string) => {
        const newAlarms = alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
        await saveAlarms(newAlarms);
    };

    const updateAlarm = async (id: string, data: Partial<Omit<Alarm, 'id'>>) => {
        const newAlarms = alarms.map(a => a.id === id ? { ...a, ...data } : a);
        await saveAlarms(newAlarms);
    };

    return { alarms, setAlarms, addAlarm, deleteAlarm, toggleAlarm, updateAlarm, fetchAlarms };
} 