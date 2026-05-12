import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { PostsStackParamList } from '@/app/navigation/types';

type PostDetailRouteProp = RouteProp<PostsStackParamList, 'PostDetail'>;

export const PostDetailScreen = () => {
  const { params } = useRoute<PostDetailRouteProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post #{params.id}</Text>
      <Text style={styles.subtitle}>Step 7 will add full post detail</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117' },
  title: { fontSize: 24, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b' },
});
