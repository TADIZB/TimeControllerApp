import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">Ứng dụng Báo Thức</ThemedText>
      <ThemedText style={styles.subtitle} type="subtitle">Chào mừng bạn!</ThemedText>
      <ThemedText style={styles.desc}>
        Quản lý thời gian hiệu quả với các chức năng:
      </ThemedText>
      <View style={styles.cardList}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/alarm')}>
            <MaterialCommunityIcons name="alarm" size={36} color="#0a7ea4" />
            <ThemedText style={styles.cardTitle}>Báo thức</ThemedText>
            <ThemedText style={styles.cardDesc}>Xem & quản lý báo thức</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/add-alarm')}>
            <MaterialCommunityIcons name="plus-circle" size={36} color="#0a7ea4" />
            <ThemedText style={styles.cardTitle}>Thêm báo thức</ThemedText>
            <ThemedText style={styles.cardDesc}>Tạo báo thức mới</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/events')}>
            <MaterialCommunityIcons name="calendar" size={36} color="#0a7ea4" />
            <ThemedText style={styles.cardTitle}>Sự kiện</ThemedText>
            <ThemedText style={styles.cardDesc}>Xem lịch sự kiện</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/add-event')}>
            <MaterialCommunityIcons name="calendar-plus" size={36} color="#0a7ea4" />
            <ThemedText style={styles.cardTitle}>Thêm sự kiện</ThemedText>
            <ThemedText style={styles.cardDesc}>Tạo sự kiện mới</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/countdown')}>
            <MaterialCommunityIcons name="timer" size={36} color="#0a7ea4" />
            <ThemedText style={styles.cardTitle}>Đếm ngược</ThemedText>
            <ThemedText style={styles.cardDesc}>Bộ đếm ngược thời gian</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardList: {
    width: '100%',
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 18,
    marginBottom: 0,
  },
  card: {
    backgroundColor: '#f2fafd',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
    flex: 1,
    minWidth: 140,
    marginBottom: 0,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginTop: 8,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: '#687076',
    textAlign: 'center',
  },
});
