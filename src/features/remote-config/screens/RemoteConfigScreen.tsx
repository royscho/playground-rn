import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const RemoteConfigScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Remote Config</Text>
    <Text style={styles.subtitle}>Step 30 will add Firebase Remote Config</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117' },
  title: { fontSize: 24, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b' },
});
