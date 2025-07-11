import React, { createContext, useContext, useEffect } from 'react';
import { Alarm, useAlarmsLogic } from './useAlarms';

interface AlarmContextType {
    alarms: Alarm[];
    addAlarm: ReturnType<typeof useAlarmsLogic>["addAlarm"];
    deleteAlarm: ReturnType<typeof useAlarmsLogic>["deleteAlarm"];
    toggleAlarm: ReturnType<typeof useAlarmsLogic>["toggleAlarm"];
    updateAlarm: ReturnType<typeof useAlarmsLogic>["updateAlarm"];
    fetchAlarms: ReturnType<typeof useAlarmsLogic>["fetchAlarms"];
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useAlarmsLogic();

    useEffect(() => {
        logic.fetchAlarms();
    }, []);

    return (
        <AlarmContext.Provider value={logic}>
            {children}
        </AlarmContext.Provider>
    );
};

export function useAlarms() {
    const ctx = useContext(AlarmContext);
    if (!ctx) throw new Error('useAlarms must be used within AlarmProvider');
    return ctx;
} 