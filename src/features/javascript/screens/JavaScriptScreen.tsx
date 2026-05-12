import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const JavaScriptScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>JavaScript</Text>
    <Text style={styles.subtitle}>Step 21 will add JS concepts reference</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117' },
  title: { fontSize: 24, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b' },
});
