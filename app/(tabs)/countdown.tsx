import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import CountdownTimer from '../../components/CountdownTimer';

export default function CountdownScreen() {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(5);
    const [secondsInput, setSecondsInput] = useState(0);
    const [seconds, setSeconds] = useState(300);
    const [key, setKey] = useState(0);
    const [started, setStarted] = useState(false);
    const [openField, setOpenField] = useState<null | 'hours' | 'minutes' | 'seconds'>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [lastSet, setLastSet] = useState({ hours, minutes, secondsInput });
    const [showEndSnackbar, setShowEndSnackbar] = useState(false);
    const [showEndOverlay, setShowEndOverlay] = useState(false);
    const endOverlayTimeout = useRef<number | null>(null);

    const handleStart = () => {
        const total = hours * 3600 + minutes * 60 + secondsInput;
        if (total > 0) {
            setSeconds(total);
            setKey(prev => prev + 1);
            setStarted(true);
            setIsPaused(false);
            setLastSet({ hours, minutes, secondsInput });
        }
    };

    const handleReset = () => {
        setSeconds(lastSet.hours * 3600 + lastSet.minutes * 60 + lastSet.secondsInput);
        setKey(prev => prev + 1);
        setIsPaused(false);
        setShowEndOverlay(false);
    };

    const handlePauseResume = () => {
        setIsPaused((prev) => !prev);
    };

    const renderPicker = (field: 'hours' | 'minutes' | 'seconds') => {
        let selectedValue = field === 'hours' ? hours : field === 'minutes' ? minutes : secondsInput;
        let max = field === 'hours' ? 23 : 59;
        let onValueChange = (val: number) => {
            if (field === 'hours') setHours(val);
            else if (field === 'minutes') setMinutes(val);
            else setSecondsInput(val);
            setOpenField(null);
        };
        return (
            <Modal
                visible={openField === field}
                transparent
                animationType="fade"
                onRequestClose={() => setOpenField(null)}
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpenField(null)} />
                <View style={styles.pickerModal}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={onValueChange}
                        style={styles.picker}
                    >
                        {[...Array(max + 1).keys()].map((v) => (
                            <Picker.Item key={v} label={`${v} ${field === 'hours' ? 'giờ' : field === 'minutes' ? 'phút' : 'giây'}`} value={v} />
                        ))}
                    </Picker>
                </View>
            </Modal>
        );
    };

    useEffect(() => {
        return () => {
            if (endOverlayTimeout.current) clearTimeout(endOverlayTimeout.current);
        };
    }, []);

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#f8fafd' }}>
                <Appbar.Content title="Bộ đếm ngược" titleStyle={{ color: '#0a7ea4', fontWeight: 'bold' }} />
            </Appbar.Header>
            <View style={styles.content}>
                {!started ? (
                    <View style={styles.inputBlock}>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.timeField} onPress={() => setOpenField('hours')}>
                                <Text style={styles.timeFieldText}>{hours} giờ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.timeField} onPress={() => setOpenField('minutes')}>
                                <Text style={styles.timeFieldText}>{minutes} phút</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.timeField} onPress={() => setOpenField('seconds')}>
                                <Text style={styles.timeFieldText}>{secondsInput} giây</Text>
                            </TouchableOpacity>
                        </View>
                        {renderPicker('hours')}
                        {renderPicker('minutes')}
                        {renderPicker('seconds')}
                        <Button mode="contained" onPress={handleStart} style={styles.startButton}>
                            Bắt đầu
                        </Button>
                    </View>
                ) : (
                    <View style={styles.timerBlock}>
                        <CountdownTimer
                            key={key}
                            initialSeconds={seconds}
                            circleSize={180}
                            isPaused={isPaused}
                            onComplete={() => {
                                if (!showEndOverlay) {
                                    setShowEndOverlay(true);
                                    if (endOverlayTimeout.current) clearTimeout(endOverlayTimeout.current);
                                    endOverlayTimeout.current = setTimeout(() => setShowEndOverlay(false), 10000);
                                }
                            }}
                        />
                        <View style={styles.buttonRow}>
                            <Button
                                mode="outlined"
                                onPress={handlePauseResume}
                                style={styles.controlBtn}
                                icon={() => (
                                    <MaterialCommunityIcons name={isPaused ? 'play' : 'pause'} size={22} color="#0a7ea4" />
                                )}
                                labelStyle={{ color: '#0a7ea4', fontWeight: 'bold' }}
                            >
                                {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={handleReset}
                                style={styles.controlBtn}
                                icon={() => (
                                    <MaterialCommunityIcons name="restart" size={22} color="#0a7ea4" />
                                )}
                                labelStyle={{ color: '#0a7ea4', fontWeight: 'bold' }}
                            >
                                Đặt lại
                            </Button>
                        </View>
                        <Button mode="outlined" onPress={() => { setStarted(false); setShowEndOverlay(false); }} style={styles.resetButton}>
                            Chỉnh lại thời gian
                        </Button>
                    </View>
                )}
            </View>
            {showEndOverlay && (
                <View style={styles.overlay} pointerEvents="none">
                    <View style={styles.overlayBox}>
                        <Text style={styles.overlayText}>Đã hết giờ!</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    timeField: {
        borderWidth: 1,
        borderColor: '#0a7ea4',
        borderRadius: 8,
        paddingVertical: Platform.OS === 'ios' ? 10 : 4,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        backgroundColor: '#f8fafd',
    },
    timeFieldText: {
        fontSize: 18,
        color: '#0a7ea4',
    },
    picker: {
        width: 200,
        height: 180,
        alignSelf: 'center',
    },
    pickerModal: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 24,
        paddingTop: 8,
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    startButton: {
        marginTop: 8,
        marginBottom: 24,
        alignSelf: 'center',
        width: 180,
        backgroundColor: '#0a7ea4',
    },
    inputBlock: {
        marginTop: 8,
        marginBottom: 8,
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'transparent',
        zIndex: 2,
    },
    timerBlock: {
        alignItems: 'center',
        width: '100%',
        zIndex: 1,
    },
    resetButton: {
        marginTop: 32,
        alignSelf: 'center',
        width: 180,
        borderColor: '#0a7ea4',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginTop: 24,
        marginBottom: 8,
    },
    controlBtn: {
        borderColor: '#0a7ea4',
        borderWidth: 1.5,
        borderRadius: 10,
        marginHorizontal: 4,
        backgroundColor: '#f8fafd',
        minWidth: 120,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    overlayBox: {
        backgroundColor: 'rgba(10,126,164,0.95)',
        borderRadius: 18,
        paddingVertical: 32,
        paddingHorizontal: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    overlayText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
}); 