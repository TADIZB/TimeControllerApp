import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button, Snackbar, Text, TextInput } from 'react-native-paper';

export default function AddEventScreen() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        const newEvent = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
            name,
            desc,
            date: date.toISOString(),
        };
        try {
            const data = await AsyncStorage.getItem('events');
            const events = data ? JSON.parse(data) : [];
            events.push(newEvent);
            await AsyncStorage.setItem('events', JSON.stringify(events));
        } catch { }
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
            router.replace('/events');
        }, 1200);
        setName('');
        setDesc('');
        setDate(new Date());
    };

    const onChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            setShowPicker(false);
        } else if (event.type === 'dismissed') {
            setShowPicker(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#f8fafd' }}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Thêm sự kiện" titleStyle={{ color: '#0a7ea4', fontWeight: 'bold' }} />
            </Appbar.Header>
            <Text style={styles.title}>Tạo sự kiện mới</Text>
            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    label="Tên sự kiện"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    left={<TextInput.Icon icon="calendar" />}
                />
                <TextInput
                    style={styles.input}
                    label="Mô tả"
                    value={desc}
                    onChangeText={setDesc}
                    mode="outlined"
                    multiline
                    left={<TextInput.Icon icon="note-outline" />}
                />
                <Button
                    mode="outlined"
                    onPress={() => setShowPicker(true)}
                    style={styles.dateBtn}
                    labelStyle={{ color: '#0a7ea4', fontWeight: 'bold' }}
                >
                    {date.toLocaleString('vi-VN', { hour12: false })}
                </Button>
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        {...(Platform.OS === 'android' ? { is24Hour: true } : {})}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveBtn}
                    contentStyle={{ paddingVertical: 10, borderRadius: 12 }}
                    labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
                >
                    Lưu sự kiện
                </Button>
            </View>
            <Snackbar
                visible={showSnackbar}
                onDismiss={() => setShowSnackbar(false)}
                duration={1200}
                style={{ backgroundColor: '#0a7ea4' }}
            >
                Đã lưu sự kiện!
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a7ea4',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    card: {
        marginHorizontal: 16,
        marginTop: 8,
        backgroundColor: '#f8fafd',
        borderRadius: 18,
        paddingVertical: 24,
        paddingHorizontal: 18,
        alignItems: 'center',
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    input: {
        marginBottom: 16,
        width: 240,
        backgroundColor: '#fff',
    },
    dateBtn: {
        borderColor: '#0a7ea4',
        borderWidth: 1.5,
        borderRadius: 10,
        marginBottom: 18,
        backgroundColor: '#f8fafd',
        minWidth: 180,
    },
    saveBtn: {
        backgroundColor: '#0a7ea4',
        borderRadius: 12,
        width: 180,
        alignSelf: 'center',
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
    },
}); 