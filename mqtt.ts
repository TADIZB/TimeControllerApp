import mqtt from "mqtt";

const MQTT_BROKER = 'ws://broker.hivemq.com:8000/mqtt';
const TOPIC = 'GR1';

const client = mqtt.connect(MQTT_BROKER);

export const CheckMqttConnection = () => {
    client.on('connect', () => {
        console.log('MQTT connected');
    });

    client.on('error', (err) => {
        console.error('MQTT Error:', err);
    });
}

export const SendToMqtt = () => {
    client.publish(TOPIC, 'X');
}

export const DisconnectMqtt = () => {
    client.end();
}

export const ReceiveFromMqtt = (callback : any) => {
    client.subscribe(TOPIC, (err) => {
        if (err) {
            console.error('Subscribe error:', err);
        } else {
            console.log(`Subscribed successfully`);
        }
    });

    client.on('message', (topic, message) => {
        if (topic === TOPIC) {
            const payload = message.toString();
            console.log('Received:', payload);
            if (payload === 'X') {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}
