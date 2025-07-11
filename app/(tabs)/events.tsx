import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Appbar, Card, Text } from 'react-native-paper';

function formatDateKey(date: Date) {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
}

export interface EventItem {
    id: string;
    name: string;
    desc: string;
    date: string; // ISO string
}

export default function EventsScreen() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const router = useRouter();
    const [selected, setSelected] = useState(formatDateKey(new Date()));

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await AsyncStorage.getItem('events');
                if (data) setEvents(JSON.parse(data));
            } catch { }
        };
        loadEvents();
    }, []);

    const markedDates = events.reduce((acc, ev) => {
        const key = formatDateKey(new Date(ev.date));
        acc[key] = { marked: true, dotColor: '#0a7ea4', selected: key === selected, selectedColor: '#0a7ea4' };
        return acc;
    }, { [selected]: { selected: true, selectedColor: '#0a7ea4' } } as any);

    const eventsOfDay = events.filter(ev => formatDateKey(new Date(ev.date)) === selected);

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#f8fafd' }}>
                <Appbar.Content title="Sự kiện" titleStyle={{ color: '#0a7ea4', fontWeight: 'bold' }} />
            </Appbar.Header>
            <Calendar
                style={styles.calendar}
                markedDates={markedDates}
                onDayPress={day => setSelected(day.dateString)}
                theme={{
                    selectedDayBackgroundColor: '#0a7ea4',
                    todayTextColor: '#0a7ea4',
                    arrowColor: '#0a7ea4',
                    dotColor: '#0a7ea4',
                }}
            />
            <FlatList
                data={eventsOfDay}
                keyExtractor={ev => ev.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item: ev }) => (
                    <Card style={styles.card}>
                        <Card.Title title={ev.name} titleStyle={{ color: '#0a7ea4', fontWeight: 'bold' }} />
                        <Card.Content>
                            <Text style={styles.cardDesc}>{ev.desc}</Text>
                            <Text style={styles.cardTime}>{new Date(ev.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có sự kiện nào cho ngày này</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    calendar: {
        margin: 12,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: '#f8fafd',
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 12,
        borderRadius: 14,
        backgroundColor: '#f8fafd',
        elevation: 2,
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    cardDesc: {
        fontSize: 15,
        color: '#222',
        marginBottom: 4,
    },
    cardTime: {
        fontSize: 14,
        color: '#0a7ea4',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#aaa',
        marginTop: 32,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 32,
        backgroundColor: '#0a7ea4',
        borderRadius: 28,
        elevation: 4,
    },
}); 