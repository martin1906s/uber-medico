import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gradients, palette } from '../theme/colors';

export const SubscriptionCard = ({ status, onRenew }) => (
  <LinearGradient colors={gradients.pulse} style={styles.container}>
    <View>
      <Text style={styles.label}>Plan profesional</Text>
      <Text style={styles.plan}>{status.plan} · {status.status}</Text>
      <Text style={styles.meta}>Renovación: {status.renewsAt}</Text>
    </View>
    <TouchableOpacity style={styles.button} onPress={onRenew}>
      <Ionicons name="reload" size={20} color={palette.jet} />
      <Text style={styles.buttonText}>Renovar</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    color: palette.frost,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  plan: {
    color: palette.frost,
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 4,
  },
  meta: {
    color: 'rgba(255,255,255,0.8)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.frost,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  buttonText: {
    color: palette.jet,
    fontWeight: '700',
  },
});

