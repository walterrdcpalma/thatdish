import { StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add</Text>
      <Text style={styles.subtitle}>Em breve</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.7,
  },
});
