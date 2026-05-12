import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HooksScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Hooks</Text>
    <Text style={styles.subtitle}>Step 22 will add React hooks reference</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117' },
  title: { fontSize: 24, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b' },
});
