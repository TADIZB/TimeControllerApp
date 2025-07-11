import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Button, StyleSheet, Switch, Text, View } from 'react-native';

interface AlarmItemProps {
    time: string;
    label: string;
    enabled: boolean;
    onToggle?: () => void;
    onDelete?: () => void;
}

export default function AlarmItem({ time, label, enabled, onToggle, onDelete }: AlarmItemProps) {
    return (
        <View style={[styles.container, enabled ? styles.enabled : styles.disabled]}>
            <View style={styles.left}>
                <Ionicons name="alarm" size={32} color={enabled ? '#2ecc40' : '#bbb'} style={{ marginRight: 12 }} />
                <View>
                    <Text style={styles.time}>{time}</Text>
                    <Text style={styles.label}>{label}</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <Switch
                    value={enabled}
                    onValueChange={onToggle}
                    thumbColor={enabled ? '#2ecc40' : '#ccc'}
                    trackColor={{ false: '#ccc', true: '#b2f2bb' }}
                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                />
                <Button title="Xóa" color="#e74c3c" onPress={onDelete} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    enabled: {
        borderLeftWidth: 6,
        borderLeftColor: '#2ecc40',
    },
    disabled: {
        borderLeftWidth: 6,
        borderLeftColor: '#bbb',
        opacity: 0.7,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    time: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
    },
    label: {
        fontSize: 15,
        color: '#888',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
}); 