import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { palette } from '../theme/colors';

export const MyAppointmentsScreen = () => {
  const { appointments, setAppointments } = useAppContext();

  const handleAppointmentPress = (appointment) => {
    try {
      const doctor = appointment.doctor || {};
      
      // Construir mensaje de detalles
      let message = `PROFESIONAL:\n${doctor.name || 'No especificado'}\n\n`;
      message += `ESPECIALIDAD:\n${doctor.specialty || 'No especificada'}\n\n`;
      message += `CLÍNICA:\n${doctor.clinic || 'No especificada'}\n\n`;
      message += `FECHA:\n${appointment.date || 'No especificada'}\n\n`;
      message += `HORA:\n${appointment.slot || 'No especificada'}\n\n`;
      message += `MODALIDAD:\n${appointment.type || 'No especificada'}\n\n`;
      message += `PRECIO:\n$${appointment.price || 0} USD\n\n`;
      message += `ESTADO:\n${appointment.status || 'No especificado'}\n\n`;

      if (doctor.rating) {
        message += `CALIFICACIÓN:\n${doctor.rating}/5.0\n\n`;
      }

      if (doctor.distance !== undefined) {
        message += `DISTANCIA:\n${doctor.distance} km\n\n`;
      }

      if (doctor.tags && doctor.tags.length > 0) {
        message += `ETIQUETAS:\n${doctor.tags.join(', ')}\n\n`;
      }

      if (doctor.bio) {
        message += `DESCRIPCIÓN:\n${doctor.bio}`;
      }

      const buttons = [
        { text: 'Cerrar', style: 'cancel' },
      ];

      if (appointment.status === 'pendiente de pago') {
        buttons.push({
          text: 'Pagar ahora',
          onPress: () => {
            Alert.alert('Información', 'Esta cita ya fue procesada. Si necesitas pagar otra cita, selecciónala desde la lista.');
          },
        });
      }

      if (appointment.status !== 'cancelada' && appointment.status !== 'confirmada') {
        buttons.push({
          text: 'Cancelar cita',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Cancelar cita',
              `¿Estás seguro de que deseas cancelar tu cita con ${doctor.name || 'el profesional'}?\n\nFecha: ${appointment.date}\nHora: ${appointment.slot}`,
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Sí, cancelar',
                  style: 'destructive',
                  onPress: () => {
                    const updatedAppointments = appointments.map((apt) =>
                      apt.id === appointment.id ? { ...apt, status: 'cancelada' } : apt,
                    );
                    setAppointments(updatedAppointments);
                    Alert.alert('Cita cancelada', 'Tu cita ha sido cancelada exitosamente.');
                  },
                },
              ],
            );
          },
        });
      }

      Alert.alert('Detalles de la cita', message, buttons);
    } catch (error) {
      console.error('Error al mostrar detalles de la cita:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles de la cita. Por favor intenta nuevamente.');
    }
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis citas</Text>
        {appointments.length === 0 ? (
          <Text style={styles.empty}>Aún no has reservado. Explora especialistas.</Text>
        ) : (
          appointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.card}
              onPress={() => handleAppointmentPress(appointment)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.doctor}>{appointment.doctor.name}</Text>
                <Ionicons name="chevron-forward" size={20} color={palette.slate} />
              </View>
              <Text style={styles.meta}>
                {appointment.date} · {appointment.slot} · {appointment.type}
              </Text>
              <View style={styles.row}>
                <Text style={styles.price}>${appointment.price}</Text>
                <Text
                  style={[
                    styles.badge,
                    appointment.status === 'confirmada'
                      ? styles.badgeSuccess
                      : appointment.status === 'cancelada'
                      ? styles.badgeCanceled
                      : styles.badgePending,
                  ]}
                >
                  {appointment.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.jet,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    color: palette.frost,
    fontSize: 24,
    fontWeight: '700',
  },
  empty: {
    color: palette.slate,
  },
  card: {
    backgroundColor: palette.graphite,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctor: {
    color: palette.frost,
    fontWeight: '600',
  },
  meta: {
    color: palette.slate,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    color: palette.frost,
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    textTransform: 'uppercase',
    fontSize: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    color: '#34D399',
  },
  badgePending: {
    backgroundColor: 'rgba(251,191,36,0.2)',
    color: '#FBBF24',
  },
  badgeCanceled: {
    backgroundColor: 'rgba(219,39,119,0.2)',
    color: palette.magenta,
  },
});

