import { StyleSheet, Text, View } from 'react-native';
import { Space } from '../../constants/Colors';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.body}>Browse sky objects — coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Space.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: Space.text, fontSize: 24, fontWeight: '700', marginBottom: 12 },
  body: { color: Space.textSecondary, fontSize: 15, textAlign: 'center' },
});
