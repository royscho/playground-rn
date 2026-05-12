import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const RegisterScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Register</Text>
    <Text style={styles.subtitle}>Step 4 will add auth logic</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117' },
  title: { fontSize: 24, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b' },
});
