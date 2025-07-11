import { useAlarms } from '@/hooks/AlarmContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Button, List, Text } from 'react-native-paper';

export default function AlarmScreen() {
    const { alarms, toggleAlarm, deleteAlarm, fetchAlarms } = useAlarms();
    const router = useRouter();

    useEffect(() => {
        fetchAlarms();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Appbar.Header style={{ backgroundColor: '#f8fafd' }}>
                    <Appbar.Content title="Danh sách báo thức" titleStyle={{ color: '#0a7ea4', fontWeight: 'bold' }} />
                </Appbar.Header>
                <Text style={[styles.subtitle, { color: '#0a7ea4' }]}>Quản lý các báo thức bạn đã tạo</Text>
                {alarms.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>Chưa có báo thức nào</Text>
                    </View>
                ) : (
                    <FlatList
                        data={alarms}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <List.Item
                                title={item.time}
                                description={item.label}
                                left={props => <List.Icon {...props} icon={item.enabled ? 'alarm' : 'alarm-off'} />}
                                right={props => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Button mode="text" onPress={() => toggleAlarm(item.id)}>{item.enabled ? 'Tắt' : 'Bật'}</Button>
                                        <Button mode="text" onPress={() => deleteAlarm(item.id)} color="#d32f2f">Xoá</Button>
                                    </View>
                                )}
                                style={styles.listItem}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
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
    emptyBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#0a7ea4',
    },
    listContent: {
        paddingBottom: 80,
    },
    listItem: {
        backgroundColor: '#f6f6f6',
        marginHorizontal: 12,
        marginVertical: 4,
        borderRadius: 12,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 32,
        backgroundColor: '#0a7ea4',
    },
}); 