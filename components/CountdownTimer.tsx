import { SendToMqtt } from '@/mqtt';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CountdownTimerProps {
    initialSeconds: number;
    onComplete?: () => void;
    circleSize?: number;
    isPaused?: boolean;
    onReset?: () => void;
}

const pad = (num: number) => num.toString().padStart(2, '0');

const DEFAULT_CIRCLE_SIZE = 120;
const STROKE_WIDTH = 8;

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds, onComplete, circleSize = DEFAULT_CIRCLE_SIZE, isPaused, onReset }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [hasCompleted, setHasCompleted] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const RADIUS = (circleSize - STROKE_WIDTH) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    useEffect(() => {
        setSecondsLeft(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (secondsLeft <= 0 && !hasCompleted) {
            SendToMqtt();
            setHasCompleted(true);
            if (onComplete) onComplete();
            return;
        }

        if (isPaused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current!);
    }, [secondsLeft, onComplete, isPaused, hasCompleted]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const percent = initialSeconds > 0 ? secondsLeft / initialSeconds : 0;
    const strokeDashoffset = CIRCUMFERENCE * (1 - percent);

    return (
        <View style={[styles.container, { width: circleSize, height: circleSize }]}>
            <Svg width={circleSize} height={circleSize} style={styles.svg}>
                <Circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={RADIUS}
                    stroke="#eee"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />
                <Circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={RADIUS}
                    stroke="#0a7ea4"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${circleSize / 2}, ${circleSize / 2}`}
                />
            </Svg>
            <View style={[styles.timeOverlay, { width: circleSize, height: circleSize }]} pointerEvents="none">
                <Text style={styles.timerText}>{pad(minutes)}:{pad(seconds)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    timeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
        color: '#0a7ea4',
    },
});

export default CountdownTimer; 