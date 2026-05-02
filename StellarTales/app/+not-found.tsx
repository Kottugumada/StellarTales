import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Space } from '../constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Screen not found.</Text>
        <Link href="/" style={styles.link}>Go to Tonight's Sky</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Space.background, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: Space.text, fontSize: 20, fontWeight: '600', marginBottom: 16 },
  link: { color: Space.aurora, fontSize: 15 },
});
