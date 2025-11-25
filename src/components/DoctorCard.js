import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, shadows } from '../theme/colors';

export const DoctorCard = ({ doctor, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.card, shadows.card]}
    activeOpacity={0.9}
  >
    <View style={styles.header}>
      <Text style={styles.name}>{doctor.name}</Text>
      <View style={styles.rating}>
        <Ionicons name="star" size={16} color={palette.lime} />
        <Text style={styles.ratingText}>{doctor.rating}</Text>
      </View>
    </View>
    <Text style={styles.specialty}>{doctor.specialty}</Text>
    <View style={styles.meta}>
      <View style={styles.metaItem}>
        <Ionicons name="location" size={16} color={palette.neon} />
        <Text style={styles.metaText}>{doctor.distance} km</Text>
      </View>
      <View style={styles.metaItem}>
        <Ionicons name="cash" size={16} color={palette.neon} />
        <Text style={styles.metaText}>${doctor.price}</Text>
      </View>
    </View>
    <View style={styles.tags}>
      {doctor.tags.map((tag) => (
        <View key={tag} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.graphite,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: palette.frost,
    fontSize: 18,
    fontWeight: '600',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingText: {
    color: palette.frost,
    fontWeight: '600',
  },
  specialty: {
    color: palette.slate,
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: palette.frost,
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: 'rgba(56,189,248,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    color: palette.electric,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

