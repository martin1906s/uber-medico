import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { palette } from '../theme/colors';

export const LogoutButton = () => {
  const { logout } = useAppContext();

  return (
    <TouchableOpacity style={styles.button} onPress={logout}>
      <Ionicons name="log-out-outline" size={18} color={palette.neon} />
      <Text style={styles.text}>Salir</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,250,252,0.2)',
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  text: {
    color: palette.frost,
    fontWeight: '600',
  },
});


