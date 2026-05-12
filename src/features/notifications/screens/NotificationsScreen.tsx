import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const NotificationsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Notifications</Text>
    <Text style={styles.subtitle}>Step 19 will add FCM + Notifee</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117' },
  title: { fontSize: 24, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b' },
});
