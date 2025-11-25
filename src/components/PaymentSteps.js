import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme/colors';

export const PaymentSteps = ({ steps }) => (
  <View style={styles.container}>
    {steps.map((step) => (
      <View key={step.label} style={styles.row}>
        <View
          style={[
            styles.iconWrapper,
            step.status === 'done' && styles.iconDone,
            step.status === 'in-progress' && styles.iconProgress,
          ]}
        >
          <Ionicons
            name={
              step.status === 'done'
                ? 'checkmark'
                : step.status === 'error'
                ? 'close'
                : 'radio-button-on'
            }
            size={16}
            color={step.status === 'pending' ? palette.slate : palette.jet}
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.label}>{step.label}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>
        <Text style={styles.state}>{step.status}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.graphite,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDone: {
    backgroundColor: palette.lime,
  },
  iconProgress: {
    backgroundColor: palette.neon,
  },
  copy: {
    flex: 1,
  },
  label: {
    color: palette.frost,
    fontWeight: '600',
  },
  description: {
    color: palette.slate,
    fontSize: 12,
  },
  state: {
    color: palette.slate,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});

