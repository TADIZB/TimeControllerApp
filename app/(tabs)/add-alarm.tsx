import { useAlarms } from '@/hooks/AlarmContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, Snackbar, Text, TextInput } from 'react-native-paper';

const getInitialTime = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    now.setHours(7, 0);
    return now;
};

export default function AddAlarmScreen() {
    const [time, setTime] = useState(getInitialTime());
    const [label, setLabel] = useState('');
    const { addAlarm } = useAlarms();
    const router = useRouter();
    const [showPicker, setShowPicker] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleSave = async () => {
        const hour = time.getHours().toString().padStart(2, '0');
        const minute = time.getMinutes().toString().padStart(2, '0');
        await addAlarm({ time: `${hour}:${minute}`, label, enabled: true });

        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
            setTime(getInitialTime());
            setLabel('');
            router.replace('/alarm');
        }, 1200);
    };

    const onChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setTime(selectedDate);
            setShowPicker(false);
        } else if (event.type === 'dismissed') {
            setShowPicker(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#f8fafd' }}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Thêm báo thức" titleStyle={{ color: '#0a7ea4', fontWeight: 'bold' }} />
            </Appbar.Header>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0a7ea4', marginBottom: 8, textAlign: 'center' }}>Tạo báo thức mới</Text>
            <Text style={styles.subtitle}>Chọn giờ và nhập nhãn cho báo thức của bạn.</Text>
            <View style={styles.card}>
                <View style={styles.timeBox}>
                    <IconButton icon="clock-outline" size={40} onPress={() => setShowPicker(true)} iconColor="#0a7ea4" style={{ backgroundColor: '#e3f3fa', borderRadius: 16 }} />
                    <Text style={styles.timeTextTouchable} onPress={() => setShowPicker(true)}>
                        {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
                    </Text>
                </View>
                {showPicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <TextInput
                    style={styles.input}
                    label="Nhãn báo thức"
                    value={label}
                    onChangeText={setLabel}
                    mode="outlined"
                    left={<TextInput.Icon icon="label-outline" />}
                />
                <Button mode="contained" onPress={handleSave} style={styles.saveBtn} contentStyle={{ paddingVertical: 10, borderRadius: 12 }} labelStyle={{ fontWeight: 'bold', fontSize: 16 }}>
                    Lưu báo thức
                </Button>
            </View>
            <Snackbar
                visible={showSnackbar}
                onDismiss={() => setShowSnackbar(false)}
                duration={1200}
                style={{ backgroundColor: '#0a7ea4' }}
            >
                Thêm báo thức thành công!
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#687076',
        margin: 16,
        textAlign: 'center',
    },
    card: {
        marginHorizontal: 16,
        marginTop: 16,
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
    timeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#e3f3fa',
    },
    timeTextTouchable: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0a7ea4',
        marginLeft: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#e3f3fa',
    },
    input: {
        marginHorizontal: 0,
        marginBottom: 18,
        width: 240,
        backgroundColor: '#fff',
    },
    saveBtn: {
        marginHorizontal: 0,
        marginTop: 8,
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